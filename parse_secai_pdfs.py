#!/usr/bin/env python3
"""
Scrape SecAI+ (CY0-001) questions from both PDFs and inject into questionsupdate.js
"""

try:
    import pymupdf as fitz
except ImportError:
    import fitz

import re
import json

PDF_M4S = "/Users/oseyosmanyildiz/Desktop/Comptia Certificate Exam/SecAI/CompTIA-CY0-001 2.pdf"
PDF_F2T = "/Users/oseyosmanyildiz/Desktop/Comptia Certificate Exam/SecAI/CY0-001 V12.95 (1).pdf"
QUESTIONSUPDATE_JS = "/Users/oseyosmanyildiz/Desktop/Practice exam/questionsupdate.js"
OUT_JSON = "/Users/oseyosmanyildiz/Desktop/Practice exam/cy0_001_questions_full.json"

# ─── Domain classification ────────────────────────────────────────────────────

RAW_DOMAIN_MAP = {
    "basic ai concepts related to cybersecurity": "Domain 1.0: Basic AI Concepts Related to Cybersecurity",
    "securing ai systems": "Domain 2.0: Securing AI Systems",
    "ai-assisted security": "Domain 3.0: AI-Assisted Security",
    "ai governance, risk, and compliance": "Domain 4.0: AI Governance, Risk, and Compliance",
}

DOMAIN_KEYWORDS = {
    "Domain 1.0: Basic AI Concepts Related to Cybersecurity": [
        "llm", "large language model", "machine learning", "neural network", "deep learning",
        "transformer", "generative ai", "foundation model", "token", "embedding", "inference",
        "training data", "overfitting", "hyperparameter", "rag", "retrieval", "hallucination",
        "fine-tuning", "zero-shot", "few-shot", "multi-shot", "system prompt", "user prompt",
        "deepfake", "synthetic", "chatbot", "model architecture", "gan", "generative adversarial",
        "distillation", "one-shot", "unstructured data", "prompt template", "atlas", "mitre",
        "reinforcement learning", "supervised", "unsupervised", "clustering", "classification",
        "agentic system", "autonomous agent", "multi-agent", "foundation",
    ],
    "Domain 2.0: Securing AI Systems": [
        "model inversion", "data poisoning", "adversarial", "prompt injection", "guardrail",
        "rate limit", "token quota", "encryption", "masking", "hardening", "configuration",
        "data at rest", "data in transit", "api security", "input validation", "output validation",
        "access control", "rbac", "authentication", "mfa", "denial of wallet", "dos attack",
        "api abuse", "injection attack", "firewall", "waf", "data leakage", "data exfiltration",
        "secure coding", "vulnerability", "penetration test", "red team", "sandbox",
        "model encryption", "data exposure", "data lineage", "mlops", "observability",
        "misconfiguration", "storage", "prompt firewall", "confidence level", "owasp",
        "jailbreak", "role impersonation", "sensitive information disclosure",
        "supply chain", "tampering", "integrity", "checksum",
    ],
    "Domain 3.0: AI-Assisted Security": [
        "soc", "security operations", "siem", "soar", "ueba", "threat detection",
        "anomaly detection", "behavioral analytics", "threat intelligence", "threat hunting",
        "incident response", "triage", "alert", "log analysis", "pattern recognition",
        "automation", "playbook", "orchestration", "user behavior", "security analyst",
        "detection and response", "xdr", "edr", "mdr", "security tasks",
    ],
    "Domain 4.0: AI Governance, Risk, and Compliance": [
        "governance", "risk management", "compliance", "audit", "policy", "regulation",
        "eu ai act", "gdpr", "nist ai rmf", "nist", "iso", "oecd", "responsible ai",
        "ethical ai", "bias", "fairness", "transparency", "accountability", "explainability",
        "ai lifecycle", "model card", "third-party risk", "vendor risk", "data provenance",
        "data governance", "ai registry", "center of excellence", "acceptable use",
        "human oversight", "privacy", "hipaa", "intellectual property", "pci dss",
        "ai governance", "ai policy", "ai risk", "posture", "ai act", "threat model",
        "onboard", "chief information officer", "cio", "governance structure", "iso 42001",
        "job role", "organizational", "human resources", "procurement",
    ],
}


