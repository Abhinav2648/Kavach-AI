import re
from urllib.parse import urlparse
import os
import uuid
import json
from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

# 1. Load Environment Variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# 2. Configure Google Gemini
client = None

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# LOCAL FALLBACK LOGIC KEYWORDS
SCAM_KEYWORDS = [
    "bank", "update", "verify", "account", "suspended", "urgent", "login", 
    "winner", "reward", "lottery", "transaction", "arrest", "kyc", "points",
    "expired", "blocked", "claim", "prize", "otp", "police", "court"
]
HIGH_RISK_PHRASES = [
    "digital arrest",
    "share otp",
    "send otp",
    "verify immediately",
    "account suspended",
    "account blocked",
    "bank account blocked",
    "click immediately",
    "click the link",
    "claim your prize",
    "you have won",
    "transfer money",
    "send money",
    "police case",
    "arrest warrant",
    "court notice",
    "kyc expired",
]

MEDIUM_RISK_PHRASES = [
    "urgent",
    "verify account",
    "update kyc",
    "limited time",
    "reward",
    "winner",
    "claim now",
    "login now",
]
def calculate_local_risk(text):
    """
    KAVACH AI local fraud risk engine.
    Detects scam keywords and high/medium-risk phrases.
    """

    text_lower = text.lower()

    found_keywords = [
        word for word in SCAM_KEYWORDS
        if word in text_lower
    ]

    found_high_risk = [
        phrase for phrase in HIGH_RISK_PHRASES
        if phrase in text_lower
    ]

    found_medium_risk = [
        phrase for phrase in MEDIUM_RISK_PHRASES
        if phrase in text_lower
    ]

    # Risk scoring
    score = 0

    score += len(found_keywords) * 5
    score += len(found_medium_risk) * 10
    score += len(found_high_risk) * 20

    # Keep score between 0 and 100
    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "local_risk_score": score,
        "local_risk_level": risk_level,
        "found_keywords": found_keywords,
        "high_risk_phrases": found_high_risk,
        "medium_risk_phrases": found_medium_risk,
    }
def calculate_url_risk(url):
    """
    KAVACH AI URL risk analysis engine.
    Detects common phishing and suspicious URL patterns.
    """

    score = 0
    reasons = []

    url_lower = url.lower().strip()

    # Add scheme temporarily if user didn't enter one
    url_for_parsing = url_lower
    if not url_for_parsing.startswith(("http://", "https://")):
        url_for_parsing = "http://" + url_for_parsing

    parsed = urlparse(url_for_parsing)
    domain = parsed.hostname or ""

    # 1. HTTP instead of HTTPS
    if url_lower.startswith("http://"):
        score += 10
        reasons.append("URL does not use HTTPS")

    # 2. IP address used instead of domain name
    ip_pattern = r"^\d{1,3}(\.\d{1,3}){3}$"

    if re.match(ip_pattern, domain):
        score += 30
        reasons.append("IP address used instead of a normal domain")

    # 3. @ symbol can hide/obscure destination
    if "@" in url:
        score += 25
        reasons.append("URL contains @ symbol")

    # 4. Suspicious phishing-related words
    suspicious_words = [
        "login",
        "verify",
        "verification",
        "secure",
        "account",
        "update",
        "banking",
        "password",
        "confirm",
        "wallet",
        "kyc",
        "otp",
        "reward",
        "claim",
    ]

    found_words = [
        word for word in suspicious_words
        if word in url_lower
    ]

    score += min(len(found_words) * 5, 25)

    if found_words:
        reasons.append(
            "Suspicious URL keywords: " + ", ".join(found_words)
        )

    # 5. Common URL shortening services
    shorteners = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "is.gd",
        "cutt.ly",
        "shorturl.at",
    ]

    if any(
        domain == shortener or domain.endswith("." + shortener)
        for shortener in shorteners
    ):
        score += 20
        reasons.append("URL shortening service detected")

    # 6. Suspicious / commonly abused TLDs
    suspicious_tlds = [
        ".xyz",
        ".top",
        ".click",
        ".link",
        ".work",
        ".buzz",
    ]

    if any(domain.endswith(tld) for tld in suspicious_tlds):
        score += 15
        reasons.append("Potentially suspicious domain extension")

    # 7. Excessive subdomains
    if domain.count(".") >= 3:
        score += 10
        reasons.append("URL contains excessive subdomains")

    # 8. Very long URL
    if len(url) > 100:
        score += 10
        reasons.append("Unusually long URL")

    # Maximum score = 100
    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "url_risk_score": score,
        "url_risk_level": risk_level,
        "url_risk_reasons": reasons,
        "url_detected_keywords": found_words,
        "domain": domain,
    }
