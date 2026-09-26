from pydantic import BaseModel
from typing import Dict, Any, Optional

class DemoCaseResponse(BaseModel):
    id: str
    title: str
    category: str
    input_type: str
    description: str
    content: Dict[str, Any]
    expected_classification: str
    expected_threat_type: str
    expected_risk_score: int

    class Config:
        from_attributes = True

class QuizQuestion(BaseModel):
    id: int
    title: str
    scenario: str
    sender: Optional[str] = None
    url: Optional[str] = None
    question: str
    is_phishing: bool
    explanation: str
    indicators: list[str]
    category: str