def classify_domain(text, hint=""):
    if hint:
        h = hint.lower().strip()
        for key, mapped in RAW_DOMAIN_MAP.items():
            if key in h:
                return mapped
    t = text.lower()
    scores = {d: 0 for d in DOMAIN_KEYWORDS}
    for domain, kws in DOMAIN_KEYWORDS.items():
        for kw in kws:
            if kw in t:
                scores[domain] += 1
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Domain 1.0: Basic AI Concepts Related to Cybersecurity"


# ─── M4S noise patterns ───────────────────────────────────────────────────────

M4S_NOISE = re.compile(
    r'CompTIA\s*-\s*CY0-001\s*\n?\s*Practice Test'
    r'|Practice Test\s*\n?\s*CompTIA\s*-\s*CY0-001'
    r'|Pass Your Certification With Marks4sure Guarantee\s*\n?\s*\d+\s*of\s*\d+'
    r'|\d+\s*of\s*\d+\s*\n?\s*Pass Your Certification With Marks4sure Guarantee'
)
# Empty placeholder labels: "A.   " with 2+ spaces or just letter alone
EMPTY_LABEL = re.compile(r'(?:^|\n)\s*[A-F]\.\s{2,}(?:\n|$)|(?:^|\n)\s*[A-F]\.\s*(?:\n|$)')
# Stray artifact: a line that is ONLY a letter (or letter+dot) — page-break residue
STRAY_LETTER = re.compile(r'^[A-F]\.?$')

F2T_NOISE = re.compile(
    r'IT Certification Guaranteed,\s*The Easy Way!\s*\n?\s*\d*\s*'
)


def clean_ws(s):
    return re.sub(r'[ \t]+', ' ', s).strip()


def merge_continuation_lines(lines):
    """
    Join lines that are continuations of the previous option.
    A continuation line: starts with lowercase or is a short fragment without punctuation
    that is clearly completing the previous line.
    """
    if not lines:
        return lines
    merged = [lines[0]]
    for line in lines[1:]:
        # If this line starts with a lowercase letter or a connecting word, it's a continuation
        prev = merged[-1]
        if line and (line[0].islower() or line.startswith('(') or
                     (not line[0].isupper() and not line[0].isdigit())):
            merged[-1] = prev + ' ' + line
        else:
            merged.append(line)
    return merged


# ─── Parse Marks4Sure PDF ─────────────────────────────────────────────────────

