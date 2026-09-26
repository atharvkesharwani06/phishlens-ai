import math
import re
from urllib.parse import urlparse
from typing import Dict, Any, List, Optional

# Top impersonated brands in cyber attacks
TARGET_BRANDS = {
    "paypal": ["paypal", "pay-pal", "paypa1", "paypai"],
    "chase": ["chase", "chasebank", "chase-secure", "chase-online"],
    "bank of america": ["bankofamerica", "bofa", "bank-of-america"],
    "wells fargo": ["wellsfargo", "wells-fargo"],
    "citi": ["citibank", "citi-bank"],
    "netflix": ["netflix", "net-flix", "netflx", "netflix-verify"],
    "amazon": ["amazon", "amazn", "amzn-security", "amazon-update"],
    "apple": ["apple", "icloud", "appleid", "apple-support"],
    "microsoft": ["microsoft", "office365", "outlook", "onedrive", "azure", "ms-login"],
    "google": ["google", "gmail", "google-drive", "accounts-google"],
    "facebook": ["facebook", "meta", "fb-security", "instagram"],
    "whatsapp": ["whatsapp", "whats-app"],
    "dhl": ["dhl", "dhl-express", "dhl-tracking"],
    "fedex": ["fedex", "fed-ex", "fedex-delivery"],
    "ups": ["ups", "ups-tracking"],
    "usps": ["usps", "us-postal"],
    "irs": ["irs", "irs-gov", "tax-refund"],
    "coinbase": ["coinbase", "coin-base"],
    "binance": ["binance", "binance-verify"],
    "sbi": ["statebankofindia", "onlinesbi", "sbi-netbanking"],
    "hdfc": ["hdfcbank", "hdfc-netbanking"],
    "icici": ["icicibank", "icici-security"]
}

# Suspicious high-abuse Top-Level Domains
SUSPICIOUS_TLDS = {
    "top", "xyz", "club", "buzz", "work", "icu", "click", "rest", "fit", "surf",
    "gq", "cf", "tk", "ml", "ga", "cc", "loan", "men", "bar", "racing", "cam",
    "monster", "agency", "country", "stream", "download", "kim", "party", "trade"
}

# Known URL shorteners
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "ow.ly",
    "buff.ly", "rebrand.ly", "tiny.cc", "rb.gy", "shorturl.at"
}

def calculate_entropy(text: str) -> float:
    """Calculate Shannon Entropy of a string to detect randomized/DGA domains."""
    if not text:
        return 0.0
    entropy = 0.0
    length = len(text)
    char_counts = {}
    for char in text:
        char_counts[char] = char_counts.get(char, 0) + 1
    for count in char_counts.values():
        p_x = count / length
        entropy -= p_x * math.log2(p_x)
    return round(entropy, 3)

def is_ip_address(host: str) -> bool:
    """Check if the hostname is an IP address."""
    # IPv4 regex
    ipv4_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    if re.match(ipv4_pattern, host):
        parts = host.split('.')
        return all(0 <= int(part) <= 255 for part in parts)
    return False

