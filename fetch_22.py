import requests
import re
import json
import time
from bs4 import BeautifulSoup

URLS = {
    "fc-cs0003-57": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-a-healthcare-organization-must-develop-an-action-plan-based-on-the-findings-from-a-risk-assessment",
    "fc-cs0003-63": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/a-group-of-hacktivists-has-breached-and-exfiltrated-data-from-several-of-a-bank-s-competitors-given",
    "fc-cs0003-79": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-approximately-100-employees-at-your-company-have-received-a-phishing-email-as-a-security",
    "fc-cs0003-84": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/which-of-the-following-entities-should-an-incident-manager-work-with-to-ensure-correct-processes-are",
    "fc-cs0003-105": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/executives-at-an-organization-email-sensitive-financial-information-to-external-business-partners-when",
    "fc-cs0003-128": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/hotspot-question-a-healthcare-organization-must-develop-an-action-plan-based-on-the-findings-from-a-risk",
    "fc-cs0003-151": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/which-of-the-following-best-describe-the-external-requirements-that-are-imposed-for-incident-management",
    "fc-cs0003-157": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-an-organization-has-noticed-large-amounts-of-data-are-being-sent-out-of-its-network-an-analyst",
    "fc-cs0003-160": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/a-cybersecurity-analyst-needs-to-harden-a-server-that-is-currently-being-used-as-a-web-server-the-server",
    "fc-cs0003-164": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/while-a-security-analyst-for-an-organization-was-reviewing-logs-from-web-servers-the-analyst-found-several",
    "fc-cs0003-172": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/a-security-analyst-received-an-alert-regarding-multiple-successful-mfa-log-ins-for-a-particular-user",
    "fc-cs0003-192": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/a-company-s-internet-facing-web-application-has-been-compromised-several-times-due-to-identified-design",
    "fc-cs0003-197": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/several-vulnerability-scan-reports-have-indicated-runtime-errors-as-the-code-is-executing-the-dashboard",
    "fc-cs0003-199": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/which-of-the-following-explains-why-a-company-might-reprioritize-a-vulnerability-score-choose-two",
    "fc-cs0003-212": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/the-chief-information-security-officer-for-an-organization-recently-received-approval-to-install-a-new",
    "fc-cs0003-224": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/the-soc-receives-a-number-of-complaints-regarding-a-recent-uptick-in-desktop-error-messages-that-are",
    "fc-cs0003-229": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/an-analyst-is-trying-to-capture-anomalous-traffic-from-a-compromised-host-which-of-the-following-are",
    "fc-cs0003-240": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-welcome-to-the-enterprise-help-desk-system-please-work-the-ticket-escalated-to-you-in-the",
    "fc-cs0003-266": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-you-are-a-cybersecurity-analyst-tasked-with-interpreting-scan-data-from-company-a-s-servers",
    "fc-cs0003-286": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-a-company-recently-experienced-a-security-incident-the-security-team-has-determined-a-user",
    "fc-cs0003-290": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/a-security-analyst-must-review-a-suspicious-email-to-determine-its-legitimacy-which-of-the-following",
    "fc-cs0003-313": "https://www.freecram.net/question/CuramSoftware.CS0-003.v2026-09-21.q313/simulation-you-are-a-penetration-tester-who-is-reviewing-the-system-hardening-guidelines-for-a-company-s"
}

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
})

# Bypass FreeCram cookie challenge
torrent_url = "https://www.freecram.net/torrent/CuramSoftware.CS0-003.v2026-09-21.q313.html"
r = session.get(torrent_url)
match = re.search(r"var a='([^']+)'", r.text)
if match:
    session.cookies.set("__ckreal", match.group(1), domain=".freecram.net")

results = {}

for q_id, url in URLS.items():
    try:
        resp = session.get(url, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        qa = soup.find("div", class_="qa")
        if not qa:
            results[q_id] = {"error": "qa container not found"}
            continue
        
        # Options
        options = []
        opt_container = qa.find("div", class_="qa-options")
        if opt_container:
            for label in opt_container.find_all("label", class_=re.compile(r"radio|checkbox")):
                inp = label.find("input")
                letter = ""
                if inp:
                    letter = inp.get("value", "").strip().upper()
                text = label.get_text().strip()
                # Clean up "A. " if present
                clean_text = re.sub(r"^[A-Z][.\:)]\s*", "", text).strip()
                if letter:
                    options.append(f"{letter}. {clean_text}")
                else:
                    options.append(text)
        
        # Images in question
        images = []
        q_div = qa.find("div", class_="qa-question")
        if q_div:
            for img in q_div.find_all("img"):
                src = img.get("src")
                if src and not any(ad in src for ad in ["adts", "downpdf", "google", "adsbygoogle"]):
                    if src.startswith("/"):
                        src = "https://www.freecram.net" + src
                    images.append(src)

        # Answer
        answers = []
        answerexp = qa.find("div", class_="qa-answerexp")
        if answerexp:
            ans_span = answerexp.find("span", style=re.compile(r"color:\s*red", re.IGNORECASE))
            if ans_span:
                raw = ans_span.get_text(strip=True).upper()
                answers = [c for c in raw if c in "ABCDEF"]
        
        # Explanation
        exp_text = ""
        exp_images = []
        if answerexp:
            exp_div = answerexp.find("div", class_="qa_explanation")
            if exp_div:
                for img in exp_div.find_all("img"):
                    src = img.get("src")
                    if src and not any(ad in src for ad in ["adts", "downpdf", "google", "adsbygoogle"]):
                        if src.startswith("/"):
                            src = "https://www.freecram.net" + src
                        exp_images.append(src)
                exp_text = exp_div.get_text().strip()

        results[q_id] = {
            "options": options,
            "images": images,
            "answers": answers,
            "explanation": exp_text,
            "exp_images": exp_images,
            "raw_options_html": str(opt_container) if opt_container else "",
            "qa_question_html": str(q_div) if q_div else ""
        }
        print(f"Scraped {q_id}: {len(options)} options, answer: {answers}")
        time.sleep(0.5)
    except Exception as e:
        results[q_id] = {"error": str(e)}
        print(f"Error {q_id}: {e}")

with open("scratch_22_results.json", "w") as f:
    json.dump(results, f, indent=2)
print("Done!")
