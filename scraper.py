#!/opt/anaconda3/bin/python3
"""
FreeCram CompTIA CySA+ CS0-003 Scraper
----------------------------------------
Scrapes all 313 questions from:
  https://www.freecram.net/torrent/CuramSoftware.CS0-003.v2026-09-21.q313.html

Strategy:
  1. Fetch the torrent index page to get all question URLs
  2. Visit each question page and parse:
       - Question text          →  div.qa-question
       - Answer options         →  div.qa-options > label.radio
       - Correct answer         →  div.qa-answerexp > span[color:red]
       - Explanation text       →  div.qa_explanation
       - Exhibit images         →  img tags in qa-question / qa_explanation
  3. Output → questions2.json  +  questions2.js

Usage:
  python3 scraper.py                          # scrape all 313 questions
  python3 scraper.py --limit 20               # test with first 20
  python3 scraper.py --delay 1.0              # faster requests
  python3 scraper.py --output-js myfile.js    # custom output

Requirements:
  pip install beautifulsoup4 requests
"""

import argparse
import copy
import json
import re
import sys
import time

# ──────────────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────────────
TORRENT_URL   = "https://www.freecram.net/torrent/CuramSoftware.CS0-003.v2026-09-21.q313.html"
BASE_DOMAIN   = "https://www.freecram.net"
TORRENT_SLUG  = "CuramSoftware.CS0-003.v2026-09-21.q313"
DEFAULT_DELAY = 1.5

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer":         "https://www.freecram.net/",
}

# ──────────────────────────────────────────────────────────────
# CySA+ CS0-003 Domain Inference
# ──────────────────────────────────────────────────────────────
_DOMAIN_RULES = [
    ("Domain 2.0: Vulnerability Management", [
        "vulnerability", "cvss", "scan", "patch", "remediat", "cve",
        "exploit", "nessus", "openvas", "qualys", "risk score",
        "false positive", "false negative", "severity", "pen test",
        "penetration test", "vulnerability assessment", "zero-day",
    ]),
    ("Domain 3.0: Incident Response and Management", [
        "incident", "containment", "eradicat", "recovery", "forensic",
        "chain of custody", "evidence", "ioc", "indicator of compromise",
        "playbook", "runbook", "malware", "rootkit", "ransomware",
        "memory dump", "volatile", "artifact", "triage", "threat hunt",
    ]),
    ("Domain 4.0: Reporting and Communication", [
        "report", "executive", "kpi", "kri", "tlp", "stakeholder",
        "sla", "dashboard", "metrics", "communication",
        "audit", "findings", "business impact", "risk register",
        "business continuity", "bcp", "rpo", "rto", "continuity plan",
    ]),
]
_DEFAULT_DOMAIN = "Domain 1.0: Security Operations"


def infer_domain(question, options):
    combined = (question + " " + " ".join(options)).lower()
    for domain, keywords in _DOMAIN_RULES:
        if any(kw in combined for kw in keywords):
            return domain
    return _DEFAULT_DOMAIN


# ──────────────────────────────────────────────────────────────
# HTTP SESSION  (handles __ckreal anti-bot cookie challenge)
# ──────────────────────────────────────────────────────────────
_session = None


def get_session():
    """Create a requests.Session with default headers."""
    global _session
    if _session is None:
        import requests
        _session = requests.Session()
        _session.headers.update(HEADERS)
        print("[*] HTTP session created.")
    return _session


def fetch(url, max_retries=3):
    """
    Fetch a URL, automatically solving the __ckreal cookie challenge.

    FreeCram returns HTTP 429 with a tiny JS snippet:
        var a='<token>'; ... document.cookie='__ckreal='+a+';path=/';
    We extract that token, set the cookie, and re-request.
    """
    s = get_session()

    for attempt in range(max_retries):
        try:
            r = s.get(url, timeout=25)
        except Exception as e:
            print(f"  [!] Network error (attempt {attempt+1}): {e}")
            time.sleep(2)
            continue

        # ── Solve __ckreal challenge if present ────────────────
        if "__ckreal" in r.text and r.status_code in (200, 403, 429):
            m = re.search(r"var a='([^']+)'", r.text)
            if m:
                token = m.group(1)
                s.cookies.set("__ckreal", token, domain="www.freecram.net")
                try:
                    r = s.get(url, timeout=25)
                except Exception as e:
                    print(f"  [!] Retry after cookie failed: {e}")
                    time.sleep(2)
                    continue

        if r.status_code == 200 and "<title>" in r.text:
            return r.text

        # If we still got a non-200, wait and retry
        if attempt < max_retries - 1:
            print(f"  [!] HTTP {r.status_code} for {url} — retrying ({attempt+2}/{max_retries})...")
            time.sleep(3)

    print(f"  [!] Failed after {max_retries} attempts: {url}")
    return None


