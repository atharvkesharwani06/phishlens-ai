from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TextMessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=15000, description="The message or text content to analyze")
    source: Optional[str] = Field("direct", description="Source of the message, e.g. SMS, WhatsApp, Telegram, Email")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="Suspicious URL to analyze statically")

class EmailAnalysisRequest(BaseModel):
    sender_name: Optional[str] = Field("", description="Sender display name")
    sender_email: Optional[str] = Field("", description="Sender email address")
    reply_to: Optional[str] = Field("", description="Reply-to address")
    subject: Optional[str] = Field("", description="Email subject line")
    body: str = Field(..., min_length=1, max_length=30000, description="Email body text or HTML")
    links: Optional[List[str]] = Field(default=[], description="Extracted links from email")

class IndicatorModel(BaseModel):
    id: Optional[str] = None
    type: str # URGENCY, CREDENTIAL_REQUEST, SUSPICIOUS_DOMAIN, IMPERSONATION, etc.
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    title: str
    description: str
    evidence: Optional[str] = None
    highlight_text: Optional[str] = None

class UrlDetailsModel(BaseModel):
    url: str
    domain: Optional[str] = None
    tld: Optional[str] = None
    is_https: bool = False
    subdomain_count: int = 0
    url_length: int = 0
    entropy: float = 0.0
    has_ip_address: bool = False
    is_shortened: bool = False
    suspicious_patterns: List[str] = []
    brand_match: Optional[str] = None
    brand_mismatch: bool = False
    risk_level: str = "LOW"

class OcrDetailsModel(BaseModel):
    extracted_text: str
    detected_urls: List[str] = []
    detected_brands: List[str] = []
    detected_phones: List[str] = []
    detected_emails: List[str] = []

class DosAndDonts(BaseModel):
    dos: List[str]
    donts: List[str]

class ScoreBreakdown(BaseModel):
    ai_score: float # 0 - 100
    rule_score: float # 0 - 100
    url_score: float # 0 - 100
    risk_factors: List[str] = []

class AnalysisResponse(BaseModel):
    id: str
    input_type: str # text, url, email, image
    classification: str # SAFE, SUSPICIOUS, PHISHING
    threat_type: str # CREDENTIAL_HARVESTING, IMPERSONATION, MALICIOUS_LINK, FINANCIAL_FRAUD, SOCIAL_ENGINEERING, LEGITIMATE
    risk_score: int # 0 - 100
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float # 0.0 - 1.0 (e.g. 0.94 -> 94%)
    summary: str
    input_preview: Optional[str] = None
    original_text: Optional[str] = None
    indicators: List[IndicatorModel] = []
    url_details: Optional[UrlDetailsModel] = None
    ocr_details: Optional[OcrDetailsModel] = None
    dos_and_donts: DosAndDonts
    score_breakdown: ScoreBreakdown
    technical_details: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisListItem(BaseModel):
    id: str
    input_type: str
    classification: str
    threat_type: str
    risk_score: int
    risk_level: str
    confidence: float
    summary: str
    input_preview: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_analyses: int
    phishing_count: int
    suspicious_count: int
    safe_count: int
    avg_risk_score: float
    threat_distribution: Dict[str, int]
    risk_distribution: Dict[str, int]
    type_distribution: Dict[str, int]
    recent_analyses: List[AnalysisListItem]
    high_risk_alerts: List[AnalysisListItem]
