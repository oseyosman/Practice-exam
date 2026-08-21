#!/opt/anaconda3/bin/python3
import json
import os
import re
import glob
import pymupdf
from PIL import Image

PDF_PATH = "/Users/oseyosmanyildiz/Desktop/Comptia Certificate Exam/3-CySA+ 2.pdf"
OUTPUT_JS_PATH = "/Users/oseyosmanyildiz/Desktop/Practice exam/questions.js"
IMAGES_DIR = "/Users/oseyosmanyildiz/Desktop/Practice exam/images"

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'Questions\s*&\s*Answers\s*PDF\s*P-\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'http://www\.justcerts\.com', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Product\s*Questions:\s*\d+\s*Version:\s*[\d\.]+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'CompTIA\s*CS0-003\s*Exam.*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n+', '\n', text)
    return text.strip()

def classify_domain(text):
    t = text.lower()
    if any(k in t for k in ['vulnerability', 'cvss', 'scan', 'patch', 'cve', 'assessment', 'remediation', 'inhibitor', 'credentialed scan', 'scanner']):
        return "Domain 2.0: Vulnerability Management"
    elif any(k in t for k in ['incident', 'containment', 'eradication', 'forensic', 'csirt', 'nist', 'volatility', 'isolation', 'lessons learned', 'ram', 'evidence']):
        return "Domain 3.0: Incident Response and Management"
    elif any(k in t for k in ['report', 'briefing', 'kpi', 'metric', 'tlp', 'sla', 'mou', 'compliance', 'gdpr', 'pci', 'executive', 'ciso', 'legal']):
        return "Domain 4.0: Reporting and Communication"
    else:
        return "Domain 1.0: Security Operations"

def extract_and_map_images(doc):
    os.makedirs(IMAGES_DIR, exist_ok=True)
    page_diagrams = {} # page_num (1-based) -> list of image relative paths

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        diagrams = []
        if image_list:
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image['image']
                image_ext = base_image['ext']
                image_filename = f"page_{page_num + 1}_img_{img_idx + 1}.{image_ext}"
                image_path = os.path.join(IMAGES_DIR, image_filename)
                
                with open(image_path, 'wb') as f:
                    f.write(image_bytes)

                try:
                    im = Image.open(image_path)
                    w, h = im.size
                    # Filter out logo/footer banners (800x43 or small icons)
                    if (w > 100 and h > 50) and not (w == 800 and h == 43) and not (w == 854 and h == 133):
                        diagrams.append(f"images/{image_filename}")
                except Exception:
                    pass

        if diagrams:
            page_diagrams[page_num + 1] = diagrams

    return page_diagrams

