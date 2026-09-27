# PhishLens AI

> **"Understand the threat before you click."**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind_CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Status-Hackathon_MVP-success.svg)](#)

---

## 🛡️ 1. Project Overview

**PhishLens AI** is an explainable, multi-modal cybersecurity threat assessment platform built to protect ordinary, non-technical users from modern phishing, scam, smishing, and impersonation attacks.

Traditional security tools often output a binary verdict: *"Phishing Detected"*. This leaves users confused, anxious, and vulnerable to future attacks. 

**PhishLens AI changes the paradigm:**
```
INPUT (Message / URL / Email / Screenshot)
   ↓
AI & SECURITY ANALYSIS
   ↓
THREAT DETECTION & CLASSIFICATION
   ↓
TRANSPARENT RISK SCORE (0 - 100)
   ↓
EXPLAINABLE EVIDENCE (Interactive Highlighting)
   ↓
ACTIONABLE DEFENSE PROTOCOL (DOs and DO NOTs)
```

For every detection, PhishLens answers:
1. **What is suspicious?** (Specific attack type and deceptive indicators)
2. **Why is it suspicious?** (Clear non-technical psychological & technical explanations)
3. **Which parts of the input caused the warning?** (Interactive phrase highlighting on original message)
4. **How serious is the risk?** (Multi-factor risk score 0–100, calibrated into LOW, MEDIUM, HIGH, CRITICAL)
5. **What should the user do?** (Clear, bulleted action steps: ✅ DO)
6. **What should the user avoid doing?** (Strict warnings: ❌ DO NOT)

---

## 🎯 2. Hackathon Track Alignment

PhishLens places AI in the **critical path**:
- Without the hybrid AI classifier, linguistic feature extractor, and static URL analyzer, threat explainability fails.
- Visual highlighting and plain-English summaries make cybersecurity intuitive for anyone without technical training.
- Includes an interactive **Spot-The-Phish Quiz & Defense Academy** for active user education.

---

## 🚀 3. Multi-Modal Input Types

| Input Mode | Description | Forensic Checks Performed |
| :--- | :--- | :--- |
| **💬 Message / Text** | SMS, WhatsApp, Telegram, or Social DMs | Urgency pressure, credential requests, financial lures, fear intimidation, casing anomalies. |
| **🌐 URL / Link** | Suspicious links & web domains | **100% Static Inspection**: Protocol (HTTPS), domain entropy, subdomain nesting, high-abuse TLDs (`.xyz`, `.buzz`), brand typosquatting. *Targets are NEVER opened or fetched.* |
| **📧 Email** | Full email headers & body | Sender display name vs email domain mismatch, reply-to anomalies, spoofed brands, embedded trap links. |
| **📸 Screenshot** | Upload PNG, JPG, JPEG, WEBP (&le;10MB) | In-memory OCR text extraction, entity isolation (URLs, brands, phones, emails), automated pipeline analysis. |

---

## 🧠 4. AI & Hybrid Threat Detection Engine

PhishLens uses a deterministic **Hybrid Architecture**:
```
                           +----------------------+
                           |      User Input      |
                           +----------+-----------+
                                      |
                                      v
                           +----------------------+
                           |    Sanitization      |
                           +----------+-----------+
                                      |
                 +--------------------+--------------------+
                 |                    |                    |
                 v                    v                    v
      +--------------------+ +------------------+ +-----------------+
      |   Linguistic NLP   | | Static URL Engine| | OCR Extraction  |
      | Feature Extractor  | |  Entropy & TLD   | | Text & Entities |
      +----------+---------+ +--------+---------+ +--------+--------+
                 |                    |                    |
                 +--------------------+--------------------+
                                      |
                                      v
                           +----------------------+
                           |    TF-IDF Bayesian   |
                           |    ML Classifier     |
                           +----------+-----------+
                                      |
                                      v
                           +----------------------+
                           | Multi-Factor Risk    |
                           | Engine (0-100 Score) |
                           +----------+-----------+
                                      |
                                      v
                           +----------------------+
                           |  Explainability &    |
                           |  Recommendation Core |
                           +----------+-----------+
                                      |
                                      v
                           +----------------------+
                           | Interactive UI Report|
                           +----------------------+
```

### Risk Scoring Formula:
$$\text{RiskScore} = 0.50 \times \text{AI ML Score} + 0.30 \times \text{Security Rule Score} + 0.20 \times \text{Static URL Score}$$

- **0 – 29: LOW RISK (SAFE)**
- **30 – 59: MEDIUM RISK (SUSPICIOUS)**
- **60 – 79: HIGH RISK (PHISHING)**
- **80 – 100: CRITICAL RISK (PHISHING / HARVESTING)**

---

## 💻 5. Technology Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy, SQLite, Pydantic, Pillow, pure-Python TF-IDF Bayesian Classifier.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios, React Router.
- **Security:** Static URL parser with Shannon entropy, in-memory OCR sanitizer, CORS protection.

---

## 🛠️ 6. Installation & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be live at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Console will be live at `http://localhost:5173`.

---

## ⚡ 7. Quick Demo Walkthrough (2-Minute Judge Demo)

1. **Open Landing Page** (`/`): Inspect the clean cybersecurity SaaS interface.
2. **Click "Demo Center"** (`/demo`):
   - Click **"Urgent Bank Account Suspension"** &rarr; Observe real-time step-by-step scan animation.
   - Inspect the **Threat Report**: Risk Score 93/100, Phishing Detected, Credential Harvesting.
   - **Click the highlighted phrases** (`BLOCKED TODAY`, `PASSWORD`, `xyz link`) to see interactive forensic reasoning popups.
   - Review the **Actionable Recommendations** (❌ DO NOT click, ✅ Contact verified bank).
3. **Test Benign Legitimate OTP** (`/demo`): Run "Legitimate Bank 2FA Code" &rarr; Observe Risk Score 0/100 (SAFE).
4. **Upload a Screenshot** (`/analyze?tab=screenshot`): Drag & drop an SMS screenshot &rarr; OCR extracts text & entities &rarr; Full threat report generated.
5. **Interactive Quiz** (`/learn`): Test cybersecurity reflexes on 5 realistic attack scenarios.

---

## 🔒 8. Security & Safety Disclosures

- **Zero Automatic Detonation:** PhishLens never opens, resolves, navigates to, or executes scripts from submitted URLs.
- **Untrusted File Sandboxing:** Uploaded image files are strictly parsed in-memory for pixel extraction.
- **Probabilistic Advisory:** PhishLens provides educational risk assessments and should complement standard organizational security practices.
