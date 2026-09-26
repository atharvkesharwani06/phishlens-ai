import os
from typing import List, Optional

class Settings:
    PROJECT_NAME: str = "PhishLens AI"
    TAGLINE: str = "Understand the threat before you click."
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./phishlens.db")
    LLM_API_KEY: Optional[str] = os.getenv("LLM_API_KEY", None)
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-1.5-flash")
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    MAX_UPLOAD_SIZE_MB: int = 10

settings = Settings()
