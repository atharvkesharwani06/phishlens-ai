from fastapi import APIRouter
from typing import List
from app.schemas.demo import DemoCaseResponse

router = APIRouter(prefix="/demo-cases", tags=["Demo Center"])

SYNTHETIC_DEMO_CASES = [
    {
        "id": "demo-banking-phish-1",
        "title": "Urgent Bank Account Suspension",
        "category": "Banking",
        "input_type": "text",
        "description": "SMS claiming recipient's bank account will be blocked today unless verified via suspicious link.",
        "content": {
            "text": "URGENT: Your Chase bank account will be BLOCKED TODAY due to unusual login attempts. Verify your credentials immediately to avoid permanent closure: https://chase-security-auth.xyz/verify",
            "source": "SMS"
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "CREDENTIAL_HARVESTING",
        "expected_risk_score": 93
    },
    {
        "id": "demo-parcel-scam-2",
        "title": "Failed Parcel Delivery Fee",
        "category": "Delivery",
        "input_type": "text",
        "description": "SMS notifying that a USPS/DHL package is held due to incomplete address and requires a small rescheduling fee.",
        "content": {
            "text": "USPS Notification: Your package delivery has been suspended due to an incorrect delivery address. Please pay $2.99 rescheduling fee and confirm address now: https://usps-parcel-redelivery.buzz/tracking",
            "source": "SMS"
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "FINANCIAL_FRAUD",
        "expected_risk_score": 87
    },
    {
        "id": "demo-government-warning-3",
        "title": "Fake IRS Tax Penalty Notice",
        "category": "Government",
        "input_type": "email",
        "description": "Email impersonating tax enforcement authorities threatening legal prosecution.",
        "content": {
            "sender_name": "Internal Revenue Service Support",
            "sender_email": "tax-enforcement@irs-penalty-notification.xyz",
            "reply_to": "fraud@irs-penalty-notification.xyz",
            "subject": "FINAL WARNING: Immediate Tax Audit Case #TX-984210",
            "body": "LEGAL NOTICE: Our cyber crime audit team identified tax evasion penalties of $4,820 on your social security file. An arrest warrant will be filed within 24 hours. Pay your penalty immediately to avoid police action: https://irs-official-clearance.cc/settle",
            "links": ["https://irs-official-clearance.cc/settle"]
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "SOCIAL_ENGINEERING",
        "expected_risk_score": 96
    },
    {
        "id": "demo-prize-scam-4",
        "title": "Lottery / Cash Reward Lure",
        "category": "Prize",
        "input_type": "text",
        "description": "WhatsApp message promising unearned monetary lottery reward requiring personal bank details.",
        "content": {
            "text": "CONGRATULATIONS! 🎉 You have won ₹50,000 cash prize in the Google 2026 Grand Lucky Draw. Claim your reward immediately by entering your bank account and OTP: https://google-lucky-draw.top/claim",
            "source": "WhatsApp"
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "FINANCIAL_FRAUD",
        "expected_risk_score": 90
    },
    {
        "id": "demo-legit-otp-5",
        "title": "Legitimate Bank 2FA Verification OTP",
        "category": "Legitimate",
        "input_type": "text",
        "description": "Genuine multi-factor authentication SMS with strict no-share security advice.",
        "content": {
            "text": "Your Chase security code is 739204. It expires in 10 minutes. For your security, NEVER share this code or your password with anyone, including bank representatives.",
            "source": "SMS"
        },
        "expected_classification": "SAFE",
        "expected_threat_type": "LEGITIMATE",
        "expected_risk_score": 5
    },
    {
        "id": "demo-legit-delivery-6",
        "title": "Legitimate Amazon Package Dispatch",
        "category": "Legitimate",
        "input_type": "text",
        "description": "Standard eCommerce status notification prompting user to open the official installed app.",
        "content": {
            "text": "Your Amazon order #402-9841249 has been dispatched with carrier. You can track real-time driver delivery status inside your official Amazon app.",
            "source": "Notification"
        },
        "expected_classification": "SAFE",
        "expected_threat_type": "LEGITIMATE",
        "expected_risk_score": 8
    },
    {
        "id": "demo-msft-login-7",
        "title": "Fake Microsoft 365 Password Expiry",
        "category": "Corporate",
        "input_type": "email",
        "description": "Corporate phishing attack impersonating IT Helpdesk asking users to keep current password.",
        "content": {
            "sender_name": "Microsoft IT Helpdesk",
            "sender_email": "admin-helpdesk@msft-security-portal.work",
            "subject": "Action Required: Your Microsoft 365 Password Expires in 2 Hours",
            "body": "Dear Employee,\n\nYour corporate Microsoft 365 password is scheduled to expire today. To keep your current password and avoid losing email access, click the link below to verify your login credentials:\n\nhttps://login-microsoftonline-verify.icu/auth\n\nIT Support Team",
            "links": ["https://login-microsoftonline-verify.icu/auth"]
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "CREDENTIAL_HARVESTING",
        "expected_risk_score": 94
    },
    {
        "id": "demo-malicious-url-8",
        "title": "Static Suspicious URL Inspection",
        "category": "URL",
        "input_type": "url",
        "description": "Typosquatted high-entropy URL with deceptive login parameters.",
        "content": {
            "url": "http://192.168.1.100@paypal-secure-verification.xyz/webapps/auth/login?session=8923"
        },
        "expected_classification": "PHISHING",
        "expected_threat_type": "MALICIOUS_LINK",
        "expected_risk_score": 98
    }
]

@router.get("", response_model=List[DemoCaseResponse])
def get_demo_cases():
    """Retrieve all pre-configured synthetic demo scenarios for live presentations."""
    return SYNTHETIC_DEMO_CASES