def parse_m4s_block(category, body):
    """
    Parse a single M4S question block.
    M4S format: stem (ending in ?) → 4 unlabeled option lines → Answer: X → Explanation
    Page breaks inject stray empty "A. B. C. D." labels and noise headers.
    """
    # 1. Remove large noise blocks
    body = M4S_NOISE.sub('\n', body)
    # 2. Remove empty placeholder label lines
    body = EMPTY_LABEL.sub('\n', body)
    body = re.sub(r'\n{3,}', '\n\n', body)

    # 3. Split at Answer:
    ans_match = re.search(r'\nAnswer\s*:\s*([A-F](?:\s*,\s*[A-F])*)', body)
    if ans_match:
        pre_ans = body[:ans_match.start()]
        raw_ans = ans_match.group(1)
        ans_letters = [x.strip() for x in re.split(r'[\s,]+', raw_ans) if re.match(r'[A-F]$', x.strip())]
        post_ans = body[ans_match.end():]
    else:
        pre_ans = body
        ans_letters = []
        post_ans = ""

    # 4. Extract explanation
    exp_match = re.search(r'Explanation\s*:?\s*\n?(.*)', post_ans, re.DOTALL | re.IGNORECASE)
    explanation = ""
    if exp_match:
        explanation = re.sub(r'\s+', ' ', exp_match.group(1).strip())[:800]

    # 5. Detect PBQ
    is_pbq = bool(re.search(
        r'Instructions:|Click the\s*\(\+\)|drop-down menu|drag.and.drop',
        pre_ans, re.IGNORECASE
    ))

    # 6. Get clean non-empty lines, filter stray single-letter artifacts
    raw_lines = [clean_ws(l) for l in pre_ans.split('\n')]
    lines = [l for l in raw_lines if l and not STRAY_LETTER.match(l)]

    if is_pbq:
        stem = ' '.join(lines)
        return stem, {}, ans_letters, explanation, True

    # 7. Find the last line ending with '?'
    last_q = -1
    for idx, line in enumerate(lines):
        if line.endswith('?'):
            last_q = idx

    if last_q >= 0 and last_q < len(lines) - 1:
        stem_lines = lines[:last_q + 1]
        opt_lines = lines[last_q + 1:]
    elif len(lines) >= 5:
        stem_lines = lines[:-4]
        opt_lines = lines[-4:]
    else:
        stem_lines = lines
        opt_lines = []

    stem = ' '.join(stem_lines)

    # 8. Join continuation lines in options
    opt_lines = merge_continuation_lines(opt_lines)

    # 9. Build options dict (up to 4-6 options → A B C D E)
    letters = ['A', 'B', 'C', 'D', 'E', 'F']
    opts_dict = {}
    for idx, opt_text in enumerate(opt_lines[:6]):
        if opt_text and len(opt_text) > 1:
            opts_dict[letters[idx]] = opt_text

    # 10. If we ended up with 5 options where one is clearly the 4th split across lines,
    #     try to detect and merge. (Most MCQ have exactly 4 options)
    if len(opts_dict) == 5:
        # Find which consecutive pair looks like one option (second starts lowercase)
        opt_items = list(opts_dict.items())
        for j in range(len(opt_items) - 1):
            _, t1 = opt_items[j]
            _, t2 = opt_items[j + 1]
            if t2 and t2[0].islower():
                merged_text = t1 + ' ' + t2
                new_opts = dict(opt_items[:j])
                new_opts[opt_items[j][0]] = merged_text
                remaining = opt_items[j + 2:]
                for k, (ol, ot) in enumerate(remaining):
                    new_opts[letters[j + 1 + k]] = ot
                opts_dict = new_opts
                break

    return stem, opts_dict, ans_letters, explanation, False


def parse_m4s():
    doc = fitz.open(PDF_M4S)
    raw = ""
    for page in doc:
        raw += page.get_text("text") + "\n"
    doc.close()

    parts = re.split(r'Question\s*#:\s*(\d+)\s*-\s*\[(.*?)\]', raw)
    questions = []

    for i in range(1, len(parts), 3):
        qnum = int(parts[i])
        category = parts[i + 1].strip()
        body = parts[i + 2]

        stem, opts_dict, ans_letters, explanation, is_pbq = parse_m4s_block(category, body)

        if not explanation:
            explanation = f"Source: Marks4Sure CY0-001 Q#{qnum}."

        final_opts = [f"{l}. {t}" for l, t in sorted(opts_dict.items())]
        multi = len(ans_letters) > 1
        answer = ans_letters if multi else (ans_letters[0] if ans_letters else "")
        domain = classify_domain(stem + " " + " ".join(opts_dict.values()), category)

        questions.append({
            "qnum": qnum, "source": "M4S",
            "stem": stem, "options": final_opts,
            "answer": answer, "explanation": explanation,
            "domain": domain, "multiSelect": multi,
            "selectCount": len(ans_letters) if multi else 1,
            "is_pbq": is_pbq,
        })

    return questions


# ─── Parse Fast2Test PDF ──────────────────────────────────────────────────────

