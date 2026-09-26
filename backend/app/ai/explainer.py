from typing import Dict, Any, List, Optional
from app.config import settings

def generate_natural_explanation(
    classification: str,
    threat_type: str,
    risk_score: int,
    risk_level: str,
    indicators: List[Dict[str, Any]],
    url_results: List[Dict[str, Any]] = None,
    email_context: Dict[str, Any] = None,
    input_type: str = "text"
) -> str:
    """
    Generate an explainable, non-technical natural language summary
    outlining why PhishLens flagged or cleared this input.
    """
    if classification == "SAFE":
        return (
            f"PhishLens evaluated this {input_type} content and found no malicious patterns, "
            "credential harvesting traps, or deceptive links. The risk score is low (Risk: "
            f"{risk_score}/100, Level: {risk_level}). Always exercise routine vigilance before entering sensitive credentials."
        )

    threat_name = threat_type.replace("_", " ").title()
    summary_parts = []
    
    summary_parts.append(
        f"PhishLens identified critical threat characteristics consistent with {threat_name} "
        f"(Risk Score: {risk_score}/100, Threat Level: {risk_level})."
    )
    
    # Specific reasons
    reasons = []
    for ind in indicators[:3]:
        reasons.append(ind.get("title", ""))
        
    if reasons:
        summary_parts.append(f"Primary threat drivers: {', '.join(reasons)}.")
        
    if url_results and len(url_results) > 0:
        first_url = url_results[0]
        if first_url.get("brand_mismatch"):
            summary_parts.append(
                f"The embedded link directs to an unverified domain ({first_url.get('domain')}) "
                f"while attempting to impersonate {first_url.get('brand_match')}."
            )
        elif first_url.get("suspicious_patterns"):
            summary_parts.append(
                f"The destination address exhibits suspicious formatting ({first_url.get('suspicious_patterns')[0]})."
            )

    summary_parts.append("Do not engage with this message or click any attached links.")
    
    return " ".join(summary_parts)
