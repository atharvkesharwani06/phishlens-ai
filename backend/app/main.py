import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.session import engine, Base
from app.api.analysis import router as analysis_router
from app.api.history import router as history_router
from app.api.demo import router as demo_router
from app.api.stats import router as stats_router
from app.api.education import router as education_router
from app.api.health import router as health_router

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable AI Cybersecurity Threat Analysis Platform for Phishing, Scams, and Malicious Links.",
    version="1.0.0"
)

# CORS middleware for seamless communication with React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global safe error handler - never leaks technical traces to users
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Analysis Processing Error",
            "message": "PhishLens encountered an error analyzing this input safely. Please check input formatting.",
            "detail": str(exc) if not isinstance(exc, (RuntimeError, SystemError)) else "Internal processing anomaly"
        }
    )

# Include API Routers
app.include_router(health_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(demo_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(education_router, prefix="/api")

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
