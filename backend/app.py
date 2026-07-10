from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Kavach AI Backend Running"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    text = data.get("text", "").lower()

    scam_words = [
        "otp",
        "bank",
        "verify",
        "click",
        "link",
        "winner",
        "lottery",
        "prize",
        "account",
        "urgent",
        "update",
        "credit card",
        "gift",
        "upi",
        "refund"
    ]

    score = sum(word in text for word in scam_words)

    if score >= 3:
        return jsonify({
            "status": "Threat Detected",
            "confidence": "97%",
            "verdict": "⚠️ High Risk Scam",
            "reason": "Multiple phishing keywords detected."
        })

    elif score >= 1:
        return jsonify({
            "status": "Suspicious",
            "confidence": "72%",
            "verdict": "⚠️ Medium Risk",
            "reason": "Some suspicious keywords detected."
        })

    else:
        return jsonify({
            "status": "Safe",
            "confidence": "96%",
            "verdict": "✅ Safe",
            "reason": "No phishing indicators detected."
        })


if __name__ == "__main__":
    app.run(debug=True)