def analyze_url_static(raw_url: str) -> Dict[str, Any]:
    """
    Perform purely static security analysis of a URL.
    CRITICAL: Never connects, visits, resolves or navigates to the target URL.
    """
    sanitized_url = raw_url.strip()
    if not sanitized_url.startswith(("http://", "https://")):
        sanitized_url = "http://" + sanitized_url
    
    parsed = urlparse(sanitized_url)
    hostname = (parsed.hostname or "").lower()
    path = parsed.path or ""
    query = parsed.query or ""
    scheme = parsed.scheme.lower()
    
    is_https = scheme == "https"
    url_length = len(raw_url)
    domain_length = len(hostname)
    
    # Split domain parts
    domain_parts = hostname.split(".")
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    
    # Check for IP address host
    has_ip = is_ip_address(hostname)
    
    # Subdomain count
    # E.g. secure.login.chase.com.evil.co.uk
    subdomain_count = max(0, len(domain_parts) - 2)
    
    # Shannon Entropy of domain
    entropy = calculate_entropy(hostname)
    
    # Suspicious patterns detection
    suspicious_patterns: List[str] = []
    risk_score_addition = 0
    
    if not is_https:
        suspicious_patterns.append("Insecure HTTP protocol (no SSL/TLS encryption)")
        risk_score_addition += 15
    
    if has_ip:
        suspicious_patterns.append("Direct IP address used instead of reputable domain name")
        risk_score_addition += 30
        
    if tld in SUSPICIOUS_TLDS:
        suspicious_patterns.append(f"High-risk Top-Level Domain (.{tld}) commonly abused in phishing campaigns")
        risk_score_addition += 20
        
    if hostname in SHORTENERS:
        suspicious_patterns.append("URL shortener used to conceal the ultimate destination")
        risk_score_addition += 20
        
    if "@" in raw_url:
        suspicious_patterns.append("Contains '@' symbol: Deceptive HTTP Basic Auth URL formatting")
        risk_score_addition += 35
        
    if hostname.count("-") >= 3:
        suspicious_patterns.append(f"Excessive hyphens in hostname ({hostname.count('-')}) mimicking brands")
        risk_score_addition += 15
        
    if entropy > 3.8 and len(hostname) > 12:
        suspicious_patterns.append(f"High domain randomness/entropy ({entropy}), typical of automated DGA generation")
        risk_score_addition += 20
        
    if subdomain_count >= 3:
        suspicious_patterns.append(f"Deep subdomain nesting ({subdomain_count} subdomains) hiding actual domain")
        risk_score_addition += 25
        
    if url_length > 100:
        suspicious_patterns.append(f"Unusually long URL structure ({url_length} characters)")
        risk_score_addition += 10
        
    # Suspicious keywords in path/query
    suspicious_keywords = ["login", "verify", "secure", "update", "account", "suspended", "banking", "wallet", "recover", "auth", "signin", "password", "billing"]
    found_path_keywords = [kw for kw in suspicious_keywords if kw in path.lower() or kw in query.lower()]
    if found_path_keywords:
        suspicious_patterns.append(f"Phishing trap keywords in URL path: {', '.join(found_path_keywords[:3])}")
        risk_score_addition += 15

    # Brand impersonation detection in domain/subdomains
    detected_brand: Optional[str] = None
    brand_mismatch = False
    
    for brand_name, variations in TARGET_BRANDS.items():
        for var in variations:
            if var in hostname:
                detected_brand = brand_name.title()
                # Check if this is the legitimate apex domain or spoofed
                # E.g. paypal.com vs paypal-security-update.com
                legitimate_apex = f"{var}.com"
                if not (hostname == legitimate_apex or hostname.endswith(f".{legitimate_apex}")):
                    brand_mismatch = True
                    suspicious_patterns.append(
                        f"Brand Impersonation: Claims to be '{detected_brand}' but hosted on unrelated domain '{hostname}'"
                    )
                    risk_score_addition += 35
                break
        if detected_brand:
            break

    # Calculate risk level
    if risk_score_addition >= 50 or brand_mismatch or has_ip:
        risk_level = "CRITICAL" if risk_score_addition >= 65 else "HIGH"
    elif risk_score_addition >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    return {
        "url": raw_url,
        "domain": hostname,
        "tld": tld,
        "is_https": is_https,
        "subdomain_count": subdomain_count,
        "url_length": url_length,
        "entropy": entropy,
        "has_ip_address": has_ip,
        "is_shortened": hostname in SHORTENERS,
        "suspicious_patterns": suspicious_patterns,
        "brand_match": detected_brand,
        "brand_mismatch": brand_mismatch,
        "risk_level": risk_level,
        "risk_score_addition": min(100, risk_score_addition)
    }

def extract_urls_from_text(text: str) -> List[str]:
    """Extract all HTTP/HTTPS and www URLs from arbitrary message text."""
    url_pattern = r'(https?://[^\s<>"\')]+|www\.[^\s<>"\')]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s<>"\')]*)?)'
    matches = re.findall(url_pattern, text)
    valid_urls = []
    for match in matches:
        # filter out false positives like regular sentences ending with periods
        m = match.strip(".,;:()[]{}<>\"'")
        if "." in m and not m.endswith("."):
            if m.startswith("http://") or m.startswith("https://"):
                valid_urls.append(m)
            elif m.startswith("www."):
                valid_urls.append("https://" + m)
            elif any(m.lower().endswith("." + tld) or ("." + tld + "/") in m.lower() for tld in ["com", "org", "net", "io", "xyz", "co", "in", "us", "uk", "top", "app", "cc"]):
                valid_urls.append("https://" + m)
    return list(dict.fromkeys(valid_urls)) # deduplicate
