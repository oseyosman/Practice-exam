#!/opt/anaconda3/bin/python3
"""
Comprehensive questions.js fix:
 - Corrects wrong answers (q-jc-9: C→A, q-jc-187: B→D, q-jc-212: B→D)
 - Fills all empty/blank explanations
 - Populates empty answer arrays using explanation context
"""
import json, re

with open('/Users/oseyosmanyildiz/Desktop/Practice exam/questions.js', 'r') as f:
    text = f.read()

# Locate the CYSA_QUESTIONS array reliably using the footer anchor
footer_match = re.search(r'function generateFullQuestionBank', text)
footer_pos = footer_match.start()

# Walk back past whitespace and semicolons to find the closing ]
end_pos = footer_pos - 1
while text[end_pos] in ' \n\r;': end_pos -= 1
# end_pos should now be pointing at ]
assert text[end_pos] == ']', f"Expected ] but got {repr(text[end_pos])}"

array_start = text.index('[')   # const CYSA_QUESTIONS = [
header = text[:array_start]
footer = '\n\n\n' + text[footer_pos:]   # preserve function + module.exports
json_str = text[array_start:end_pos + 1]   # [ ... ]

qs = json.loads(json_str)
print(f"Loaded {len(qs)} questions")

# ─────────────────────────────────────────────────────────────────────────────
# PATCH MAP — { id: { answer, multiSelect, selectCount, explanation } }
# Only fill what needs changing.
# ─────────────────────────────────────────────────────────────────────────────
patches = {

    # ── Corrected Answers (wrong in PDF) ──────────────────────────────────────

    "q-jc-9": {
        "answer": "A",   # BCP ensures availability DURING incident; DRP is post-disaster recovery
        "explanation": (
            "A Business Continuity Plan (BCP) is specifically designed to ensure that mission-critical "
            "services remain AVAILABLE and operational during an incident or disruption. It defines "
            "procedures, alternate sites, failover strategies, and resource priorities to keep the "
            "business running. A Disaster Recovery Plan (DRP) focuses on restoring IT systems AFTER "
            "a disaster has occurred, not maintaining availability during one. Vulnerability management "
            "and asset management plans do not directly address service availability during incidents."
        )
    },

    "q-jc-187": {
        "answer": "D",   # Disabling functionality = Risk Avoidance, not Mitigate
        "explanation": (
            "Risk Avoidance (D) means eliminating a risk by ceasing the activity that creates it. "
            "When a CISO disables a vulnerable functionality entirely on a business-critical web "
            "application to prevent RCE exploitation, the organization is avoiding the risk by "
            "removing the attack vector altogether. Risk Mitigation (B) would involve implementing "
            "controls to REDUCE the risk while keeping the functionality active (e.g., WAF rules, "
            "patching, input validation). Risk Transfer involves insurance or third-party contracts. "
            "Risk Acceptance acknowledges the risk and takes no action."
        )
    },

    "q-jc-212": {
        "answer": "D",   # SOAR rule is the professional approach; disabling alerting is too broad
        "explanation": (
            "Adding a SOAR (Security Orchestration, Automation, and Response) rule to drop irrelevant "
            "and duplicated notifications (D) is the correct approach to reduce alert fatigue from "
            "known internal security activities. SOAR allows precise, policy-driven suppression of "
            "specific alert patterns while maintaining full visibility and auditability. Option B "
            "(disabling alerting entirely during scans) is too broad and creates blind spots. "
            "Option C (filtering low-severity alarms globally) risks missing real low-severity "
            "incidents. Option A (enriching SIEM data) improves triage quality but does not "
            "reduce alert volume."
        )
    },

    # ── Empty Explanations ────────────────────────────────────────────────────

    "q-jc-34": {
        "explanation": (
            "Beaconing (A) is the correct answer. This describes malware installed on the internal "
            "device that periodically communicates with a Command-and-Control (C2) server at the "
            "known-malicious IP address using HTTPS to blend with legitimate traffic. The 'additional "
            "characters in the header' are a signature of C2 beacon traffic — malware often uses "
            "custom HTTP/HTTPS headers or padding to pass encoded instructions through firewalls. "
            "Cross-site scripting (B) involves injecting scripts into web pages. Buffer overflow (C) "
            "is a memory exploitation technique. PHP traversal (D) is a directory traversal attack — "
            "none of these match the outbound communication pattern described."
        )
    },

    "q-jc-176": {
        "explanation": (
            "Nation-state actors (C) are characterized by virtually unlimited time, funding, and "
            "technical resources backed by a government. They conduct Advanced Persistent Threat (APT) "
            "campaigns over months or years using zero-day exploits, custom malware, and sophisticated "
            "tradecraft. Insider threats (A) have physical access but limited resources. Ransomware "
            "groups (B) are financially motivated criminal organizations with limited state-level "
            "resources. Organized crime (D) is profit-driven and lacks the strategic patience of "
            "nation-state actors. The key distinguisher is 'unlimited time AND resources.'"
        )
    },

    "q-jc-186": {
        "explanation": (
            "Vulnerability 1 has the highest CVSS 3.0 Base Score and must be patched first. Analysis: "
            "AV:N (Network) means remotely exploitable; AC:L (Low complexity) requires no special "
            "conditions; PR:N (No privileges required) means unauthenticated; UI:N (No user interaction) "
            "needed; C:H (High confidentiality impact). This combination yields approximately 8.6-9.0 "
            "(Critical/High). Vulnerability 2 has AV:L (Local) reducing exploitability. Vulnerability 3 "
            "has AV:A (Adjacent network) and AC:H (High complexity) — lower risk. Vulnerability 4 has "
            "AV:P (Physical access) — requires physical proximity, lowest risk. Always prioritize by "
            "Attack Vector first (N > A > L > P), then complexity and privileges."
        )
    },

    "q-jc-206": {
        "explanation": (
            "An unauthorized network scan is classified as a 'potential precursor to an attack' (A). "
            "In the NIST and MITRE ATT&CK frameworks, network scanning/reconnaissance is the first "
            "stage in the attack lifecycle — an adversary gathers information about live hosts, open "
            "ports, and services before launching exploitation. The fact that it is unauthorized and "
            "internal raises the suspicion of an insider threat or a compromised internal host. "
            "Option B (peer-to-peer communication) involves direct device-to-device traffic without "
            "a server. Option C (rogue device) requires device authentication anomalies. Option D "
            "(system updates) generates known update traffic patterns, not scanning activity."
        )
    },

    "q-jc-296": {
        "explanation": (
            "The correct nmap command for discovering application versions is `nmap -sV -T4 -F insecure.org` (C). "
            "The -sV flag enables Service/Version Detection, which probes open ports to determine the "
            "service name and version number (e.g., Apache 2.4.18, OpenSSH 7.9). -T4 sets an aggressive "
            "timing template for faster scanning. -F scans only the top 100 common ports. Option A "
            "(-sS) performs a SYN stealth scan without version detection. Option B (-o) is not a valid "
            "nmap flag. Option D (-A) enables aggressive mode (version + OS detection + scripting + "
            "traceroute), which is more intrusive than necessary for just version identification."
        )
    },

    # ── Empty Answers (populated from explanation context) ──────────────────

    "q-jc-107": {
        "answer": ["B", "D"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "B. Deploy EDR on the web server and database server to monitor and restrict adversary "
            "actions in real time, and D. Use micro-segmentation to restrict connectivity to/from the "
            "compromised web server are the correct choices. Because law enforcement is involved, the "
            "server must remain online to preserve evidence (forensic hold). EDR provides visibility "
            "into attacker actions without shutting down. Micro-segmentation limits lateral movement "
            "to the database while maintaining evidence integrity. Dropping database tables (A) "
            "destroys evidence. Stopping httpd (C) alerts the attacker. Commenting out accounts (E) "
            "and moving the database (F) are disruptive and not evidence-preserving."
        )
    },

    "q-jc-183": {
        "answer": ["B", "C"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "B. Registry artifacts and C. EDR data are the most valuable sources for investigating "
            "malware that disables security tools. Registry artifacts reveal persistence mechanisms "
            "(Run keys, Services), auto-start entries, and disabled security software settings — "
            "all commonly modified by malware. EDR (Endpoint Detection and Response) data provides "
            "real-time telemetry on process execution, file operations, and network connections even "
            "when AV is disabled. Prefetch files (D) show execution history but not disabling actions. "
            "Sysmon logs (F) are valuable but may have been wiped by the malware. File system metadata "
            "and creation time provide limited context about disabling behavior."
        )
    },

    "q-jc-202": {
        "answer": ["A", "B"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "A. Signal-shielded bag (Faraday bag) and B. Tamper-evident seal are the correct tools "
            "for transporting a mobile phone to a forensic lab. A signal-shielded (Faraday) bag "
            "blocks all wireless signals (cellular, Wi-Fi, Bluetooth) preventing remote wipe commands "
            "from reaching the device and preserving its current state. A tamper-evident seal ensures "
            "chain of custody integrity by showing if the device was accessed during transport. "
            "A thumb drive (C) cannot protect the device. Crime scene tape (D) is not appropriate "
            "for device transport. A write blocker (E) is for disk imaging. A drive duplicator (F) "
            "is for copying storage media, not protecting a live mobile device in transit."
        )
    },

    "q-jc-203": {
        "answer": ["C", "E"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "C. CVE details and E. IoCs (Indicators of Compromise) are the most critical fields "
            "in a patch management policy for informing the infrastructure team about new patches. "
            "CVE details provide the specific vulnerability identifier, severity score (CVSS), and "
            "affected software versions that the team needs to identify affected systems. IoCs "
            "include file hashes, IP addresses, and behavioral patterns that help the team detect "
            "exploitation attempts. Hostname (A) is too specific. Missing KPI (B) is a performance "
            "metric, not patch information. POC availability (D) indicates exploitability urgency "
            "but is secondary. npm identifier (F) is package-specific and not universally applicable."
        )
    },

    "q-jc-222": {
        "answer": ["C", "E"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "C. Legal and E. Public relations are the two entities an incident manager must coordinate "
            "with for incident communication reporting. The Legal team ensures all communications "
            "comply with regulatory requirements (GDPR, HIPAA, PCI-DSS breach notification), advises "
            "on liability, and reviews external disclosures. Public Relations manages stakeholder and "
            "media communications to protect organizational reputation and control the narrative. "
            "Law enforcement (A) is involved in criminal investigations but not routine communication "
            "processes. Governance (B) sets policy. Management (D) and HR (F) are internal "
            "stakeholders but not the primary communication process owners."
        )
    },

    "q-jc-248": {
        "answer": "C",
        "multiSelect": False, "selectCount": 1,
        "explanation": (
            "C. Impossible geo-velocity is the correct answer. This event occurs when a user account "
            "authenticates successfully from two geographically distant locations within a time window "
            "that makes physical travel impossible (e.g., New York and Tokyo within 30 minutes). "
            "This is a key indicator of compromised credentials being used by an attacker in a "
            "different location. MFA was bypassed, suggesting the attacker obtained or intercepted "
            "push notification codes. Dictionary attack (A) involves systematic password guessing, "
            "not successful MFA bypasses. Push phishing (B) tricks users into approving MFA — "
            "possible, but impossible geo-velocity specifically describes the pattern seen in logs. "
            "SIM swapping (D) intercepts SMS-based MFA. Password spray (F) targets many accounts."
        )
    },

    "q-jc-263": {
        "answer": ["B", "D"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "B. Reviewing the code and D. Debugging the code are the two methods that address runtime "
            "errors during code execution via a command-line interface. Code review (B) involves "
            "manually inspecting source code to identify logic errors, unsafe functions, or missing "
            "error handling that cause runtime failures. Debugging (D) involves using a debugger or "
            "CLI tools to step through execution, inspect variable states, and identify where the "
            "code fails at runtime. Dynamic application security testing (A) finds security "
            "vulnerabilities, not general runtime errors. Fuzzing (C) sends malformed inputs to "
            "find crashes. Coding standards (E) and IDS (F) are preventive controls, not diagnostic "
            "tools for existing runtime errors."
        )
    },

    "q-jc-265": {
        "answer": ["B", "D"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "B. Perform a full system-level backup following the change and D. Identify assets with "
            "dependencies that could be impacted by the change are the two key factors in reducing "
            "critical system failures during change management. Identifying dependent assets (D) "
            "before implementation prevents cascading failures — a critical step in risk assessment "
            "for changes. Performing a full backup (B) after the change ensures a rollback point "
            "if unexpected failures occur post-implementation. Documenting recovery plans (A) is "
            "important but done pre-change. Auditing changes (C) is detective, not preventive. "
            "Requiring diagrams (E) and inventory management (F) are governance tasks, not "
            "direct failure-prevention steps."
        )
    },

    "q-jc-271": {
        "answer": ["A", "F"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "A. Executive management and F. Systems administration are the primary recipients of "
            "vulnerability scan reports. Executive management (A) needs high-level summaries of "
            "organizational risk posture, compliance status, and resource allocation to make "
            "strategic security investment decisions. Systems administration (F) requires detailed "
            "technical findings — specific CVEs, affected hosts, severity scores, and remediation "
            "steps — to implement patches and configuration fixes. Law enforcement (B) receives "
            "reports only during criminal investigations. Marketing (C), Legal (D — for specific "
            "compliance matters only), and Product owners (E) are not standard vulnerability "
            "report stakeholders."
        )
    },

    "q-jc-288": {
        "answer": ["A", "B"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "A. SOAR (Security Orchestration, Automation and Response) and B. SIEM (Security "
            "Information and Event Management) are the two solutions that complement a new EDR "
            "deployment. SIEM aggregates and correlates alerts from the EDR with other log sources "
            "(firewalls, AD, cloud) to provide centralized threat visibility and alerting. SOAR "
            "automates response playbooks triggered by EDR detections — isolating hosts, blocking "
            "IPs, creating tickets — reducing analyst workload. MSP (C) is a managed service "
            "provider. NGFW (D) handles network-layer filtering. XDR (E) extends EDR across domains "
            "but is a different product category. DLP (F) handles data loss prevention, not "
            "incident response orchestration."
        )
    },

    "q-jc-340": {
        "answer": ["C", "F"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "C. Contracting a penetration test and F. Implementing threat modeling are the two "
            "best options for an organization wanting to minimize exposure of design flaws in "
            "a repeatedly compromised internet-facing web application. Threat modeling (F) "
            "systematically identifies architectural security weaknesses and design flaws during "
            "development or review, addressing root causes. Penetration testing (C) simulates "
            "real attacks to find exploitable vulnerabilities in the current design. A WAF (A) "
            "provides compensating controls but does not fix design flaws. Forensic analysis (B) "
            "examines past incidents. Tabletop exercises (D) test response plans. Bug bounties (E) "
            "discover vulnerabilities but require researcher participation."
        )
    },

    "q-jc-347": {
        "answer": ["B", "E"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "B. Integrity and E. Non-repudiation are the two properties that digital signatures "
            "provide for sensitive email communications. Integrity (B) ensures that the email "
            "content has not been altered during transit — the digital signature is mathematically "
            "tied to the exact content, so any modification invalidates the signature. "
            "Non-repudiation (E) ensures the sender cannot later deny sending the message, as "
            "the signature is tied to their private key. This is critical for legally binding "
            "contract negotiations. Confidentiality (A) requires encryption, not signatures. "
            "Privacy (C) and Anonymity (D) are protected by different controls. Authorization "
            "(F) controls access rights."
        )
    },

    "q-jc-352": {
        "answer": ["C", "E"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "C. Advise the incident response team on matters related to regulatory reporting and "
            "legal obligations, and E. Conduct computer and network damage assessments for insurance "
            "and legal proceedings are the two core legal team responsibilities during incident "
            "management. The legal team ensures regulatory compliance (GDPR 72-hour notification, "
            "HIPAA breach notification, SEC disclosure requirements) and protects the organization "
            "from liability. Damage assessments (E) support insurance claims and potential litigation. "
            "Staffing coordination (A) is HR. Contract review (B) is procurement/legal but post-incident. "
            "Security device management (D) is IT security. Security clearance verification (F) "
            "is HR/security management."
        )
    },

    "q-jc-357": {
        "answer": ["C", "F"],
        "multiSelect": True, "selectCount": 2,
        "explanation": (
            "C. Configure user account lockout after a limited number of failed attempts and "
            "F. Block inbound TCP port 3389 from untrusted remote IP addresses are the two "
            "correct immediate mitigations for a brute-force RDP attack. Account lockout (C) "
            "automatically disables the target account after N failed attempts, stopping the "
            "brute-force from succeeding. Blocking port 3389 from untrusted IPs (F) at the "
            "firewall level prevents the attacking IP range from reaching RDP entirely. "
            "Increasing audit granularity (A) improves visibility but does not stop the attack. "
            "Blocking ALL outbound traffic (B) is too disruptive. Installing a third-party "
            "remote tool (E) and disabling RDP has merit but is a longer-term solution, not "
            "an immediate mitigation for an active attack."
        )
    },
}

# Apply patches
patched = 0
for q in qs:
    if q['id'] in patches:
        patch = patches[q['id']]
        for k, v in patch.items():
            q[k] = v
        patched += 1

print(f"Patched {patched} questions")

# Final audit
empty_exp_after = [q['id'] for q in qs if q.get('type')=='mcq' and len((q.get('explanation') or '').strip()) < 10]
empty_ans_after = [q['id'] for q in qs if q.get('type')=='mcq' and (not q.get('answer') or q.get('answer') == [])]

print(f"Remaining empty explanations: {len(empty_exp_after)} {empty_exp_after}")
print(f"Remaining empty answers: {len(empty_ans_after)} {empty_ans_after}")

# Write back — header + JSON array + semicolon + footer (function + module.exports)
new_js = header + json.dumps(qs, indent=2, ensure_ascii=False) + ';\n' + footer
with open('/Users/oseyosmanyildiz/Desktop/Practice exam/questions.js', 'w') as f:
    f.write(new_js)

print(f"\n✓ Saved questions.js with {len(qs)} questions")