def parse_f2t_block(body):
    body = F2T_NOISE.sub('', body)

    opts_raw = re.findall(
        r'(?:^|\n)\s*([A-F])\.\s+(.+?)(?=\n\s*[A-F]\.\s|\n\s*Answer\s*:|\n\s*Explanation|\Z)',
        body, re.DOTALL
    )
    opts_dict = {}
    for l, t in opts_raw:
        opts_dict[l] = clean_ws(t)

    if opts_dict:
        first_opt_pos = re.search(r'\n\s*[A-F]\.\s', body)
        stem = clean_ws(body[:first_opt_pos.start()]) if first_opt_pos else clean_ws(body[:300])
    else:
        ans_pos = re.search(r'\nAnswer\s*:', body)
        stem = clean_ws(body[:ans_pos.start()]) if ans_pos else clean_ws(body[:300])

    ans_match = re.search(r'Answer\s*:\s*([A-F](?:\s*,\s*[A-F])*)', body, re.IGNORECASE)
    if ans_match:
        ans_letters = [x.strip() for x in re.split(r'[\s,]+', ans_match.group(1)) if re.match(r'[A-F]$', x.strip())]
    else:
        ans_letters = []

    exp_match = re.search(
        r'Explanation\s*:?\s*\n?(.*?)(?=\n\s*NO\.\d+|\Z)',
        body, re.DOTALL | re.IGNORECASE
    )
    explanation = ""
    if exp_match:
        explanation = re.sub(r'\s+', ' ', exp_match.group(1).strip())[:800]

    is_pbq = bool(re.search(r'drop-down|drag.and.drop|click the|Instructions:', stem, re.IGNORECASE))

    return stem, opts_dict, ans_letters, explanation, is_pbq


def parse_f2t():
    doc = fitz.open(PDF_F2T)
    raw = ""
    for page in doc:
        txt = page.get_text("text")
        raw += F2T_NOISE.sub('', txt) + "\n"
    doc.close()

    parts = re.split(r'(?:^|\n)NO\.(\d+)\s+', raw)
    questions = []

    for i in range(1, len(parts), 2):
        qnum = int(parts[i])
        body = parts[i + 1]

        stem, opts_dict, ans_letters, explanation, is_pbq = parse_f2t_block(body)

        if not explanation:
            explanation = f"Source: Fast2Test CY0-001 Q#{qnum}."

        final_opts = [f"{l}. {t}" for l, t in sorted(opts_dict.items())]
        multi = len(ans_letters) > 1
        answer = ans_letters if multi else (ans_letters[0] if ans_letters else "")
        domain = classify_domain(stem + " " + " ".join(opts_dict.values()))

        questions.append({
            "qnum": qnum, "source": "F2T",
            "stem": stem, "options": final_opts,
            "answer": answer, "explanation": explanation,
            "domain": domain, "multiSelect": multi,
            "selectCount": len(ans_letters) if multi else 1,
            "is_pbq": is_pbq,
        })

    return questions


# ─── Merge & Dedup ────────────────────────────────────────────────────────────

def norm_stem(s):
    s = re.sub(r'\s+', ' ', s.lower().strip())
    s = re.sub(r'[^a-z0-9 ]', '', s)
    return s[:100]


def merge_questions(m4s_qs, f2t_qs):
    combined = []
    seen = {}

    for q in m4s_qs:
        key = norm_stem(q["stem"])
        if key not in seen:
            seen[key] = len(combined)
            combined.append(dict(q))

    for q in f2t_qs:
        key = norm_stem(q["stem"])
        if key in seen:
            idx = seen[key]
            ex = combined[idx]
            if len(q["explanation"]) > len(ex["explanation"]) + 30:
                ex["explanation"] = q["explanation"]
            if not ex["answer"] and q["answer"]:
                ex["answer"] = q["answer"]
                ex["multiSelect"] = q["multiSelect"]
                ex["selectCount"] = q["selectCount"]
            if not ex["options"] and q["options"]:
                ex["options"] = q["options"]
        else:
            seen[key] = len(combined)
            combined.append(dict(q))

    return combined


# ─── Build JS ─────────────────────────────────────────────────────────────────

def esc(s):
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    s = s.replace("\n", "\\n").replace("\r", "")
    return s


