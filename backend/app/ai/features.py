import re
from typing import Dict, Any, List, Tuple

# Suspicious lexicon categories with weights and explanations
URGENCY_PATTERNS = [
    (r"\b(urgent|immediately|right now|within 24 hours?|within \d+ (?:hours?|mins?|minutes?)|today|deadline|action required|immediate action|instant(?:ly)?|expires? (?:today|soon|in \d+ hours?)|last chance|final notice|time is running out)\b", "Urgency Pressure", "Pressures the recipient with artificial urgency to bypass logical critical thinking."),
    (r"\b(account (?:will be |is )(?:blocked|suspended|disabled|locked|terminated|closed|deactivated))\b", "Account Suspension Threat", "Threatens sudden loss of account access to create anxiety and fear."),
    (r"\b(prevent (?:suspension|deactivation|closure|blocking))\b", "Panic Coercion", "Induces panic by warning of irreversible account termination.")
]

CREDENTIAL_PATTERNS = [
    (r"\b(enter (?:your )?(?:password|passcode|pin|otp|login credentials?|secret code|seed phrase))\b", "Credential Request", "Solicits secret passwords or credentials that legitimate institutions never ask via plain text/links."),
    (r"\b(verify (?:your )?(?:account|identity|password|details|credentials?|card|ssn))\b", "Identity Verification Trap", "Uses fake verification requests to lure the victim to a credential-harvesting trap."),
    (r"\b(share (?:your )?(?:otp|one[- ]time[- ]password|code))\b", "OTP Interception Attempt", "Attempts to deceive the user into disclosing an active multi-factor authentication token."),
    (r"\b(update (?:your )?(?:billing|payment|security|login|profile) (?:info|information|details))\b", "Fake Profile Update", "Lures recipient to fake update portals to steal financial/personal records."),
    (r"\b(confirm (?:your )?(?:cvv|card number|pin|ssn|social security))\b", "Direct Financial/PII Harvesting", "Blatantly asks for ultra-sensitive card or identity numbers.")
]

FINANCIAL_SCAM_PATTERNS = [
    (r"\b(won|winner|claim reward|cash prize|lottery|congratulations!? you have won|credited with|jackpot|free gift|reward points? expiring)\b", "Lure / Prize Scam", "Exploits greed and excitement through fabricated lotteries, prizes, or reward schemes."),
    (r"(?:₹|\$|€|£|rs\.?|inr|usd)\s*[\d,]+(?:\.\d+)?\s*(?:cashback|reward|won|refund|bonus|credited|prize)", "Monetary Lure", "Promises unearned financial windfall to encourage clicking without verification."),
    (r"\b(pay (?:₹|\$|€|£|rs\.?|inr|usd)?\s*[\d,]+(?:\.\d+)?\s*(?:to reschedule|for delivery|customs fee|processing fee|tax clearance))\b", "Advance Fee Fraud", "Requests small upfront fee for delivery or clearance, typical of parcel and customs scams."),
    (r"\b(unauthorized (?:charge|transaction|transfer|payment|activity) of)\b", "Fake Security Alert", "Fabricates unauthorized charges to induce the user into calling a fraudulent helpline or logging into a phishing page.")
]

FEAR_LEGAL_PATTERNS = [
    (r"\b(police action|legal notice|court summons|arrest warrant|cyber crime (?:cell|branch|unit)|tax evasion|irs penalty|arrested|fbi warning)\b", "Legal & Authority Intimidation", "Impersonates law enforcement or judicial bodies to paralyze the victim with fear."),
    (r"\b(case (?:number|id|ref):?\s*#?[A-Z0-9-]+)\b", "Fake Official Case Citation", "Uses fabricated official legal reference numbers to appear legitimate.")
]

CALL_TO_ACTION_PATTERNS = [
    (r"\b(click (?:here|the link|below|now)|tap (?:here|link)|follow the link|open link)\b", "Urgent Call-To-Action", "Directs immediate click-through to external web links."),
    (r"\b(call (?:toll[- ]free|immediately|now|support):?\s*[\+\d\s\(\)-]{7,})\b", "Vishing / Helpline Scam", "Encourages dialing fraudulent call centers for voice phishing (vishing).")
]

