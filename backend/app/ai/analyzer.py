from typing import Dict, Any, List, Optional
from app.ai.classifier import ml_classifier
from app.ai.features import extract_message_features
from app.ai.explainer import generate_natural_explanation
from app.security.url_analyzer import analyze_url_static, extract_urls_from_text
from app.services.risk_engine import calculate_composite_risk
from app.services.recommendation import generate_recommendations
from app.services.ocr_service import extract_text_from_image_bytes

class AIAnalyzer:
    """
    Unified AI and Cybersecurity Analysis Pipeline.
    Supports hybrid analysis (Rules + Feature Extraction + NLP Classifier + Risk Engine + Explainability + Recommendations).
    """

    @classmethod
    def analyze_text(cls, text: str, source: str = "direct") -> Dict[str, Any]:
        # 1. Feature Extraction & Indicators
        features = extract_message_features(text)
        
        # 2. Extract embedded URLs from text
        extracted_urls = extract_urls_from_text(text)
        url_results = [analyze_url_static(u) for u in extracted_urls]
        
        # Add URL indicators if any
        indicators = list(features.get("indicators", []))
        for u in url_results:
            if u.get("brand_mismatch"):
                indicators.append({
                    "type": "BRAND_IMPERSONATION",
                    "severity": "CRITICAL",
                    "title": f"Spoofed Brand Domain ({u.get('brand_match')})",
                    "description": f"URL hostname '{u.get('domain')}' attempts to imitate {u.get('brand_match')} but is hosted on an unofficial server.",
                    "evidence": u.get("url"),
                    "highlight_text": u.get("url")
                })
            elif u.get("suspicious_patterns"):
                indicators.append({
                    "type": "SUSPICIOUS_DOMAIN",
                    "severity": u.get("risk_level", "HIGH"),
                    "title": "Suspicious Destination URL",
                    "description": u.get("suspicious_patterns")[0],
                    "evidence": u.get("url"),
                    "highlight_text": u.get("url")
                })
        
        # 3. NLP Machine Learning Inference
        ml_prob, ml_label = ml_classifier.predict(text)
        
        # 4. Multi-factor Risk Engine
        risk_score, risk_level, classification, threat_type, confidence, score_breakdown = calculate_composite_risk(
            ml_phishing_prob=ml_prob,
            feature_results=features,
            url_results=url_results
        )
        
        # 5. Explainable Natural Language Summary
        summary = generate_natural_explanation(
            classification=classification,
            threat_type=threat_type,
            risk_score=risk_score,
            risk_level=risk_level,
            indicators=indicators,
            url_results=url_results,
            input_type="text message"
        )
        
        # 6. Actionable DOs and DONTs
        dos_and_donts = generate_recommendations(
            classification=classification,
            threat_type=threat_type,
            has_url=bool(url_results)
        )
        
        return {
            "input_type": "text",
            "classification": classification,
            "threat_type": threat_type,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "summary": summary,
            "original_text": text,
            "indicators": indicators,
            "highlights": features.get("highlights", []),
            "url_details": url_results[0] if url_results else None,
            "all_urls": url_results,
            "dos_and_donts": dos_and_donts,
            "score_breakdown": score_breakdown,
            "technical_details": {
                "source": source,
                "ml_probability": round(ml_prob, 3),
                "all_caps_ratio": features.get("all_caps_ratio", 0),
                "excessive_punctuation": features.get("excessive_punctuation", False),
                "url_count": len(extracted_urls)
            }
        }

    @classmethod
    def analyze_url(cls, raw_url: str) -> Dict[str, Any]:
        # 1. Static URL analysis
        url_details = analyze_url_static(raw_url)
        
        # 2. Extract domain keywords for ML classifier
        synthetic_text = f"Visit our website at {raw_url} to verify your account credentials."
        ml_prob, ml_label = ml_classifier.predict(synthetic_text)
        
        # 3. Form indicators
        indicators = []
        for pattern in url_details.get("suspicious_patterns", []):
            sev = "HIGH" if "Brand" in pattern or "IP" in pattern or "@" in pattern else "MEDIUM"
            indicators.append({
                "type": "SUSPICIOUS_URL_STRUCTURE",
                "severity": sev,
                "title": pattern.split(":")[0],
                "description": pattern,
                "evidence": raw_url,
                "highlight_text": raw_url
            })
            
        features = {
            "urgency_score": 0,
            "credential_score": 15 if "login" in raw_url.lower() or "verify" in raw_url.lower() else 0,
            "financial_score": 0,
            "fear_score": 0,
            "cta_score": 0
        }
        
        # 4. Composite risk calculation
        risk_score, risk_level, classification, threat_type, confidence, score_breakdown = calculate_composite_risk(
            ml_phishing_prob=ml_prob,
            feature_results=features,
            url_results=[url_details]
        )
        
        summary = generate_natural_explanation(
            classification=classification,
            threat_type=threat_type,
            risk_score=risk_score,
            risk_level=risk_level,
            indicators=indicators,
            url_results=[url_details],
            input_type="URL"
        )
        
        dos_and_donts = generate_recommendations(classification, threat_type, has_url=True)
        
        return {
            "input_type": "url",
            "classification": classification,
            "threat_type": threat_type,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "summary": summary,
            "original_text": raw_url,
            "indicators": indicators,
            "highlights": [{"text": raw_url, "reason": "Target URL submitted for static security analysis", "severity": risk_level}],
            "url_details": url_details,
            "all_urls": [url_details],
            "dos_and_donts": dos_and_donts,
            "score_breakdown": score_breakdown,
            "technical_details": {
                "domain": url_details.get("domain"),
                "entropy": url_details.get("entropy"),
                "is_https": url_details.get("is_https"),
                "subdomain_count": url_details.get("subdomain_count"),
                "is_ip": url_details.get("has_ip_address"),
                "is_shortened": url_details.get("is_shortened")
            }
        }

    @classmethod
    def analyze_email(cls, email_data: Dict[str, Any]) -> Dict[str, Any]:
        sender_name = email_data.get("sender_name", "")
        sender_email = email_data.get("sender_email", "")
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        explicit_links = email_data.get("links", [])
        
        full_text = f"Subject: {subject}\n\n{body}"
        
        # 1. Text feature analysis
        features = extract_message_features(full_text)
        
        # 2. URL analysis
        all_extracted_urls = extract_urls_from_text(body) + explicit_links
        unique_urls = list(dict.fromkeys(all_extracted_urls))
        url_results = [analyze_url_static(u) for u in unique_urls]
        
        indicators = list(features.get("indicators", []))
        
        # 3. Email header anomaly detection (sender name vs domain mismatch)
        sender_mismatch = False
        if sender_name and sender_email:
            brand_words = ["apple", "paypal", "amazon", "chase", "netflix", "microsoft", "google", "bank", "support", "security", "dhl", "fedex"]
            name_lower = sender_name.lower()
            email_lower = sender_email.lower()
            for bw in brand_words:
                if bw in name_lower and bw not in email_lower:
                    sender_mismatch = True
                    indicators.insert(0, {
                        "type": "SENDER_MISMATCH",
                        "severity": "CRITICAL",
                        "title": "Sender Name / Email Domain Mismatch",
                        "description": f"The display name '{sender_name}' claims to represent an organization, but the email address '{sender_email}' is from an unrelated or freemail domain.",
                        "evidence": f"From: {sender_name} <{sender_email}>",
                        "highlight_text": sender_email
                    })
                    break
                    
        for u in url_results:
            if u.get("brand_mismatch") or u.get("suspicious_patterns"):
                indicators.append({
                    "type": "MALICIOUS_EMAIL_LINK",
                    "severity": u.get("risk_level", "HIGH"),
                    "title": "Deceptive Email Hyperlink",
                    "description": u.get("suspicious_patterns")[0] if u.get("suspicious_patterns") else "Suspicious destination address",
                    "evidence": u.get("url"),
                    "highlight_text": u.get("url")
                })
                
        # 4. ML Inference
        ml_prob, _ = ml_classifier.predict(full_text)
        
        # 5. Risk calculation
        risk_score, risk_level, classification, threat_type, confidence, score_breakdown = calculate_composite_risk(
            ml_phishing_prob=ml_prob,
            feature_results=features,
            url_results=url_results,
            email_context={"sender_name": sender_name, "sender_email": sender_email, "sender_mismatch": sender_mismatch}
        )
        
        summary = generate_natural_explanation(
            classification=classification,
            threat_type=threat_type,
            risk_score=risk_score,
            risk_level=risk_level,
            indicators=indicators,
            url_results=url_results,
            input_type="email"
        )
        
        dos_and_donts = generate_recommendations(classification, threat_type, has_url=bool(url_results))
        
        return {
            "input_type": "email",
            "classification": classification,
            "threat_type": threat_type,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "summary": summary,
            "original_text": full_text,
            "indicators": indicators,
            "highlights": features.get("highlights", []),
            "url_details": url_results[0] if url_results else None,
            "all_urls": url_results,
            "dos_and_donts": dos_and_donts,
            "score_breakdown": score_breakdown,
            "technical_details": {
                "sender_name": sender_name,
                "sender_email": sender_email,
                "sender_mismatch": sender_mismatch,
                "subject": subject,
                "url_count": len(url_results)
            }
        }

    @classmethod
    def analyze_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        # 1. OCR Text & Entity Extraction
        ocr_data = extract_text_from_image_bytes(image_bytes)
        extracted_text = ocr_data["extracted_text"]
        
        # 2. Run text pipeline on extracted OCR content
        text_analysis = cls.analyze_text(extracted_text, source="screenshot_ocr")
        
        # 3. Add OCR details
        text_analysis["input_type"] = "image"
        text_analysis["ocr_details"] = ocr_data
        return text_analysis
