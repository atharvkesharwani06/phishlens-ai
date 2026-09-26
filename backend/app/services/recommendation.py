from typing import Dict, List

def generate_recommendations(classification: str, threat_type: str, has_url: bool) -> Dict[str, List[str]]:
    """
    Generate clear, non-technical actionable guidance (DOs and DO NOTs).
    """
    if classification == "SAFE":
        return {
            "dos": [
                "Proceed with normal awareness — no immediate malicious indicators were detected.",
                "Verify standard sender information before sharing sensitive personal records.",
                "Keep multi-factor authentication (2FA) enabled on your primary accounts."
            ],
            "donts": [
                "Never share your one-time passwords (OTP) or authentication codes over phone or chat.",
                "Do not disable security warnings on your browser or device."
            ]
        }
    
    if classification == "SUSPICIOUS":
        dos = [
            "Verify the authenticity of this message directly through an official channel (e.g. typing the company's known web address yourself).",
            "Contact the purported sender using their official customer service number from your billing card or verified app.",
            "Report this message to your organization's IT security team or spam filter."
        ]
        donts = [
            "Do not click any embedded links or open attachments in this message.",
            "Do not reply or provide any requested verification details.",
            "Do not rush — take time to double-check unexpected requests."
        ]
        return {"dos": dos, "donts": donts}

    # PHISHING / CRITICAL
    dos = [
        "Immediately close or delete this message.",
        "If you already clicked or entered data, immediately change your account password on the official website.",
        "Notify your bank or organization's cybersecurity team if financial or corporate info was exposed.",
        "Forward this message to national anti-phishing portals (e.g., reportphishing@apwg.org or SMS 7726)."
    ]
    
    donts = [
        "❌ DO NOT click any link in this message under any circumstance.",
        "❌ DO NOT enter your password, PIN, CVV, or OTP on any page linked here.",
        "❌ DO NOT reply to the sender or call any phone numbers listed in the message.",
        "❌ DO NOT download or open any attached files.",
        "❌ DO NOT approve any unexpected push authentication prompts."
    ]

    return {"dos": dos, "donts": donts}