# ──────────────────────────────────────────────────────────────
# STEP 1: Parse torrent page → collect all question URLs
# ──────────────────────────────────────────────────────────────
def get_question_urls(torrent_html):
    """Extract all /question/ links from the torrent index page."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(torrent_html, "html.parser")

    urls = []
    seen = set()
    pattern = f"/question/{TORRENT_SLUG}/"

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if pattern in href:
            full = href if href.startswith("http") else BASE_DOMAIN + href
            if full not in seen:
                seen.add(full)
                urls.append(full)

    return urls


# ──────────────────────────────────────────────────────────────
# STEP 2: Parse a single question page
# ──────────────────────────────────────────────────────────────
def clean(text):
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def parse_question_page(html, q_index):
    """
    FreeCram page structure (confirmed from live inspection):

      <div class="qa">
        <div>
          <span class="pull-right">
            <a class="btn btn-sm btn-success" href="...">Next Question >></a>
          </span>
          <h4>Question <span class="text-danger">1</span>/313</h4>
        </div>

        <div class="qa-question">
          Question text here...
          <img src="..." />              ← optional exhibit image
        </div>

        <div class="qa-options">
          <p><label class="radio">
            <input class="option_A" name="ipt_options" type="radio" value="A"/>
            <strong>A.</strong> Option text
          </label></p>
          ...
        </div>

        <div class="qa-answerexp" style="display:none;">
          <div>
            Correct Answer:
            <span style="font-size:18px;color:red;">D</span>
          </div>
          <div class="qa_explanation">
            Explanation text...
            <img src="..." />            ← optional explanation image
          </div>
        </div>
      </div>
    """
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    qa = soup.find("div", class_="qa")
    if not qa:
        return None, None

    # ── Question number ───────────────────────────────────────
    q_num = q_index
    h4 = qa.find("h4")
    if h4:
        m = re.search(r"Question\s+(\d+)", h4.get_text())
        if m:
            q_num = int(m.group(1))

    # ── Next URL ─────────────────────────────────────────────
    next_url = None
    next_a = qa.find("a", class_=re.compile(r"btn-success"))
    if next_a and next_a.get("href"):
        href = next_a["href"]
        next_url = href if href.startswith("http") else BASE_DOMAIN + href

    # ── Question text & images ────────────────────────────────
    q_div = qa.find("div", class_="qa-question")
    q_text = ""
    question_images = []

    if q_div:
        # Collect exhibit images from the question area
        for img in q_div.find_all("img"):
            src = img.get("src", "")
            if src and not any(ad in src for ad in ["adts", "downpdf", "google", "adsbygoogle"]):
                question_images.append(src)

        # Convert <br> to newlines for multi-line questions
        for br in q_div.find_all("br"):
            br.replace_with("\n")

        q_text = clean(q_div.get_text())

    if not q_text:
        return None, next_url

    # ── Options (div.qa-options > label.radio) ────────────────
    options = []
    opt_container = qa.find("div", class_="qa-options")

    if opt_container:
        for label in opt_container.find_all("label", class_=re.compile(r"radio|checkbox")):
            # Deep-copy the label so we don't mutate the tree
            lbl = copy.copy(label)

            # Extract option letter from <input>
            inp = lbl.find("input")
            letter = ""
            if inp:
                letter = inp.get("value", "").strip().upper()
                if not letter:
                    for cls in (inp.get("class") or []):
                        m = re.match(r"option_([A-Z])", cls, re.IGNORECASE)
                        if m:
                            letter = m.group(1).upper()
                            break
                inp.decompose()

            # Remove the <strong>A.</strong> prefix element if present
            strong = lbl.find("strong")
            if strong and re.match(r"^[A-Z]\.?\s*$", strong.get_text().strip()):
                strong.decompose()

            # Convert <br> to newlines for multi-line options
            for br in lbl.find_all("br"):
                br.replace_with("\n")

            opt_text = lbl.get_text().strip()
            # Strip any remaining "A." or "A " prefix
            opt_text = re.sub(r"^[A-F][.\:)]\s*", "", opt_text).strip()

            if not letter:
                # Last resort: infer letter from option text
                m2 = re.match(r"^([A-F])[.\:)]\s+", label.get_text().strip())
                if m2:
                    letter = m2.group(1).upper()

            if letter and opt_text:
                options.append(f"{letter}. {opt_text}")

    # ── Correct answer & explanation (div.qa-answerexp) ────────
    correct_letters = []
    explanation_text = ""
    explanation_images = []

    answerexp = qa.find("div", class_="qa-answerexp")
    if answerexp:
        # Method 1: Red-colored span (most reliable)
        ans_span = answerexp.find("span", style=re.compile(r"color:\s*red", re.IGNORECASE))
        if ans_span:
            raw = ans_span.get_text(strip=True).upper()
            correct_letters = [c for c in raw if c in "ABCDEF"]

        # Method 2: Fallback to "Correct Answer:" text parsing
        if not correct_letters:
            ans_text = answerexp.get_text()
            ca_m = re.search(r"Correct\s+Answer[:\s]+([A-F,\s]+)", ans_text, re.IGNORECASE)
            if ca_m:
                raw = ca_m.group(1).strip()
                correct_letters = [c for c in raw.upper() if c in "ABCDEF"]

        # Explanation
        expl_div = answerexp.find("div", class_="qa_explanation")
        if expl_div:
            # Collect explanation images
            for img in expl_div.find_all("img"):
                src = img.get("src", "")
                if src and not any(ad in src for ad in ["adts", "downpdf", "google", "adsbygoogle"]):
                    explanation_images.append(src)

            for br in expl_div.find_all("br"):
                br.replace_with("\n")

            explanation_text = clean(expl_div.get_text())

    # ── Determine primary image URL ───────────────────────────
    image_url = None
    all_images = question_images + explanation_images
    if all_images:
        image_url = all_images[0]

    # ── Fallback correct letter ───────────────────────────────
    if not correct_letters and options:
        correct_letters = ["A"]

    # ── Multi-select detection ────────────────────────────────
    is_multi = len(correct_letters) > 1
    select_count = len(correct_letters) if is_multi else 1

    choose_m = re.search(r"(?:choose|select)\s+(\w+)", q_text, re.IGNORECASE)
    if choose_m and not is_multi:
        word = choose_m.group(1).lower()
        word_map = {"two": 2, "three": 3, "four": 4, "five": 5,
                    "2": 2, "3": 3, "4": 4, "5": 5}
        if word in word_map and word_map[word] > 1:
            is_multi = True
            select_count = word_map[word]

    answer = correct_letters if is_multi else (correct_letters[0] if correct_letters else "A")

    # ── Determine question type ───────────────────────────────
    q_type = "mcq"
    if "simulation" in q_text.lower()[:20] or not options:
        q_type = "info"  # Simulation / PBQ placeholder — no selectable options

    result = {
        "id":          f"fc-cs0003-{q_num}",
        "type":        q_type,
        "multiSelect": is_multi,
        "selectCount": select_count,
        "domain":      infer_domain(q_text, options),
        "question":    q_text,
        "options":     options,
        "answer":      answer,
        "explanation": explanation_text or f"Source: FreeCram CS0-003 Question #{q_num}.",
        "image":       image_url,
    }

    return result, next_url


# ──────────────────────────────────────────────────────────────
# DEDUP
# ──────────────────────────────────────────────────────────────
def deduplicate(questions):
    seen, unique, skipped = set(), [], 0
    for q in questions:
        key = re.sub(r"\s+", " ", q.get("question", "").lower().strip())
        if not key:
            continue
        if key in seen:
            skipped += 1
            continue
        seen.add(key)
        unique.append(q)
    if skipped:
        print(f"  -> Removed {skipped} duplicate(s).")
    return unique


# ──────────────────────────────────────────────────────────────
# JS FILE WRITER
# ──────────────────────────────────────────────────────────────
def write_js(questions, js_path, var_name="CYSA_QUESTIONS_2"):
    js_body = json.dumps(questions, indent=2, ensure_ascii=False)
    content = (
        f"// CompTIA CySA+ CS0-003 — FreeCram Scraped Questions\n"
        f"// Source: https://www.freecram.net/torrent/{TORRENT_SLUG}.html\n"
        f"// Auto-generated by scraper.py — {len(questions)} questions\n"
        f"const {var_name} = {js_body};\n"
    )
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[+] JS file written  -> {js_path}  ({len(questions)} questions, var={var_name})")


# ──────────────────────────────────────────────────────────────
# CLI
# ──────────────────────────────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(
        description="Scrape CySA+ CS0-003 questions from FreeCram (313 questions)."
    )
    parser.add_argument(
        "--torrent-url", default=TORRENT_URL, dest="torrent_url",
        help="FreeCram torrent index page URL"
    )
    parser.add_argument(
        "--delay", type=float, default=DEFAULT_DELAY,
        help=f"Seconds between requests (default: {DEFAULT_DELAY})"
    )
    parser.add_argument(
        "--output-json", default="questions2.json", dest="output_json",
        help="Output JSON filename (default: questions2.json)"
    )
    parser.add_argument(
        "--output-js", default="questions2.js", dest="output_js",
        help="Output JS filename (default: questions2.js)"
    )
    parser.add_argument(
        "--var-name", default="CYSA_QUESTIONS_2", dest="var_name",
        help="JS const variable name (default: CYSA_QUESTIONS_2)"
    )
    parser.add_argument(
        "--limit", type=int, default=0,
        help="Limit number of questions to scrape (0 = all 313)"
    )
    return parser.parse_args()


# ──────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────
def main():
    try:
        from bs4 import BeautifulSoup  # noqa
    except ImportError:
        print("[!] beautifulsoup4 is required:  pip install beautifulsoup4")
        sys.exit(1)

    args = parse_args()

    print("=" * 65)
    print("  CompTIA CySA+ CS0-003 — FreeCram Scraper")
    print("=" * 65)
    print(f"  Torrent  : {args.torrent_url}")
    print(f"  Delay    : {args.delay}s between requests")
    print(f"  JSON out : {args.output_json}")
    print(f"  JS out   : {args.output_js}")
    print(f"  Limit    : {'all' if args.limit == 0 else args.limit} questions")
    print("=" * 65)

    # ── Step 1: Get all question URLs from torrent index ───────
    print(f"\n[*] Fetching torrent index page...")
    torrent_html = fetch(args.torrent_url)
    if not torrent_html:
        print("[!] Could not fetch torrent index page. Aborting.")
        sys.exit(1)

    question_urls = get_question_urls(torrent_html)
    print(f"[+] Found {len(question_urls)} question URLs in torrent index.")

    if not question_urls:
        print("[!] No question URLs found. Page structure may have changed.")
        sys.exit(1)

    if args.limit > 0:
        question_urls = question_urls[:args.limit]
        print(f"[*] Limited to first {args.limit} questions.")

    # ── Step 2: Scrape each question page ──────────────────────
    all_questions = []
    total = len(question_urls)
    failed = 0

    for idx, url in enumerate(question_urls, start=1):
        slug = url.split("/")[-1][:55]
        print(f"[{idx:3d}/{total}] {slug}", end="  ", flush=True)

        html = fetch(url)
        if not html:
            print("SKIP (fetch failed)")
            failed += 1
            time.sleep(args.delay)
            continue

        q, _ = parse_question_page(html, idx)

        if q:
            all_questions.append(q)
            ans = q["answer"]
            ans_str = ",".join(ans) if isinstance(ans, list) else ans
            img_flag = " 🖼" if q.get("image") else ""
            print(f"✓  Ans={ans_str}{img_flag}")
        else:
            print("✗  (parse failed)")
            failed += 1

        if idx < total:
            time.sleep(args.delay)

    # ── Deduplicate ────────────────────────────────────────────
    print(f"\n[*] Deduplicating {len(all_questions)} question(s)...")
    all_questions = deduplicate(all_questions)

    print(f"\n{'='*65}")
    print(f"  Total scraped : {len(all_questions) + failed}")
    print(f"  Successfully  : {len(all_questions)}")
    print(f"  Failed/skipped: {failed}")
    print(f"{'='*65}")

    if not all_questions:
        print("\n[!] No questions were scraped.")
        print("    FreeCram may be blocking automated requests.")
        sys.exit(0)

    # ── Save JSON ──────────────────────────────────────────────
    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"[+] JSON written -> {args.output_json}")

    # ── Save JS ────────────────────────────────────────────────
    write_js(all_questions, args.output_js, args.var_name)

    print("\n[+] Done! To load in the simulator:")
    print(f"    1. Add <script src=\"{args.output_js}\"></script> to index.html")
    print(f"       (before app.js)")
    print(f"    2. In app.js, spread CYSA_QUESTIONS_2 into CYSA_QUESTIONS:")
    print(f"       const ALL_QUESTIONS = [...CYSA_QUESTIONS, ...CYSA_QUESTIONS_2];")


if __name__ == "__main__":
    main()