def analyze_with_gemini(input_text):
    """Analyzes text using Gemini API with a strict JSON prompt."""

    if not client:
        return None

    prompt = f"""
    Act as a cybersecurity expert. Analyze the following text for scam or phishing indicators:

    {input_text}

    Return ONLY a raw JSON object with these exact keys:

    {{
        "status": "Safe" or "Suspicious" or "Threat Detected",
        "confidence": "percentage string",
        "verdict": "short summary of analysis",
        "risk_level": "Low" or "Medium" or "High",
        "reason": "detailed explanation of why this is or isn't a scam",
        "detected_keywords": ["keyword1", "keyword2"],
        "safety_recommendation": "advice for the user"
    }}
    """

    try:
        response = client.models.generate_content(
         model="gemini-3.6-flash",
             contents=prompt,
             config={
         "http_options": {
            "timeout": 8000
        }
    }
)

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned_response)

    except Exception as e:
        print(f"Gemini Error: {e}")
        return None

def get_fallback_analysis(text):
    """Local logic if Gemini is unavailable."""
    text_lower = text.lower()
    found_keywords = [word for word in SCAM_KEYWORDS if word in text_lower]
    
    if found_keywords:
        return {
            "status": "Threat Detected",
            "confidence": f"{min(60 + (len(found_keywords) * 10), 95)}%",
            "verdict": "Likely Phishing Attempt",
            "risk_level": "High",
            "reason": f"System identified suspicious keywords: {', '.join(found_keywords)}.",
            "detected_keywords": found_keywords,
            "safety_recommendation": "Do not click any links or share OTPs. Block the sender immediately."
        }
    return {
        "status": "Safe",
        "confidence": "85%",
        "verdict": "No Threats Found",
        "risk_level": "Low",
        "reason": "Local scanning did not find known malicious patterns.",
        "detected_keywords": [],
        "safety_recommendation": "Always stay cautious when receiving messages from unknown numbers."
    }

@app.route("/predict", methods=["POST"])
def predict():
    print(">>> /predict endpoint was called")

    try:
        data = request.json

        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        input_text = data["text"].strip()

        if not input_text:
            return jsonify({"error": "Text cannot be empty"}), 400

        # -----------------------------------
        # Layer 1: KAVACH AI Local Risk Engine
        # -----------------------------------
        local_analysis = calculate_local_risk(input_text)

        # -----------------------------------
        # Layer 2: Gemini Semantic Analysis
        # -----------------------------------
        gemini_result = analyze_with_gemini(input_text)

        # If Gemini is unavailable, use fallback
        if not gemini_result:
            gemini_result = get_fallback_analysis(input_text)

        local_score = local_analysis["local_risk_score"]

        # -----------------------------------
        # Layer 3: Hybrid Risk Fusion
        # -----------------------------------

        # Strong local scam indicators should
        # increase the final threat assessment.
        if local_score >= 60:
            gemini_result["status"] = "Threat Detected"
            gemini_result["risk_level"] = "High"

        elif local_score >= 30 and gemini_result.get("status") == "Safe":
            gemini_result["status"] = "Suspicious"
            gemini_result["risk_level"] = "Medium"

        # -----------------------------------
        # Add KAVACH AI engine information
        # -----------------------------------
        gemini_result["local_risk_score"] = local_score
        gemini_result["local_risk_level"] = local_analysis[
            "local_risk_level"
        ]

        gemini_result["high_risk_phrases"] = local_analysis[
            "high_risk_phrases"
        ]

        gemini_result["medium_risk_phrases"] = local_analysis[
            "medium_risk_phrases"
        ]

        # Combine keywords from Gemini + local engine
        gemini_keywords = gemini_result.get("detected_keywords", [])

        combined_keywords = list(
            dict.fromkeys(
                gemini_keywords + local_analysis["found_keywords"]
            )
        )

        gemini_result["detected_keywords"] = combined_keywords

        gemini_result["analysis_engine"] = (
            "KAVACH Hybrid Risk Engine + Gemini AI"
        )

        return jsonify(gemini_result), 200

    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/predict_url", methods=["POST"])
