export type ThreatClassification = 'SAFE' | 'SUSPICIOUS' | 'PHISHING';
export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ThreatType = 
  | 'CREDENTIAL_HARVESTING'
  | 'IMPERSONATION'
  | 'MALICIOUS_LINK'
  | 'FINANCIAL_FRAUD'
  | 'SOCIAL_ENGINEERING'
  | 'LEGITIMATE'
  | 'SUSPICIOUS_COMMUNICATION';

export interface Indicator {
  id?: string;
  type: string;
  severity: ThreatSeverity;
  title: string;
  description: string;
  evidence?: string;
  highlight_text?: string;
}

export interface HighlightSpan {
  text: string;
  reason: string;
  severity: ThreatSeverity;
  category?: string;
  start?: number;
  end?: number;
}

export interface UrlDetails {
  url: string;
  domain?: string;
  tld?: string;
  is_https: boolean;
  subdomain_count: number;
  url_length: number;
  entropy: number;
  has_ip_address: boolean;
  is_shortened: boolean;
  suspicious_patterns: string[];
  brand_match?: string;
  brand_mismatch: boolean;
  risk_level: ThreatSeverity;
}

export interface OcrDetails {
  extracted_text: string;
  detected_urls: string[];
  detected_brands: string[];
  detected_phones: string[];
  detected_emails: string[];
  ocr_engine?: string;
}

export interface DosAndDonts {
  dos: string[];
  donts: string[];
}

export interface ScoreBreakdown {
  ai_score: number;
  rule_score: number;
  url_score: number;
  risk_factors: string[];
}

export interface AnalysisResult {
  id: string;
  input_type: 'text' | 'url' | 'email' | 'image';
  classification: ThreatClassification;
  threat_type: ThreatType;
  risk_score: number;
  risk_level: ThreatSeverity;
  confidence: number;
  summary: string;
  input_preview?: string;
  original_text?: string;
  indicators: Indicator[];
  highlights?: HighlightSpan[];
  url_details?: UrlDetails;
  ocr_details?: OcrDetails;
  dos_and_donts: DosAndDonts;
  score_breakdown: ScoreBreakdown;
  technical_details?: Record<string, any>;
  created_at: string;
}

export interface AnalysisHistoryItem {
  id: string;
  input_type: 'text' | 'url' | 'email' | 'image';
  classification: ThreatClassification;
  threat_type: ThreatType;
  risk_score: number;
  risk_level: ThreatSeverity;
  confidence: number;
  summary: string;
  input_preview?: string;
  created_at: string;
}

export interface DashboardStats {
  total_analyses: number;
  phishing_count: number;
  suspicious_count: number;
  safe_count: number;
  avg_risk_score: number;
  threat_distribution: Record<string, number>;
  risk_distribution: Record<string, number>;
  type_distribution: Record<string, number>;
  recent_analyses: AnalysisHistoryItem[];
  high_risk_alerts: AnalysisHistoryItem[];
}

export interface DemoCase {
  id: string;
  title: string;
  category: string;
  input_type: 'text' | 'url' | 'email' | 'image';
  description: string;
  content: {
    text?: string;
    source?: string;
    url?: string;
    sender_name?: string;
    sender_email?: string;
    subject?: string;
    body?: string;
    links?: string[];
  };
  expected_classification: ThreatClassification;
  expected_threat_type: ThreatType;
  expected_risk_score: number;
}

export interface EducationModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  what_it_looks_like: string;
  why_attackers_use_it: string;
  how_to_protect: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  scenario: string;
  sender?: string | null;
  url?: string | null;
  question: string;
  is_phishing: boolean;
  explanation: string;
  indicators: string[];
  category: string;
}
