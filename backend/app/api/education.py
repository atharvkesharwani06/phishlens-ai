from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/education", tags=["Education"])

EDUCATION_MODULES = [
    {
        "id": "urgency",
        "title": "Artificial Urgency & Fear Tactics",
        "icon": "ClockAlert",
        "description": "How attackers use panic deadlines to bypass rational evaluation.",
        "what_it_looks_like": "Phrases like 'Account blocked in 24 hours', 'Final Notice', or 'Immediate Action Required'.",
        "why_attackers_use_it": "When humans panic about losing account access or money, critical thinking drops and emotional impulse clicks take over.",
        "how_to_protect": "Pause and take a breath. Legitimate banks and government agencies never permanently shut down accounts with a 2-hour SMS deadline without prior postal or in-app notice."
    },
    {
        "id": "urls",
        "title": "Deceptive URLs & Homoglyphs",
        "icon": "Link2",
        "description": "Techniques used to disguise malicious domain names as trusted entities.",
        "what_it_looks_like": "Subdomain tricks (e.g. `paypal.com.verify-user.cc`), typosquatting (`netfl1x.com`), or strange TLDs (`.xyz`, `.buzz`, `.top`).",
        "why_attackers_use_it": "Casual glances only notice the brand name in the prefix without reading the apex domain at the end.",
        "how_to_protect": "Read domain names from right to left starting just before the first single slash `/`. The domain immediately before the `.com` or `.org` is the actual server owner."
    },
    {
        "id": "otp",
        "title": "OTP & Multi-Factor Interception",
        "icon": "KeyRound",
        "description": "Social engineering methods designed to steal live authentication codes.",
        "what_it_looks_like": "Callers or text messages claiming 'We detected fraud on your card. Read us the 6-digit SMS code to cancel the charge'.",
        "why_attackers_use_it": "Attackers already have your password or card number and only need the 2FA token to complete the takeover.",
        "how_to_protect": "Never share any OTP with anyone. Official representatives will never ask you to verbally state or message your security code."
    },
    {
        "id": "impersonation",
        "title": "Brand & Executive Impersonation",
        "icon": "ShieldAlert",
        "description": "Spoofing reputable logos, display names, and corporate authority.",
        "what_it_looks_like": "Emails showing 'Microsoft IT Support' or 'Bank of America Security' sent from a generic `gmail.com` or spoofed domain.",
        "why_attackers_use_it": "Leverages implicit trust in recognizable logos and corporate authority to lower suspicion.",
        "how_to_protect": "Examine the sender's actual email address after the display name. Check if the domain exactly matches the official corporate URL."
    },
    {
        "id": "parcel",
        "title": "Parcel Delivery & Smishing",
        "icon": "Package",
        "description": "SMS scams exploiting high volumes of online shipping and package tracking.",
        "what_it_looks_like": "'USPS: Incomplete address. Pay $1.50 to reschedule your package delivery'.",
        "why_attackers_use_it": "Most households order online frequently and small fees under $5 feel trivial to pay on impulse.",
        "how_to_protect": "Track shipments only inside the official carrier application using your original order tracking number."
    },
    {
        "id": "prize",
        "title": "Lottery & Monetary Windfall Scams",
        "icon": "Gift",
        "description": "Promises of unearned cash rewards designed to extract banking records.",
        "what_it_looks_like": "'Congratulations! You have been selected to win ₹50,000 cash prize. Claim now'.",
        "why_attackers_use_it": "Exploits human greed and curiosity, requesting bank details under the guise of transferring 'winnings'.",
        "how_to_protect": "Remember: You cannot win a lottery you never entered. Legitimate prizes do not require upfront clearance fees or banking passwords."
    }
]

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "title": "Urgent Bank Account Suspension SMS",
        "scenario": "You receive an SMS: 'URGENT: Your Chase checking account is suspended. Verify credentials immediately at http://chase-security-login.xyz to avoid legal penalty.'",
        "sender": "Alert-Chase",
        "url": "http://chase-security-login.xyz",
        "question": "Is this message suspicious?",
        "is_phishing": True,
        "explanation": "This is a classic Phishing attack! It combines artificial urgency ('URGENT', 'avoid legal penalty') with an unverified third-party domain ('.xyz' instead of chase.com) to harvest your login credentials.",
        "indicators": ["Artificial Urgency", "Suspicious TLD (.xyz)", "Threatening Language", "Direct Credential Request"],
        "category": "Banking"
    },
    {
        "id": 2,
        "title": "Standard Bank 2FA Code",
        "scenario": "You receive an SMS: 'Your authentication code is 849201. Valid for 10 minutes. For your security, NEVER share this code with anyone, including bank employees.'",
        "sender": "84822",
        "url": None,
        "question": "Is this message suspicious?",
        "is_phishing": False,
        "explanation": "This is a Safe and legitimate 2FA verification message. It contains no external links, requests no personal data, and explicitly warns you never to disclose the code.",
        "indicators": ["Clear Security Warning", "No External Links", "Standard 2FA Format"],
        "category": "Authentication"
    },
    {
        "id": 3,
        "title": "USPS Failed Delivery Notification",
        "scenario": "You receive an SMS: 'USPS: Your package was placed on hold due to a missing street number. Update your address and pay a $1.99 redelivery fee at https://usps-parcel-track.buzz/fee'",
        "sender": "+1 (555) 948-2910",
        "url": "https://usps-parcel-track.buzz/fee",
        "question": "Is this message suspicious?",
        "is_phishing": True,
        "explanation": "This is a Phishing Smishing scam! Attackers use small fees to trick victims into entering credit card numbers onto fake phishing websites with high-abuse domains ('.buzz').",
        "indicators": ["Suspicious Domain (.buzz)", "Unsolicited Fee Request", "Smishing Tactic"],
        "category": "Delivery"
    },
    {
        "id": 4,
        "title": "Official Amazon Order Confirmation",
        "scenario": "An email states: 'Your order #112-948201 has shipped. You can view item status in your Amazon Orders dashboard or in the mobile app.'",
        "sender": "auto-confirm@amazon.com",
        "url": "https://www.amazon.com/orders",
        "question": "Is this message suspicious?",
        "is_phishing": False,
        "explanation": "This is a Legitimate notification. The sender domain matches the official corporate domain (@amazon.com) and directs the user to their standard verified app dashboard.",
        "indicators": ["Legitimate Sender Domain", "No Panic Inducement", "Encourages In-App Verification"],
        "category": "eCommerce"
    },
    {
        "id": 5,
        "title": "Microsoft IT Password Expiry Warning",
        "scenario": "An email from 'IT Support <helpdesk@corporate-login-support.work>' says: 'Action Required: Your password expires in 2 hours. Click here to retain your existing password: http://msft-auth-token.work/login'",
        "sender": "helpdesk@corporate-login-support.work",
        "url": "http://msft-auth-token.work/login",
        "question": "Is this message suspicious?",
        "is_phishing": True,
        "explanation": "This is a dangerous Credential Harvesting attack! Real enterprise IT systems never allow you to 'retain your existing password' by entering credentials into an external unencrypted HTTP link.",
        "indicators": ["Domain Mismatch", "Credential Harvesting", "Insecure HTTP Protocol", "False Pretext"],
        "category": "Corporate"
    }
]

@router.get("/modules")
def get_education_modules():
    """Retrieve cybersecurity learning topics and defensive guides."""
    return EDUCATION_MODULES

@router.get("/quiz")
def get_quiz_questions():
    """Retrieve interactive cybersecurity spot-the-phish quiz questions."""
    return QUIZ_QUESTIONS