def predict_url():
    try:
        data = request.get_json() or {}
        url = (data.get("url") or data.get("text") or "").strip()

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        # -----------------------------------
        # Layer 1: KAVACH AI URL Risk Engine
        # -----------------------------------
        local_url_analysis = calculate_url_risk(url)

        local_score = local_url_analysis["url_risk_score"]

        # -----------------------------------
        # Layer 2: Gemini Semantic Analysis
        # -----------------------------------
        prompt = f"""
        Analyze this URL for potential phishing or scam indicators:

        URL: {url}

        IMPORTANT RULES:
        - Analyze only the URL structure and domain name.
        - Do not invent information about the website.
        - Well-known legitimate domains such as google.com,
          youtube.com, microsoft.com, github.com, amazon.com,
          apple.com should normally be considered safe unless
          the URL contains suspicious subdomains or impersonation.
        - Look for suspicious spelling, fake domains, unusual
          subdomains, IP addresses, URL shorteners, or insecure HTTP.
        - If there is not enough evidence of phishing, classify it
          as Safe or Suspicious, not Threat Detected.
        """

        gemini_result = analyze_with_gemini(prompt)

        # -----------------------------------
        # Gemini fallback
        # -----------------------------------
        if not gemini_result:
            gemini_result = {
                "status": (
                    "Threat Detected"
                    if local_score >= 60
                    else "Suspicious"
                    if local_score >= 30
                    else "Safe"
                ),
                "confidence": "75%",
                "verdict": (
                    "High-risk URL indicators detected"
                    if local_score >= 60
                    else "URL requires caution"
                    if local_score >= 30
                    else "No obvious phishing indicators detected"
                ),
                "risk_level": local_url_analysis["url_risk_level"],
                "reason": (
                    "; ".join(local_url_analysis["url_risk_reasons"])
                    if local_url_analysis["url_risk_reasons"]
                    else "No obvious suspicious URL patterns found"
                ),
                "detected_keywords": local_url_analysis[
                    "url_detected_keywords"
                ],
                "safety_recommendation":
                    "Verify the domain before entering passwords, "
                    "OTPs, or banking information."
            }

        # -----------------------------------
        # Layer 3: Hybrid Risk Fusion
        # -----------------------------------
        if local_score >= 60:
            gemini_result["status"] = "Threat Detected"
            gemini_result["risk_level"] = "High"

        elif local_score >= 30:
            if gemini_result.get("status") == "Safe":
                gemini_result["status"] = "Suspicious"

            if gemini_result.get("risk_level") == "Low":
                gemini_result["risk_level"] = "Medium"

        # -----------------------------------
        # Add KAVACH URL Engine information
        # -----------------------------------
        gemini_result["url_risk_score"] = local_score

        gemini_result["url_risk_level"] = local_url_analysis[
            "url_risk_level"
        ]

        gemini_result["url_risk_reasons"] = local_url_analysis[
            "url_risk_reasons"
        ]

        gemini_result["domain"] = local_url_analysis["domain"]

        # -----------------------------------
        # Combine detected keywords
        # -----------------------------------
        gemini_keywords = gemini_result.get(
            "detected_keywords", []
        )

        combined_keywords = list(
            dict.fromkeys(
                gemini_keywords
                + local_url_analysis["url_detected_keywords"]
            )
        )

        gemini_result["detected_keywords"] = combined_keywords

        # Identify our hybrid architecture
        gemini_result["analysis_engine"] = (
            "KAVACH URL Risk Engine + Gemini AI"
        )

        return jsonify(gemini_result), 200

    except Exception as e:
        print("URL Prediction Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/predict_image", methods=["POST"])