def extract_message_features(text: str) -> Dict[str, Any]:
    """
    Extract linguistic, psychological, behavioral, and structural cyber threat features.
    Returns calculated scores, matched patterns, and exact evidence spans for interactive highlighting.
    """
    if not text:
        return {
            "urgency_score": 0,
            "credential_score": 0,
            "financial_score": 0,
            "fear_score": 0,
            "cta_score": 0,
            "all_caps_ratio": 0.0,
            "excessive_punctuation": False,
            "indicators": [],
            "highlights": []
        }
        
    text_lower = text.lower()
    text_len = len(text)
    
    # 1. Structural features
    alpha_chars = [c for c in text if c.isalpha()]
    upper_chars = [c for c in alpha_chars if c.isupper()]
    all_caps_ratio = (len(upper_chars) / len(alpha_chars)) if alpha_chars else 0.0
    excessive_caps = all_caps_ratio > 0.35 and len(alpha_chars) > 20
    
    exclamation_count = text.count("!")
    excessive_punct = exclamation_count >= 3 or ("?!" in text) or ("!!!" in text)
    
    indicators = []
    highlights: List[Dict[str, Any]] = [] # { text, reason, severity, start, end }
    
    urgency_points = 0
    credential_points = 0
    financial_points = 0
    fear_points = 0
    cta_points = 0
    
    # Helper to check pattern matches
    def scan_pattern_list(patterns, category, base_points, severity_level):
        nonlocal urgency_points, credential_points, financial_points, fear_points, cta_points
        cat_matches = []
        for regex_str, title, description in patterns:
            for match in re.finditer(regex_str, text, re.IGNORECASE):
                matched_str = match.group(0)
                span = match.span()
                cat_matches.append((matched_str, title, description, span))
                highlights.append({
                    "text": matched_str,
                    "reason": f"{title}: {description}",
                    "severity": severity_level,
                    "category": category,
                    "start": span[0],
                    "end": span[1]
                })
        
        if cat_matches:
            first_match = cat_matches[0]
            # Accumulate severity score
            if category == "URGENCY":
                urgency_points += base_points * len(cat_matches)
            elif category == "CREDENTIAL":
                credential_points += base_points * len(cat_matches)
            elif category == "FINANCIAL":
                financial_points += base_points * len(cat_matches)
            elif category == "FEAR":
                fear_points += base_points * len(cat_matches)
            elif category == "CTA":
                cta_points += base_points * len(cat_matches)
                
            indicators.append({
                "type": category,
                "severity": severity_level,
                "title": first_match[1],
                "description": first_match[2],
                "evidence": f'"{first_match[0]}"' if len(first_match[0]) < 80 else f'"{first_match[0][:75]}..."',
                "highlight_text": first_match[0]
            })
            
    # Scan each category
    scan_pattern_list(URGENCY_PATTERNS, "URGENCY", 20, "HIGH")
    scan_pattern_list(CREDENTIAL_PATTERNS, "CREDENTIAL_REQUEST", 25, "CRITICAL")
    scan_pattern_list(FINANCIAL_SCAM_PATTERNS, "FINANCIAL_FRAUD", 20, "HIGH")
    scan_pattern_list(FEAR_LEGAL_PATTERNS, "FEAR_INTIMIDATION", 20, "HIGH")
    scan_pattern_list(CALL_TO_ACTION_PATTERNS, "SUSPICIOUS_CTA", 15, "MEDIUM")
    
    # Check casing anomaly
    if excessive_caps:
        indicators.append({
            "type": "ANOMALY_CASING",
            "severity": "LOW",
            "title": "Excessive Capitalization",
            "description": f"Unusually high proportion of ALL-CAPS letters ({int(all_caps_ratio * 100)}%), a psychological tactic to force attention.",
            "evidence": text[:60] + "..." if len(text) > 60 else text,
            "highlight_text": None
        })
        
    if excessive_punct:
        indicators.append({
            "type": "ANOMALY_PUNCTUATION",
            "severity": "LOW",
            "title": "Aggressive Punctuation",
            "description": "Repeated exclamation marks or panic punctuation designed to evoke urgency.",
            "evidence": "Multiple exclamation marks (!!!)",
            "highlight_text": None
        })

    # Deduplicate highlights and sort by start position
    unique_highlights = []
    seen_spans = set()
    for h in sorted(highlights, key=lambda x: x["start"]):
        span_key = (h["start"], h["end"])
        if span_key not in seen_spans:
            seen_spans.add(span_key)
            unique_highlights.append(h)

    return {
        "urgency_score": min(100, urgency_points),
        "credential_score": min(100, credential_points),
        "financial_score": min(100, financial_points),
        "fear_score": min(100, fear_points),
        "cta_score": min(100, cta_points),
        "all_caps_ratio": round(all_caps_ratio, 2),
        "excessive_punctuation": excessive_punct,
        "indicators": indicators,
        "highlights": unique_highlights
    }