def build_js(merged):
    lines = [
        "// CompTIA SecAI+ (CY0-001) Questions",
        "const SECAI_QUESTIONS = ["
    ]
    q_idx = 0
    for q in merged:
        if q.get("is_pbq") and not q["options"]:
            continue
        q_idx += 1
        qid = f"cy0-{q_idx}"
        stem = esc(q["stem"])
        domain = esc(q["domain"])
        exp = esc(q["explanation"])
        opts_js = json.dumps(q["options"], ensure_ascii=False)
        multi = "true" if q["multiSelect"] else "false"
        sc = q["selectCount"]
        ans = q["answer"]
        if isinstance(ans, list):
            ans_js = json.dumps(ans)
        elif ans:
            ans_js = f'"{ans}"'
        else:
            ans_js = '"A"'
        lines += [
            f'  {{',
            f'    "id": "{qid}",',
            f'    "type": "mcq",',
            f'    "multiSelect": {multi},',
            f'    "selectCount": {sc},',
            f'    "domain": "{domain}",',
            f'    "question": "{stem}",',
            f'    "options": {opts_js},',
            f'    "answer": {ans_js},',
            f'    "explanation": "{exp}",',
            f'    "image": null',
            f'  }},',
        ]
    if lines[-1].endswith('},'):
        lines[-1] = lines[-1][:-1]
    lines.append("];")
    return "\n".join(lines), q_idx


# ─── Inject ───────────────────────────────────────────────────────────────────

def inject(js_block):
    with open(QUESTIONSUPDATE_JS, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = re.compile(
        r'(?:// CompTIA SecAI\+.*?\n)?const SECAI_QUESTIONS\s*=\s*\[.*?\];',
        re.DOTALL
    )
    if pattern.search(content):
        new_content = pattern.sub(js_block, content, count=1)
        print("✅ Replaced existing SECAI_QUESTIONS block.")
    else:
        m = re.search(r'\nfunction generateFullQuestionBank', content)
        pos = m.start() if m else len(content)
        new_content = content[:pos] + "\n\n" + js_block + "\n" + content[pos:]
        print("✅ Inserted new SECAI_QUESTIONS block.")
    with open(QUESTIONSUPDATE_JS, "w", encoding="utf-8") as f:
        f.write(new_content)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("📄 Parsing Marks4Sure PDF...")
    m4s = parse_m4s()
    print(f"   → {len(m4s)} questions")

    print("📄 Parsing Fast2Test PDF...")
    f2t = parse_f2t()
    print(f"   → {len(f2t)} questions")

    print("🔀 Merging & deduplicating...")
    merged = merge_questions(m4s, f2t)
    print(f"   → {len(merged)} unique questions total")

    # Stats
    domain_counts = {}
    problems = []
    pbq_skipped = 0
    for q in merged:
        if q.get("is_pbq") and not q["options"]:
            pbq_skipped += 1
            continue
        d = q["domain"]
        domain_counts[d] = domain_counts.get(d, 0) + 1
        issues = []
        if not q["options"]:
            issues.append("no-options")
        if not q["answer"]:
            issues.append("no-answer")
        # Stem-leak check: option text in stem
        if q["options"] and len(q["options"]) >= 2:
            opt_a = q["options"][0].split(". ", 1)[-1].lower().strip()[:25]
            if opt_a and opt_a in q["stem"].lower():
                issues.append("stem-leak")
        if issues:
            problems.append((q.get('qnum', '?'), q.get('source', '?'), issues, q['stem'][:60], q['options']))

    print(f"\n📊 Domain breakdown ({sum(domain_counts.values())} MCQ, {pbq_skipped} PBQ skipped):")
    for d, c in sorted(domain_counts.items()):
        print(f"   {d}: {c}")

    if problems:
        print(f"\n⚠️  {len(problems)} questions with issues:")
        for qnum, src, issues, stem, opts in problems[:20]:
            print(f"   Q{qnum}[{src}] {','.join(issues)}: {stem}")
            print(f"      Options: {opts}")

    print("\n✍️  Building JS block...")
    js_block, count = build_js(merged)

    print(f"💾 Injecting {count} questions into questionsupdate.js...")
    inject(js_block)

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
    print(f"💾 Reference JSON → {OUT_JSON}")
    print(f"\n✅ Done! {count} SecAI+ CY0-001 questions in questionsupdate.js")

    # Sample
    print("\n📋 First 5 questions sample:")
    shown = 0
    for q in merged:
        if q.get("is_pbq") and not q["options"]:
            continue
        print(f"\n  Q{q['qnum']}: {q['stem'][:75]}")
        for o in q["options"]:
            print(f"    {o[:85]}")
        print(f"  ✓ Answer: {q['answer']}")
        shown += 1
        if shown >= 5:
            break


if __name__ == "__main__":
    main()
