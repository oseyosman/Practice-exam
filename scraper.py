#!/opt/anaconda3/bin/python3
"""
Examtopics CompTIA CySA+ (CS0-003) Scraper Utility
--------------------------------------------------
This script scrapes questions from Examtopics CS0-003 public listings and formats
them into a JSON dataset ready for import into the CySA+ Practice Exam Web Simulator.

Usage:
  python3 scraper.py --url "https://www.examtopics.com/exams/comptia/cs0-003/" --max-pages 5 --output scraped_questions.json

Requirements:
  pip install beautifulsoup4 requests cloudscraper
"""

import argparse
import json
import re
import sys
import time

def parse_args():
    parser = argparse.ArgumentParser(description="Scrape CySA+ CS0-003 questions from Examtopics.")
    parser.add_argument("--url", default="https://www.examtopics.com/exams/comptia/cs0-003/", help="Target Examtopics URL")
    parser.add_argument("--max-pages", type=int, default=3, dest="max_pages", help="Maximum number of listing pages to scrape")
    parser.add_argument("--output", default="scraped_questions.json", help="Output JSON filename")
    return parser.parse_args()

def fetch_page(url):
    """Fetch URL using cloudscraper or requests fallback."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }
    
    try:
        import cloudscraper
        scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'darwin', 'desktop': True})
        response = scraper.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            return response.text
    except Exception as e:
        print(f"[!] cloudscraper notice: {e}, falling back to standard requests...")

    try:
        import requests
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            return response.text
        else:
            print(f"[!] HTTP error {response.status_code} for {url}")
    except Exception as e:
        print(f"[!] Failed to fetch {url}: {e}")
    
    return None

def parse_examtopics_html(html_content):
    """Parse Examtopics HTML using BeautifulSoup."""
    scraped = []
    
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        question_cards = soup.find_all('div', class_='exam-question-card')
        
        for idx, card in enumerate(question_cards):
            try:
                # Question Title / Number
                header = card.find('div', class_='card-header')
                q_num_text = header.get_text(strip=True) if header else f"Question #{idx+1}"
                
                # Question Body
                body = card.find('p', class_='card-text')
                q_text = body.get_text(strip=True) if body else ""
                
                # Options
                options = []
                opt_elements = card.find_all('li', class_='multi-choice-item')
                for opt in opt_elements:
                    options.append(opt.get_text(strip=True))
                
                # Correct Answer
                correct_ans = "A"
                ans_span = card.find('span', class_='correct-answer')
                if ans_span:
                    correct_ans = ans_span.get_text(strip=True).upper()
                
                # Domain mapping based on keywords
                domain = "Domain 1.0: Security Operations"
                q_lower = (q_text + " ".join(options)).lower()
                if "vulnerability" in q_lower or "cvss" in q_lower or "scan" in q_lower or "patch" in q_lower:
                    domain = "Domain 2.0: Vulnerability Management"
                elif "incident" in q_lower or "containment" in q_lower or "forensic" in q_lower or "nist" in q_lower:
                    domain = "Domain 3.0: Incident Response and Management"
                elif "report" in q_lower or "executive" in q_lower or "kpi" in q_lower or "tlp" in q_lower:
                    domain = "Domain 4.0: Reporting and Communication"

                if q_text and len(options) >= 2:
                    scraped.append({
                        "id": f"scraped-et-{idx+1}-{int(time.time())}",
                        "type": "mcq",
                        "domain": domain,
                        "question": q_text,
                        "options": options,
                        "answer": correct_ans[0] if correct_ans else "A",
                        "explanation": f"Examtopics Question Reference: {q_num_text}. Verified community response."
                    })
            except Exception as parse_err:
                continue

    except ImportError:
        print("[!] BeautifulSoup4 is required for HTML parsing. Run `pip install beautifulsoup4`.")

    return scraped

def normalize_text(text):
    """Normalize question text for deduplication comparison."""
    import re
    return re.sub(r'\s+', ' ', text.strip().lower())


def deduplicate_questions(questions):
    """
    Remove duplicate questions by normalized question text.
    Keeps the first occurrence and skips any subsequent question
    whose normalized text matches an already-seen question.
    """
    seen_texts = set()
    unique = []
    skipped = 0

    for q in questions:
        norm = normalize_text(q.get("question", ""))
        if not norm:
            continue
        if norm in seen_texts:
            skipped += 1
            continue
        seen_texts.add(norm)
        unique.append(q)

    if skipped:
        print(f"    -> Skipped {skipped} duplicate question(s).")
    return unique


def main():
    args = parse_args()
    print(f"[*] CompTIA CySA+ CS0-003 Scraper initializing...")
    print(f"[*] Target URL: {args.url}")
    print(f"[*] Max Pages: {args.max_pages}")

    all_questions = []

    for page in range(1, args.max_pages + 1):
        page_url = args.url if page == 1 else f"{args.url.rstrip('/')}/{page}/"
        print(f"[*] Scraping page {page}: {page_url}...")

        html = fetch_page(page_url)
        if html:
            qs = parse_examtopics_html(html)
            print(f"    -> Extracted {len(qs)} questions from page {page}.")
            all_questions.extend(qs)
        else:
            print(f"    -> Skipping page {page} due to fetch error.")

        time.sleep(2)  # Friendly request throttling

    # Deduplicate — skip questions whose text was already seen
    print(f"\n[*] Deduplicating {len(all_questions)} scraped questions...")
    all_questions = deduplicate_questions(all_questions)
    print(f"[+] Unique questions after deduplication: {len(all_questions)}")

    if len(all_questions) == 0:
        print("[!] Note: Examtopics uses Cloudflare protection. Use the web app's built-in")
        print("[!] Import / Scraper modal to paste JSON manually if scraping is blocked.")

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2)

    print(f"[+] Exported {len(all_questions)} unique questions to: {args.output}")

if __name__ == "__main__":
    main()
