#!/usr/bin/env python3
"""
ITExams CompTIA CY0-001 Scraper  (with login support)
--------------------------------------------------------
Scrapes all questions from https://www.itexams.com/exam/CY0-001
and outputs a JSON file compatible with the Practice Exam simulator.

Pages 1-3 are public. Pages 4+ require a free itexams.com account.
Pass --email and --password to authenticate automatically.

Usage:
  # Public pages only (no account needed):
  python3 scraper_itexams.py

  # All 126 questions (requires free itexams.com account):
  python3 scraper_itexams.py --email you@example.com --password yourpass

  # Different exam:
  python3 scraper_itexams.py --exam CS0-003 --email you@example.com --password yourpass --output cs0_003.json

Requirements:
  pip install requests beautifulsoup4 cloudscraper
"""

import argparse
import json
import re
import sys
import time

BASE_URL  = "https://www.itexams.com"
LOGIN_URL = f"{BASE_URL}/accounts/login"
EXAM_ID   = "CY0-001"

# ──────────────────────────────────────────────
# CLI
# ──────────────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(description="Scrape ITExams questions to JSON.")
    parser.add_argument("--exam",     default=EXAM_ID,   help=f"ITExams exam code (default: {EXAM_ID})")
    parser.add_argument("--pages",    type=int, default=0,
                        help="Total pages to scrape (0 = auto-detect)")
    parser.add_argument("--output",   default="cy0_001_questions.json")
    parser.add_argument("--delay",    type=float, default=1.5,
                        help="Seconds between requests (default 1.5)")
    parser.add_argument("--prefix",   default="cy0",
                        help="ID prefix for generated question IDs")
    parser.add_argument("--email",    default="",
                        help="ITExams account email (required for pages 4+)")
    parser.add_argument("--password", default="",
                        help="ITExams account password")
    return parser.parse_args()


# ──────────────────────────────────────────────
# HTTP SESSION
# ──────────────────────────────────────────────
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer":         "https://www.itexams.com/",
}

_session = None  # module-level requests.Session, reused across calls

def get_session():
    global _session
    if _session is None:
        try:
            import cloudscraper
            _session = cloudscraper.create_scraper(
                browser={"browser": "chrome", "platform": "darwin", "desktop": True}
            )
        except ImportError:
            import requests
            _session = requests.Session()
        _session.headers.update(HEADERS)
    return _session


def login(email: str, password: str) -> bool:
    """POST credentials to itexams.com and store the session cookie."""
    if not email or not password:
        return False

    s = get_session()
    print(f"[*] Logging in as {email} ...")
    try:
        # First GET the login page to pick up any CSRF tokens / cookies
        s.get(LOGIN_URL, timeout=15)
        r = s.post(
            LOGIN_URL,
            data={"act": "login", "email": email, "pass": password},
            headers={**HEADERS, "Referer": LOGIN_URL,
                     "Content-Type": "application/x-www-form-urlencoded"},
            timeout=15,
            allow_redirects=True,
        )
        # If the response still shows the login form we failed
        if 'name="pass"' in r.text or '"jsErr"' in r.text:
            print("[!] Login failed — check your email / password.")
            return False
        print("[+] Login successful.")
        return True
    except Exception as e:
        print(f"[!] Login error: {e}")
        return False


def fetch(url: str) -> str | None:
    """Fetch a page using the shared session (carries auth cookies)."""
    s = get_session()
    try:
        r = s.get(url, timeout=20)
        if r.status_code == 200:
            return r.text
        print(f"  [!] HTTP {r.status_code} for {url}")
    except Exception as e:
        print(f"  [!] Fetch error for {url}: {e}")
    return None


def is_login_wall(html: str) -> bool:
    """Return True if the page is the login redirect instead of questions."""
    return bool(html and 'section class="login"' in html)



# ──────────────────────────────────────────────
# PARSING
# ──────────────────────────────────────────────
def page_url(exam: str, page: int) -> str:
    if page == 1:
        return f"{BASE_URL}/exam/{exam}"
    return f"{BASE_URL}/exam/{exam}/{page}"