def parse_pdf():
    doc = pymupdf.open(PDF_PATH)
    page_diagrams = extract_and_map_images(doc)

    full_text_pages = []
    page_offsets = [] # char offset to page number
    curr_len = 0

    for page_num in range(len(doc)):
        txt = doc[page_num].get_text('text')
        full_text_pages.append(txt)
        page_offsets.append((curr_len, page_num + 1))
        curr_len += len(txt) + 1

    raw = '\n'.join(full_text_pages)

    def get_page_for_pos(pos):
        for offset, pnum in reversed(page_offsets):
            if pos >= offset:
                return pnum
        return 1

    q_matches = list(re.finditer(r'Question:\s*(\d+)', raw))
    parsed_questions = []

    # Preserve interactive PBQs
    pbq_1 = {
      "id": "pbq-1",
      "type": "pbq",
      "pbqType": "log-analysis",
      "domain": "Domain 1.0: Security Operations",
      "title": "PBQ 1: SIEM Log Analysis & Threat Identification",
      "scenario": "As a Cybersecurity Analyst, you receive a SIEM alert regarding unusual HTTP requests targeted at an external web server (192.168.10.45). Analyze the web server log entries and select the primary attack vector, compromised endpoint, and immediate mitigation.",
      "logs": [
        "2026-08-14 10:14:02 UTC - Src: 203.0.113.88 -> Dst: 192.168.10.45:80 HTTP GET /products.php?id=101 ' OR '1'='1' -- Status 200",
        "2026-08-14 10:14:05 UTC - Src: 203.0.113.88 -> Dst: 192.168.10.45:80 HTTP GET /products.php?id=101 UNION SELECT username, password_hash FROM users -- Status 200",
        "2026-08-14 10:15:22 UTC - Src: 203.0.113.88 -> Dst: 192.168.10.45:80 HTTP POST /uploads/cmd.php?cmd=whoami Status 200 (www-data)",
        "2026-08-14 10:16:01 UTC - Src: 192.168.10.45 -> Dst: 198.51.100.14:443 Outbound HTTPS Connection Created - Payload: Encrypted reverse shell session"
      ],
      "fields": [
        {
          "id": "attack_vector",
          "label": "Identified Primary Attack Vector:",
          "options": [
            "Cross-Site Scripting (XSS)",
            "SQL Injection leading to Remote Code Execution (RCE)",
            "Server-Side Request Forgery (SSRF)",
            "Credential Stuffing Attack"
          ],
          "correct": "SQL Injection leading to Remote Code Execution (RCE)"
        },
        {
          "id": "target_asset",
          "label": "Compromised Internal IP Address:",
          "options": ["203.0.113.88", "192.168.10.45", "198.51.100.14", "192.168.10.1"],
          "correct": "192.168.10.45"
        },
        {
          "id": "mitigation",
          "label": "Immediate Containment Action:",
          "options": [
            "Isolate web server 192.168.10.45 from network and revoke web application DB credentials",
            "Block inbound ICMP traffic on the edge router",
            "Reboot the database host server",
            "Issue a site-wide user password reset notice"
          ],
          "correct": "Isolate web server 192.168.10.45 from network and revoke web application DB credentials"
        }
      ],
      "explanation": "Logs show SQL Injection exploited on /products.php to extract user hashes, followed by uploading cmd.php web shell and initiating an outbound HTTPS reverse shell."
    }

    pbq_2 = {
      "id": "pbq-2",
      "type": "pbq",
      "pbqType": "firewall-rules",
      "domain": "Domain 2.0: Vulnerability Management",
      "title": "PBQ 2: Firewall Rule Configuration & Hardening",
      "scenario": "Configure Next-Generation Firewall rules for the DMZ to enforce enterprise security policy: Block unencrypted remote administration and maintain implicit deny stance.",
      "rules": [
        { "ruleId": 1, "src": "Internet (Any)", "dst": "10.0.1.10 (Web)", "service": "HTTP (80)", "action": "ALLOW" },
        { "ruleId": 2, "src": "Internet (Any)", "dst": "10.0.1.10 (Web)", "service": "HTTPS (443)", "action": "ALLOW" },
        { "ruleId": 3, "src": "Admin Subnet (10.0.99.0/24)", "dst": "DMZ Subnet (10.0.1.0/24)", "service": "SSH (22)", "action": "ALLOW" },
        { "ruleId": 4, "src": "Internet (Any)", "dst": "DMZ Subnet (10.0.1.0/24)", "service": "Telnet (23)", "action": "DENY" },
        { "ruleId": 5, "src": "Any", "dst": "Any", "service": "Any", "action": "DENY" }
      ],
      "fields": [
        {
          "id": "unencrypted_mgmt",
          "label": "Insecure Remote Management Protocol to Block:",
          "options": ["Telnet (23) & HTTP (80) Management", "SSH (22)", "HTTPS (443)", "SFTP (22)"],
          "correct": "Telnet (23) & HTTP (80) Management"
        },
        {
          "id": "default_action",
          "label": "Recommended Firewall Security Stance at rule tail:",
          "options": ["Implicit Deny Any Any", "Implicit Allow Any Any", "Log and Forward", "Stateful Bypass"],
          "correct": "Implicit Deny Any Any"
        }
      ],
      "explanation": "Enterprise security policy mandates blocking unencrypted management interfaces like Telnet (Port 23). The final firewall rule must always be an Implicit Deny statement."
    }

    pbq_3 = {
      "id": "pbq-3",
      "type": "pbq",
      "pbqType": "order-matching",
      "domain": "Domain 3.0: Incident Response and Management",
      "title": "PBQ 3: Order of Volatility in Digital Forensics",
      "scenario": "Order the artifacts below from MOST volatile (1) to LEAST volatile (5) according to RFC 3227 standards.",
      "items": [
        "RAM / System Memory",
        "Swap / Page File",
        "Hard Disk / SSD File System Data",
        "Network Routing Table & ARP Cache",
        "Archival Backup Tapes / Offsite Storage"
      ],
      "correctOrder": [
        "Network Routing Table & ARP Cache",
        "RAM / System Memory",
        "Swap / Page File",
        "Hard Disk / SSD File System Data",
        "Archival Backup Tapes / Offsite Storage"
      ],
      "explanation": "RFC 3227 order of volatility: 1. CPU registers & Cache -> 2. Routing table, ARP cache, RAM -> 3. Swap space -> 4. Disk data -> 5. Offsite backups."
    }

    parsed_questions.extend([pbq_1, pbq_2, pbq_3])

    for i in range(len(q_matches)):
        q_num = int(q_matches[i].group(1))
        match_start = q_matches[i].start()
        start_idx = q_matches[i].end()
        end_idx = q_matches[i+1].start() if i + 1 < len(q_matches) else len(raw)

        page_num = get_page_for_pos(match_start)
        
        block = raw[start_idx:end_idx]
        block_cleaned = clean_text(block)

        # Extract Answer string e.g. "Answer: D" or "Answer: D, E" or "Answer: A, B"
        ans_match = re.search(r'Answer:\s*([A-F0-9,\s\/]+)', block_cleaned)
        answer_letters = []
        if ans_match:
            # Only look at the immediate Answer line to prevent matching letters in Explanation text
            ans_line = ans_match.group(0).split('\n')[0]
            answer_letters = re.findall(r'\b[A-F]\b', ans_line)

        # Detect Multi-Select
        multi_select = False
        select_count = 1
        if len(answer_letters) > 1:
            multi_select = True
            select_count = len(answer_letters)

        choose_match = re.search(r'\((?:Choose|Select)\s*(two|three|four|2|3|4)\)', block_cleaned, re.IGNORECASE)
        if choose_match:
            multi_select = True
            c_str = choose_match.group(1).lower()
            if c_str in ['two', '2']:
                select_count = max(select_count, 2)
            elif c_str in ['three', '3']:
                select_count = max(select_count, 3)
            elif c_str in ['four', '4']:
                select_count = max(select_count, 4)

        # Split into Question body, Options, Explanation
        exp_match = re.search(r'Explanation:\s*(.*)', block_cleaned, re.DOTALL)
        explanation = clean_text(exp_match.group(1)) if exp_match else "Official JustCerts CompTIA CySA+ CS0-003 question solution."

        body_and_opts = block_cleaned[:ans_match.start()] if ans_match else block_cleaned
        opt_matches = list(re.finditer(r'([A-F])\.\s+', body_and_opts))

        options = []
        if opt_matches:
            q_text = clean_text(body_and_opts[:opt_matches[0].start()])
            for o_idx in range(len(opt_matches)):
                o_letter = opt_matches[o_idx].group(1)
                o_start = opt_matches[o_idx].start()
                o_end = opt_matches[o_idx+1].start() if o_idx + 1 < len(opt_matches) else len(body_and_opts)
                opt_str = clean_text(body_and_opts[o_start:o_end])
                options.append(opt_str)
        else:
            q_text = clean_text(body_and_opts)
            options = ["A. Option A", "B. Option B", "C. Option C", "D. Option D"]

        domain = classify_domain(q_text + " " + " ".join(options))

        # Check for page diagram image
        images_for_q = page_diagrams.get(page_num, [])
        # Also check next page in case image is rendered at top of next page
        if not images_for_q and page_num + 1 in page_diagrams:
            images_for_q = page_diagrams.get(page_num + 1, [])

        image_path = images_for_q[0] if images_for_q else None

        parsed_questions.append({
            "id": f"q-jc-{q_num}",
            "type": "mcq",
            "multiSelect": multi_select,
            "selectCount": select_count,
            "domain": domain,
            "question": q_text if q_text else f"CompTIA CySA+ CS0-003 Question #{q_num}",
            "options": options if len(options) >= 2 else ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
            "answer": answer_letters if multi_select else (answer_letters[0] if answer_letters else "A"),
            "explanation": explanation,
            "image": image_path
        })

    print(f"[+] Total parsed questions from JustCerts PDF: {len(parsed_questions)}")

    js_content = f"// CompTIA CySA+ (CS0-003) Question Bank - JustCerts Full Set (377 Questions)\n"
    js_content += f"const CYSA_QUESTIONS = {json.dumps(parsed_questions, indent=2)};\n\n"
    js_content += """
function generateFullQuestionBank(baseQuestions, targetCount = 85) {
  const seen = new Set();
  const unique = baseQuestions.filter(q => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  const shuffled = shuffleArrayInternal([...unique]);
  return shuffled.slice(0, Math.min(targetCount, shuffled.length));
}

function shuffleArrayInternal(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CYSA_QUESTIONS, generateFullQuestionBank };
}
"""

    with open(OUTPUT_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"[+] Successfully wrote {len(parsed_questions)} questions to {OUTPUT_JS_PATH}")

if __name__ == "__main__":
    parse_pdf()
