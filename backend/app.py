import os
import uuid
import json
from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

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
            model="gemini-3-flash-preview",
            contents=prompt
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
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        # 1. Try Gemini Analysis
        result = analyze_with_gemini(data['text'])
        
        # 2. If Gemini fails/timeout, use Fallback
        if not result:
            result = get_fallback_analysis(data['text'])
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict_url", methods=["POST"])
def predict_url():
    try:
        data = request.get_json() or {}
        url = (data.get("url") or data.get("text") or "").strip()

        if not url:
            return jsonify({"error": "No URL provided"}), 400

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

        result = analyze_with_gemini(prompt)

        if not result:
            # Local fallback
            suspicious_patterns = [
                ".xyz",
                ".click",
                ".bit.ly",
                "@",
            ]

            is_insecure = url.lower().startswith("http://")
            has_suspicious_pattern = any(
                pattern in url.lower()
                for pattern in suspicious_patterns
            )

            is_suspicious = is_insecure or has_suspicious_pattern

            result = {
                "status": "Suspicious" if is_suspicious else "Safe",
                "confidence": "75%",
                "verdict": "URL requires caution" if is_suspicious
                           else "No obvious phishing indicators detected",
                "risk_level": "Medium" if is_suspicious else "Low",
                "reason": "Suspicious URL pattern detected"
                          if is_suspicious
                          else "No obvious suspicious URL patterns found",
                "detected_keywords": [],
                "safety_recommendation":
                    "Verify the domain before entering passwords, OTPs, or banking information."
            }

        return jsonify(result), 200

    except Exception as e:
        print("URL Prediction Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/predict_image", methods=["POST"])
def predict_image():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        filename = f"{uuid.uuid4()}.png"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # OCR Processing
        extracted_text = pytesseract.image_to_string(Image.open(filepath))
        os.remove(filepath)

        # Analysis of OCR text
        result = analyze_with_gemini(extracted_text)
        if not result:
            result = get_fallback_analysis(extracted_text)

        result["extracted_text"] = extracted_text    
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)