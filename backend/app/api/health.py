from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    """System health check and version info."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": "1.0.0-hackathon",
        "engine": "PhishLens Hybrid (Rules + ML + Static URL + OCR + Explainability)"
    }