def detect_total_pages(html: str) -> int:
    """Read the 'Page: X / N' element to find total pages."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    # <div><span>Page:</span> <span>1 </span> / <span>26</span></div>
    for div in soup.select("div.examsPage__nav-r div, div.examsPage__subfooter-info div"):
        spans = div.find_all("span")
        if spans and spans[0].get_text(strip=True).lower() == "page:":
            try:
                total = int(spans[-1].get_text(strip=True))
                return total
            except ValueError:
                pass
    return 1


def clean(text: str) -> str:
    """Strip excess whitespace and normalise newlines."""
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_answer(raw: str) -> list[str] | str:
    """
    itexams stores answer as a string of letters, e.g. "A", "AD", "BCD".
    Returns a list if multi-select, a plain string if single.
    """
    letters = [c for c in raw.upper() if c.isalpha()]
    if len(letters) > 1:
        return letters       # multi-select
    return letters[0] if letters else "A"


def parse_page(html: str, prefix: str, page_num: int) -> list[dict]:
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    results = []

    question_divs = soup.select("div.examsPage__question")
    for div in question_divs:
        try:
            # ── Question number ────────────────────────────
            header = div.select_one("span.title")
            q_num_text = header.get_text(strip=True) if header else ""
            # Extract numeric ID from "Question #42 (Topic: ...)"
            m = re.search(r"#(\d+)", q_num_text)
            q_num = int(m.group(1)) if m else 0

            # ── Question text ──────────────────────────────
            body = div.select_one("div.examsPage__question-body")
            if not body:
                continue
            # The question text lives in the first <span> (or direct text nodes)
            q_span = body.find("span", recursive=False)
            if q_span:
                # Replace <br> tags with newline before extracting text
                for br in q_span.find_all("br"):
                    br.replace_with("\n")
                q_text = clean(q_span.get_text())
            else:
                q_text = clean(body.get_text())

            if not q_text:
                continue

            # ── Options ────────────────────────────────────
            option_spans = body.select("span.examsPage__question-answer")
            options = []
            for opt in option_spans:
                opt_text = clean(opt.get_text())
                if opt_text:
                    options.append(opt_text)

            if len(options) < 2:
                continue

            # ── Answer ─────────────────────────────────────
            ans_div = div.select_one("div.examsPage__question-correct-answer")
            raw_ans = ""
            if ans_div:
                strong = ans_div.find("strong")
                raw_ans = strong.get_text(strip=True) if strong else ans_div.get_text(strip=True)
            answer = parse_answer(raw_ans) if raw_ans else "A"

            # ── Multi-select detection ─────────────────────
            is_multi = isinstance(answer, list)
            select_count = len(answer) if is_multi else 1

            # If question text says "choose X" or "select X", trust that too
            choose_m = re.search(
                r"choose\s+(\w+)|select\s+(\w+)",
                q_text, re.IGNORECASE
            )
            if choose_m and not is_multi:
                word = (choose_m.group(1) or choose_m.group(2)).lower()
                num_words = {"two": 2, "three": 3, "four": 4, "five": 5,
                             "2": 2, "3": 3, "4": 4, "5": 5}
                if word in num_words and num_words[word] > 1:
                    is_multi = True
                    select_count = num_words[word]

            results.append({
                "id":          f"{prefix}-{q_num or (page_num * 100 + len(results) + 1)}",
                "type":        "mcq",
                "multiSelect": is_multi,
                "selectCount": select_count,
                "domain":      infer_domain(q_text, options),
                "question":    q_text,
                "options":     options,
                "answer":      answer,
                "explanation": f"Source: ITExams CY0-001 Question #{q_num}. "
                               "Community-verified answer.",
                "image":       None,
            })

        except Exception as e:
            print(f"    [!] Error parsing a question on page {page_num}: {e}")
            continue

    return results


# ──────────────────────────────────────────────
# DOMAIN INFERENCE (CompTIA SecAI+ CY0-001 domains)
# ──────────────────────────────────────────────
_DOMAIN_KEYWORDS = [
    # (domain string, keyword list)
    ("Domain 2.0: Securing AI Systems",
     ["prompt injection", "poisoning", "adversarial", "guardrail", "leakage", "jailbreak",
      "evasion", "inversion", "model stealing", "membership inference", "sanitize",
      "encryption", "masking", "security control", "harden", "rate limit", "token quota",
      "data at rest", "data security", "access control", "role-based"]),
    ("Domain 3.0: AI-Assisted Security",
     ["triage", "siem", "alert", "incident", "detection", "automation", "soar",
      "security operations", "copilot", "assistant", "threat analysis", "monitoring",
      "runtime", "log", "debugging", "stack call"]),
    ("Domain 4.0: AI Governance, Risk, and Compliance",
     ["governance", "audit", "compliance", "regulation", "framework", "nist", "eu ai act",
      "act", "policy", "standard", "legal", "ethical", "bias", "fairness",
      "transparency", "explainability", "privacy", "risk management", "risk"]),
]
_DEFAULT_DOMAIN = "Domain 1.0: Basic AI Concepts Related to Cybersecurity"

def infer_domain(question: str, options: list[str]) -> str:
    combined = (question + " " + " ".join(options)).lower()
    for domain, keywords in _DOMAIN_KEYWORDS:
        if any(kw in combined for kw in keywords):
            return domain
    return _DEFAULT_DOMAIN


# ──────────────────────────────────────────────
# DEDUP
# ──────────────────────────────────────────────
def deduplicate(questions: list[dict]) -> list[dict]:
    seen, unique, skipped = set(), [], 0
    for q in questions:
        key = re.sub(r"\s+", " ", q.get("question", "").lower().strip())
        if key in seen:
            skipped += 1
            continue
        seen.add(key)
        unique.append(q)
    if skipped:
        print(f"  -> Removed {skipped} duplicate(s).")
    return unique


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
def main():
    try:
        from bs4 import BeautifulSoup  # noqa: F401 — just verify it's installed
    except ImportError:
        print("[!] beautifulsoup4 is required: pip install beautifulsoup4")
        sys.exit(1)

    args = parse_args()
    print(f"[*] ITExams Scraper — Exam: {args.exam}")
    print(f"[*] Output: {args.output}")

    # ── Page 1: detect total pages if not specified ────
    print(f"\n[*] Fetching page 1 to detect total pages...")
    html1 = fetch(page_url(args.exam, 1))
    if not html1:
        print("[!] Could not fetch page 1. Aborting.")
        sys.exit(1)

    total_pages = args.pages if args.pages > 0 else detect_total_pages(html1)
    print(f"[*] Total pages detected: {total_pages}")

    all_questions: list[dict] = []

    # ── Parse page 1 (already fetched) ────────────────
    qs = parse_page(html1, args.prefix, 1)
    print(f"  -> Page 1: {len(qs)} question(s)")
    all_questions.extend(qs)

    # ── Remaining pages ────────────────────────────────
    for page in range(2, total_pages + 1):
        url = page_url(args.exam, page)
        print(f"[*] Fetching page {page}/{total_pages}: {url}")
        time.sleep(args.delay)

        html = fetch(url)
        if not html:
            print(f"  [!] Skipping page {page} — fetch failed.")
            continue

        qs = parse_page(html, args.prefix, page)
        print(f"  -> Page {page}: {len(qs)} question(s)")
        all_questions.extend(qs)

    # ── Deduplicate ────────────────────────────────────
    print(f"\n[*] Deduplicating {len(all_questions)} question(s)...")
    all_questions = deduplicate(all_questions)
    print(f"[+] Unique questions: {len(all_questions)}")

    # ── Save ───────────────────────────────────────────
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)

    print(f"\n[+] Done! Saved {len(all_questions)} questions → {args.output}")
    print(f"    To add to the simulator, append the array into questions.js")


if __name__ == "__main__":
    main()
