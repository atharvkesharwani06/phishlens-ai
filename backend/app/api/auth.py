"""
Mock / Demo Authentication Router
==================================
College Minor Project - PhishLens AI

NOTE & ARCHITECTURAL DISCLOSURE:
This module provides simulated demonstration endpoints (/api/auth/login and /api/auth/register)
for academic evaluation, viva demonstration, and API prototyping purposes.
- It does NOT connect to a database or persist user credentials.
- It returns a mock demonstration bearer token for API structure compliance and demonstration only.
- It does NOT provide production cryptographic security or JWT verification.
- For production deployment, replace with a full OAuth2/JWT provider with argon2/bcrypt password hashing.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class AuthLoginRequest(BaseModel):
    email: str
    password: str

class AuthRegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = "Security Analyst"

class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=AuthResponse)
def login(payload: AuthLoginRequest):
    """Simulated demo login endpoint for academic evaluation and project demonstration."""
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password required.")

    return {
        "token": "phishlens-demo-jwt-token-2026",
        "token_type": "bearer",
        "user": {
            "id": "usr-demo-001",
            "email": payload.email,
            "name": payload.email.split("@")[0].title(),
            "role": "Cybersecurity Analyst"
        }
    }

@router.post("/register", response_model=AuthResponse)
def register(payload: AuthRegisterRequest):
    """Simulated demo registration endpoint for academic evaluation and testing."""
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password required.")

    return {
        "token": "phishlens-demo-jwt-token-2026",
        "token_type": "bearer",
        "user": {
            "id": "usr-demo-002",
            "email": payload.email,
            "name": payload.name or "Analyst",
            "role": "Cybersecurity Analyst"
        }
    }
