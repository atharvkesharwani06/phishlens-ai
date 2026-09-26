import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.models.analysis import Analysis, Indicator, UrlAnalysis, OcrResult
from app.schemas.analysis import (
    TextMessageRequest,
    UrlAnalysisRequest,
    EmailAnalysisRequest,
    AnalysisResponse,
    AnalysisListItem
)
from app.ai.analyzer import AIAnalyzer
from app.config import settings

router = APIRouter(prefix="/analyze", tags=["Analysis"])

def save_analysis_to_db(db: Session, result: dict, raw_input_preview: str) -> Analysis:
    """Save an analysis run and associated indicators/URL records to the SQLite database."""
    analysis_record = Analysis(
        id=str(uuid.uuid4()),
        input_type=result["input_type"],
        classification=result["classification"],
        threat_type=result["threat_type"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        confidence=result["confidence"],
        summary=result["summary"],
        input_preview=raw_input_preview[:300] if raw_input_preview else "",
        score_breakdown=result.get("score_breakdown", {}),
        dos_and_donts=result.get("dos_and_donts", {}),
        technical_details=result.get("technical_details", {}),
        created_at=datetime.datetime.utcnow()
    )
    db.add(analysis_record)
    db.flush()

    # Save indicators
    for ind in result.get("indicators", []):
        db_ind = Indicator(
            id=str(uuid.uuid4()),
            analysis_id=analysis_record.id,
            type=ind["type"],
            severity=ind["severity"],
            title=ind["title"],
            description=ind["description"],
            evidence=ind.get("evidence", ""),
            highlight_text=ind.get("highlight_text", "")
        )
        db.add(db_ind)

    # Save URL analysis if present
    if result.get("url_details"):
        u = result["url_details"]
        db_url = UrlAnalysis(
            id=str(uuid.uuid4()),
            analysis_id=analysis_record.id,
            url=u.get("url", ""),
            domain=u.get("domain", ""),
            tld=u.get("tld", ""),
            is_https=u.get("is_https", False),
            subdomain_count=u.get("subdomain_count", 0),
            url_length=u.get("url_length", 0),
            entropy=u.get("entropy", 0.0),
            has_ip_address=u.get("has_ip_address", False),
            is_shortened=u.get("is_shortened", False),
            suspicious_patterns=u.get("suspicious_patterns", []),
            brand_match=u.get("brand_match"),
            brand_mismatch=u.get("brand_mismatch", False)
        )
        db.add(db_url)

    # Save OCR details if present
    if result.get("ocr_details"):
        ocr = result["ocr_details"]
        db_ocr = OcrResult(
            id=str(uuid.uuid4()),
            analysis_id=analysis_record.id,
            extracted_text=ocr.get("extracted_text", ""),
            detected_urls=ocr.get("detected_urls", []),
            detected_brands=ocr.get("detected_brands", []),
            detected_phones=ocr.get("detected_phones", []),
            detected_emails=ocr.get("detected_emails", [])
        )
        db.add(db_ocr)

    db.commit()
    db.refresh(analysis_record)
    return analysis_record

@router.post("/text", response_model=AnalysisResponse)
def analyze_text_endpoint(payload: TextMessageRequest, db: Session = Depends(get_db)):
    """Analyze a suspicious message or text content."""
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")
    
    result = AIAnalyzer.analyze_text(payload.text, source=payload.source or "direct")
    db_record = save_analysis_to_db(db, result, payload.text)
    
    result["id"] = db_record.id
    result["created_at"] = db_record.created_at
    result["input_preview"] = db_record.input_preview
    return result

@router.post("/url", response_model=AnalysisResponse)
def analyze_url_endpoint(payload: UrlAnalysisRequest, db: Session = Depends(get_db)):
    """Perform static security analysis on a suspicious URL without opening it."""
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
        
    result = AIAnalyzer.analyze_url(payload.url.strip())
    db_record = save_analysis_to_db(db, result, payload.url)
    
    result["id"] = db_record.id
    result["created_at"] = db_record.created_at
    result["input_preview"] = db_record.input_preview
    return result

@router.post("/email", response_model=AnalysisResponse)
def analyze_email_endpoint(payload: EmailAnalysisRequest, db: Session = Depends(get_db)):
    """Analyze an email message with sender headers, subject line, body, and links."""
    if not payload.body or not payload.body.strip():
        raise HTTPException(status_code=400, detail="Email body cannot be empty.")
        
    email_data = {
        "sender_name": payload.sender_name or "",
        "sender_email": payload.sender_email or "",
        "reply_to": payload.reply_to or "",
        "subject": payload.subject or "",
        "body": payload.body,
        "links": payload.links or []
    }
    
    result = AIAnalyzer.analyze_email(email_data)
    preview = f"From: {payload.sender_name} <{payload.sender_email}>\nSubject: {payload.subject}\n{payload.body}"
    db_record = save_analysis_to_db(db, result, preview)
    
    result["id"] = db_record.id
    result["created_at"] = db_record.created_at
    result["input_preview"] = db_record.input_preview
    return result

@router.post("/image", response_model=AnalysisResponse)
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Perform OCR and AI security threat detection on a screenshot or image."""
    # 1. Validate file extension and MIME type
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type ({file.content_type}). Only PNG, JPG, JPEG, and WEBP are supported."
        )
        
    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )
        
    try:
        result = AIAnalyzer.analyze_image_bytes(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")
        
    extracted_text = result.get("ocr_details", {}).get("extracted_text", file.filename)
    db_record = save_analysis_to_db(db, result, f"Image upload: {file.filename}\nExtracted: {extracted_text}")
    
    result["id"] = db_record.id
    result["created_at"] = db_record.created_at
    result["input_preview"] = db_record.input_preview
    return result
