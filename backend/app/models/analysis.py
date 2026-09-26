import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    input_type = Column(String(50), nullable=False) # 'text', 'url', 'email', 'image'
    classification = Column(String(50), nullable=False) # 'SAFE', 'SUSPICIOUS', 'PHISHING'
    threat_type = Column(String(100), nullable=False) # 'CREDENTIAL_HARVESTING', 'IMPERSONATION', etc.
    risk_score = Column(Integer, nullable=False) # 0 - 100
    risk_level = Column(String(50), nullable=False) # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    confidence = Column(Float, nullable=False) # 0.0 - 1.0
    summary = Column(Text, nullable=False)
    input_preview = Column(Text, nullable=True) # Sanitized snippet / preview (no private passwords)
    
    # Detailed components breakdown
    score_breakdown = Column(JSON, nullable=True) # { ai_score, rule_score, url_score }
    dos_and_donts = Column(JSON, nullable=True) # { dos: [...], donts: [...] }
    technical_details = Column(JSON, nullable=True) # structured metrics

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    indicators = relationship("Indicator", back_populates="analysis", cascade="all, delete-orphan")
    url_details = relationship("UrlAnalysis", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    ocr_details = relationship("OcrResult", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    type = Column(String(100), nullable=False) # 'URGENCY', 'CREDENTIAL_REQUEST', 'SUSPICIOUS_DOMAIN', etc.
    severity = Column(String(50), nullable=False) # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    highlight_text = Column(String(255), nullable=True)

    analysis = relationship("Analysis", back_populates="indicators")

class UrlAnalysis(Base):
    __tablename__ = "url_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    url = Column(Text, nullable=False)
    domain = Column(String(255), nullable=True)
    tld = Column(String(50), nullable=True)
    is_https = Column(Boolean, default=False)
    subdomain_count = Column(Integer, default=0)
    url_length = Column(Integer, default=0)
    entropy = Column(Float, default=0.0)
    has_ip_address = Column(Boolean, default=False)
    is_shortened = Column(Boolean, default=False)
    suspicious_patterns = Column(JSON, default=list)
    brand_match = Column(String(100), nullable=True)
    brand_mismatch = Column(Boolean, default=False)

    analysis = relationship("Analysis", back_populates="url_details")

class OcrResult(Base):
    __tablename__ = "ocr_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    extracted_text = Column(Text, nullable=False)
    detected_urls = Column(JSON, default=list)
    detected_brands = Column(JSON, default=list)
    detected_phones = Column(JSON, default=list)
    detected_emails = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", back_populates="ocr_details")

class DemoCase(Base):
    __tablename__ = "demo_cases"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False) # 'Banking', 'Delivery', 'Government', 'Prize', 'Legitimate'
    input_type = Column(String(50), nullable=False) # 'text', 'url', 'email', 'image'
    description = Column(Text, nullable=False)
    content = Column(JSON, nullable=False) # { text: "...", sender: "...", subject: "...", url: "..." }
    expected_classification = Column(String(50), nullable=False)
    expected_threat_type = Column(String(100), nullable=False)
    expected_risk_score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