def predict_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        if not client:
            return jsonify({"error": "Gemini API is not configured"}), 500

        file = request.files["file"]

        # Read image directly into memory
        image_bytes = file.read()

        if not image_bytes:
            return jsonify({"error": "Empty image uploaded"}), 400

        # Validate and compress image to reduce memory/network usage
        image = Image.open(BytesIO(image_bytes))
        image = image.convert("RGB")

        image.thumbnail((1000, 1000))

        output = BytesIO()
        image.save(output, format="JPEG", quality=75, optimize=True)
        compressed_bytes = output.getvalue()

        # Send screenshot directly to Gemini
        prompt = """
        Read all visible text from this screenshot.

        Then analyze it for scams, phishing, digital arrest fraud,
        fake bank/KYC warnings, OTP scams, suspicious links,
        payment fraud, threats, prizes, and impersonation.

        Return ONLY valid JSON in this exact format:

        {
          "extracted_text": "all readable text from image",
          "status": "Safe or Suspicious or Threat Detected",
          "confidence": 0,
          "verdict": "short explanation",
          "risk_level": "Low or Medium or High",
          "detected_keywords": [],
          "safety_recommendation": "short safety recommendation"
        }

        confidence must be a number from 0 to 100.
        """

        response = client.models.generate_content(
           model="gemini-3.6-flash",
            contents=[
                prompt,
                genai.types.Part.from_bytes(
                    data=compressed_bytes,
                    mime_type="image/jpeg"
                )
            ]
        )

        raw_text = response.text.strip()

        # Remove markdown fences if Gemini returns ```json
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        result = json.loads(raw_text)

        extracted_text = result.get("extracted_text", "")

        # Run existing KAVACH local risk engine
        local_analysis = calculate_local_risk(extracted_text)
        local_score = local_analysis["local_risk_score"]

        # Hybrid protection
        if local_score >= 60:
            result["status"] = "Threat Detected"
            result["risk_level"] = "High"

        elif local_score >= 30:
            if result.get("status") == "Safe":
                result["status"] = "Suspicious"

            if result.get("risk_level") == "Low":
                result["risk_level"] = "Medium"

        # Combine Gemini + local keywords
        gemini_keywords = result.get("detected_keywords", [])

        result["detected_keywords"] = list(
            dict.fromkeys(
                gemini_keywords + local_analysis["found_keywords"]
            )
        )

        result["local_risk_score"] = local_score
        result["local_risk_level"] = local_analysis["local_risk_level"]
        result["high_risk_phrases"] = local_analysis["high_risk_phrases"]
        result["medium_risk_phrases"] = local_analysis["medium_risk_phrases"]

        result["analysis_engine"] = (
            "KAVACH Hybrid Risk Engine + Gemini Vision AI"
        )

        return jsonify(result), 200

    except Exception as e:     
        print(f"Gemini Vision unavailable: {e}", flush=True)

        return jsonify({
            "extracted_text": "",
            "status": "Suspicious",
            "confidence": 50,
            "verdict": "AI vision service is temporarily busy. Please retry the screenshot scan.",
            "risk_level": "Medium",
            "detected_keywords": [],
            "safety_recommendation": "Do not click suspicious links or share OTPs, passwords, or banking information.",
            "analysis_engine": "KAVACH Safe Fallback"
             }), 200
    
@app.route("/healthz", methods=["GET"])
def healthz():
    return {"status": "ok"}, 200
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)