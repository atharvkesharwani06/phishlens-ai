from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse, AnalysisListItem

router = APIRouter(tags=["History"])

@router.get("/analyses", response_model=List[AnalysisListItem])
def get_analysis_history(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve history of past threat analyses."""
    records = db.query(Analysis).order_by(Analysis.created_at.desc()).offset(skip).limit(limit).all()
    return records

@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed threat report for a specific analysis by UUID."""
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis report not found.")
        
    # Construct response
    indicators = [
        {
            "id": ind.id,
            "type": ind.type,
            "severity": ind.severity,
            "title": ind.title,
            "description": ind.description,
            "evidence": ind.evidence,
            "highlight_text": ind.highlight_text
        }
        for ind in record.indicators
    ]
    
    url_details = None
    if record.url_details:
        u = record.url_details
        url_details = {
            "url": u.url,
            "domain": u.domain,
            "tld": u.tld,
            "is_https": u.is_https,
            "subdomain_count": u.subdomain_count,
            "url_length": u.url_length,
            "entropy": u.entropy,
            "has_ip_address": u.has_ip_address,
            "is_shortened": u.is_shortened,
            "suspicious_patterns": u.suspicious_patterns or [],
            "brand_match": u.brand_match,
            "brand_mismatch": u.brand_mismatch,
            "risk_level": record.risk_level
        }
        
    ocr_details = None
    if record.ocr_details:
        o = record.ocr_details
        ocr_details = {
            "extracted_text": o.extracted_text,
            "detected_urls": o.detected_urls or [],
            "detected_brands": o.detected_brands or [],
            "detected_phones": o.detected_phones or [],
            "detected_emails": o.detected_emails or []
        }

    return {
        "id": record.id,
        "input_type": record.input_type,
        "classification": record.classification,
        "threat_type": record.threat_type,
        "risk_score": record.risk_score,
        "risk_level": record.risk_level,
        "confidence": record.confidence,
        "summary": record.summary,
        "input_preview": record.input_preview,
        "original_text": record.input_preview,
        "indicators": indicators,
        "url_details": url_details,
        "ocr_details": ocr_details,
        "dos_and_donts": record.dos_and_donts or {"dos": [], "donts": []},
        "score_breakdown": record.score_breakdown or {"ai_score": 0, "rule_score": 0, "url_score": 0, "risk_factors": []},
        "technical_details": record.technical_details or {},
        "created_at": record.created_at
    }

@router.delete("/analyses/{analysis_id}")
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """Delete a single analysis record."""
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis report not found.")
    db.delete(record)
    db.commit()
    return {"message": "Analysis report deleted successfully."}

@router.delete("/analyses")
def clear_all_history(db: Session = Depends(get_db)):
    """Clear all analysis history."""
    db.query(Analysis).delete()
    db.commit()
    return {"message": "All analysis records deleted successfully."}
