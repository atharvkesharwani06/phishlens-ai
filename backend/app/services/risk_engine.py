from typing import Dict, Any, List, Tuple

def calculate_composite_risk(
    ml_phishing_prob: float, # 0.0 - 1.0
    feature_results: Dict[str, Any],
    url_results: List[Dict[str, Any]] = None,
    email_context: Dict[str, Any] = None
) -> Tuple[int, str, str, str, float, Dict[str, Any]]:
    """
    Transparent Multi-Factor Risk Assessment Engine.
    Combines:
    - ML / AI classification score (50% weight)
    - Security Rule & Indicator Points (30% weight)
    - Static URL & Contextual Points (20% weight)

    Returns:
    (risk_score: int 0-100,
     risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
     classification: 'SAFE' | 'SUSPICIOUS' | 'PHISHING',
     threat_type: str,
     confidence: float,
     score_breakdown: dict)
    """
    # 1. AI Component (0 - 100)
    ai_score = ml_phishing_prob * 100.0
    
    # 2. Rule Component (0 - 100)
    rule_score_raw = (
        feature_results.get("urgency_score", 0) * 0.8 +
        feature_results.get("credential_score", 0) * 1.2 +
        feature_results.get("financial_score", 0) * 0.9 +
        feature_results.get("fear_score", 0) * 0.8 +
        feature_results.get("cta_score", 0) * 0.5
    )
    rule_score = min(100.0, rule_score_raw)
    
    # 3. URL Component (0 - 100)
    url_score = 0.0
    if url_results and len(url_results) > 0:
        max_url_score = max(u.get("risk_score_addition", 0) for u in url_results)
        url_score = float(max_url_score)
        
    # Contextual Email Modifiers
    if email_context:
        sender_name = email_context.get("sender_name", "").lower()
        sender_email = email_context.get("sender_email", "").lower()
        
        # Sender display name vs email mismatch
        if ("bank" in sender_name or "paypal" in sender_name or "support" in sender_name or "security" in sender_name) and ("gmail.com" in sender_email or "yahoo.com" in sender_email or "hotmail.com" in sender_email):
            rule_score = min(100.0, rule_score + 35)

    # Weighted composite score
    if url_results:
        composite = (ai_score * 0.45) + (rule_score * 0.35) + (url_score * 0.20)
    else:
        composite = (ai_score * 0.55) + (rule_score * 0.45)
        
    final_score = int(round(min(100.0, max(0.0, composite))))
    
    # Risk Level mapping
    if final_score >= 80:
        risk_level = "CRITICAL"
        classification = "PHISHING"
    elif final_score >= 60:
        risk_level = "HIGH"
        classification = "PHISHING"
    elif final_score >= 30:
        risk_level = "MEDIUM"
        classification = "SUSPICIOUS"
    else:
        risk_level = "LOW"
        classification = "SAFE"
        
    # Threat Type determination
    threat_type = "LEGITIMATE"
    if classification in ["PHISHING", "SUSPICIOUS"]:
        if feature_results.get("credential_score", 0) > 0:
            threat_type = "CREDENTIAL_HARVESTING"
        elif any(u.get("brand_mismatch") for u in (url_results or [])):
            threat_type = "IMPERSONATION"
        elif feature_results.get("financial_score", 0) > 0:
            threat_type = "FINANCIAL_FRAUD"
        elif url_score >= 40:
            threat_type = "MALICIOUS_LINK"
        elif feature_results.get("fear_score", 0) > 0 or feature_results.get("urgency_score", 0) > 0:
            threat_type = "SOCIAL_ENGINEERING"
        else:
            threat_type = "SUSPICIOUS_COMMUNICATION"
            
    # Confidence calculation based on indicator convergence
    confidence_base = 0.85
    if final_score > 85 or final_score < 15:
        confidence_base = 0.94
    elif final_score > 70 or final_score < 30:
        confidence_base = 0.89
    else:
        confidence_base = 0.78
        
    risk_factors = []
    if feature_results.get("urgency_score", 0) > 0:
        risk_factors.append("Artificial urgency / time pressure")
    if feature_results.get("credential_score", 0) > 0:
        risk_factors.append("Credential or password request")
    if feature_results.get("financial_score", 0) > 0:
        risk_factors.append("Financial solicitation / reward lure")
    if url_score > 30:
        risk_factors.append("Suspicious domain / URL structure")
    if email_context and email_context.get("sender_mismatch"):
        risk_factors.append("Sender display name / domain mismatch")

    score_breakdown = {
        "ai_score": round(ai_score, 1),
        "rule_score": round(rule_score, 1),
        "url_score": round(url_score, 1),
        "risk_factors": risk_factors
    }
    
    return final_score, risk_level, classification, threat_type, confidence_base, score_breakdown
