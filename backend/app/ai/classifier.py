import math
import re
from typing import Dict, Any, Tuple, List

# Curated training dataset of genuine vs phishing/scam samples
TRAINING_DATA = [
    # Safe / Legitimate Messages (Label 0)
    ("Your verification code is 482910. It expires in 10 minutes. Do not share this code with anyone.", 0),
    ("Hi John, your doctor appointment is confirmed for tomorrow at 3:00 PM at Downtown Clinic.", 0),
    ("Your order #84920 has been dispatched. Track your delivery inside your official Amazon app.", 0),
    ("Your monthly bank statement for July 2026 is now available. Log in to your banking portal to view.", 0),
    ("Reminder: Team standup meeting in 15 minutes on Google Meet. See you there.", 0),
    ("Hi Mom, I will be home by 7 PM for dinner tonight.", 0),
    ("Your Netflix subscription will renew automatically next week. Manage your plan in settings.", 0),
    ("Thanks for dining with us! Here is your receipt for table 4. Total: $42.50.", 0),
    ("Your package was left at the front porch. Have a great day!", 0),
    ("Two-factor authentication code: 938472. If you did not request this, please change your password on the official website.", 0),
    ("Meeting notes from today's sprint planning have been shared to the team drive.", 0),
    ("Your ride with Uber has completed. Total charged: $14.20. Rate your driver in app.", 0),
    ("Security alert: New login detected from Windows in New York. If this was you, no action is needed.", 0),
    ("Electricity bill for account #93829 is generated. Amount due: $85.00 due on 15th.", 0),
    ("Hey, are we still meeting for lunch today around noon?", 0),
    ("Your flight ticket for booking #BA-9482 is confirmed. Check in opens 24 hours before departure.", 0),
    
    # Phishing / Malicious / Scam Messages (Label 1)
    ("URGENT: Your Chase bank account has been suspended due to suspicious activity. Verify immediately: http://chase-verify-login.xyz/auth", 1),
    ("FINAL NOTICE: Your bank account will be blocked within 24 hours. Update your password now to avoid penalty: http://bank-update.top/security", 1),
    ("Congratulations! You have won $50,000 in the Google Annual Lottery. Click here to claim your cash reward: http://claim-prize-now.buzz/winner", 1),
    ("USPS: Your parcel delivery failed because of incorrect address. Pay $2.99 rescheduling fee at http://usps-redelivery-package.xyz/pay", 1),
    ("IRS Warning: You have an outstanding tax debt of $4,850. An arrest warrant will be issued if not paid today: http://irs-tax-settlement.cc/pay", 1),
    ("Dear customer, your PayPal account is restricted. Confirm your identity and card details to restore access: http://paypal-resolution-center.icu/login", 1),
    ("Apple Support: Your iCloud has been locked due to unauthorized attempts. Unlock your Apple ID: http://apple-id-recover-support.top/unlock", 1),
    ("Netflix: Your monthly payment failed. Update your credit card details immediately to keep streaming: http://netflix-billing-update.xyz/login", 1),
    ("Dear SBI user, your KYC documents are expired. Your account will be closed today. Update KYC at http://sbi-kyc-verification.top/update", 1),
    ("WhatsApp security alert: Someone is trying to register your phone number. Send us your 6 digit OTP immediately to cancel.", 1),
    ("DHL Express: Your shipment is on hold due to unpaid customs fee of ₹450. Clear customs now: http://dhl-tracking-customs.xyz/track", 1),
    ("URGENT: Unauthorized login to your Wells Fargo account from Moscow. Call fraud support immediately at +1-800-FAKE-NUM or click link.", 1),
    ("Earn ₹10,000 daily working from home just 1 hour! No skills needed. Register your bank account to receive immediate payout.", 1),
    ("Action Required: Microsoft 365 password expires today. Keep same password by verifying at: http://office365-password-sync.buzz/login", 1),
    ("Amazon Security: Unusual login from new device. Verify your identity now or account will be deactivated.", 1),
    ("Bank alert: A wire transfer of $2,400 is pending. If you did not authorize this, cancel immediately at http://bank-cancel-auth.cc/wire", 1)
]

def tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase alpha words and 2-grams."""
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    words = [w for w in cleaned.split() if len(w) > 1]
    ngrams = list(words)
    # add bigrams
    for i in range(len(words) - 1):
        ngrams.append(f"{words[i]}_{words[i+1]}")
    return ngrams

class PureTFIDFNaiveBayesClassifier:
    """
    Self-contained, production-grade NLP classifier combining TF-IDF weighting
    with Multinomial Naive Bayes and Laplace smoothing.
    100% native Python without OS DLL dependency issues.
    """
    def __init__(self):
        self.doc_count = 0
        self.doc_freq: Dict[str, int] = {}
        self.class_doc_counts = {0: 0, 1: 0}
        self.class_word_counts: Dict[int, Dict[str, float]] = {0: {}, 1: {}}
        self.class_total_weights = {0: 0.0, 1: 0.0}
        self.vocab = set()
        self._train()

    def _train(self):
        self.doc_count = len(TRAINING_DATA)
        # Step 1: Calculate document frequencies for IDF
        for text, label in TRAINING_DATA:
            self.class_doc_counts[label] += 1
            tokens = set(tokenize(text))
            for tok in tokens:
                self.doc_freq[tok] = self.doc_freq.get(tok, 0) + 1
                self.vocab.add(tok)

        # Step 2: Compute TF-IDF weighted class distributions
        for text, label in TRAINING_DATA:
            tokens = tokenize(text)
            tf_dict: Dict[str, int] = {}
            for tok in tokens:
                tf_dict[tok] = tf_dict.get(tok, 0) + 1

            for tok, tf in tf_dict.items():
                idf = math.log((self.doc_count + 1) / (self.doc_freq.get(tok, 0) + 1)) + 1.0
                weight = (1 + math.log(tf)) * idf
                self.class_word_counts[label][tok] = self.class_word_counts[label].get(tok, 0.0) + weight
                self.class_total_weights[label] += weight

    def predict(self, text: str) -> Tuple[float, str]:
        """
        Calculates posterior phishing probability P(Phishing | Text) via Bayes rule.
        Returns: (phishing_probability: float [0.0 - 1.0], label: 'PHISHING' | 'SAFE')
        """
        if not text or not text.strip():
            return 0.05, "SAFE"

        tokens = tokenize(text)
        if not tokens:
            return 0.05, "SAFE"

        vocab_size = max(1, len(self.vocab))
        log_prob = {0: math.log(self.class_doc_counts[0] / self.doc_count),
                    1: math.log(self.class_doc_counts[1] / self.doc_count)}

        for label in [0, 1]:
            total_weight = self.class_total_weights[label] + vocab_size
            for tok in tokens:
                count = self.class_word_counts[label].get(tok, 0.0)
                # Laplace-smoothed probability
                p_word = (count + 1.0) / total_weight
                log_prob[label] += math.log(p_word)

        # Softmax / Sigmoid normalization to probability
        # log_prob[1] - log_prob[0] = log(odds)
        log_odds = max(-20.0, min(20.0, log_prob[1] - log_prob[0]))
        phishing_prob = 1.0 / (1.0 + math.exp(-log_odds))
        
        # Calibration bounds
        phishing_prob = round(float(phishing_prob), 3)
        label = "PHISHING" if phishing_prob >= 0.50 else "SAFE"
        return phishing_prob, label

# Global ML Classifier instance
ml_classifier = PureTFIDFNaiveBayesClassifier()
