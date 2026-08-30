"""
Gemini AI Pro XAI (Explainable AI) Meteorological Diagnostic Generator.
Uses Google AI Studio / Gemini Pro API to generate natural language diagnostic reports
explaining cyclone intensity, track projections, and Rapid Intensification alerts for IMD forecasters.
"""

import os
import json
import requests
from typing import Dict, Any

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")


def generate_cyclone_meteorologist_report(prediction_output: Dict[str, Any]) -> str:
    """
    Generates a natural language meteorological report interpreting the AI model predictions
    using Gemini Pro.
    """
    if not GEMINI_API_KEY:
        return (
            "[GEMINI AI PRO] Set GEMINI_API_KEY or GOOGLE_API_KEY in your .env to enable "
            "automated Gemini Pro meteorological diagnostic reports."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"

    prompt = f"""
    You are a Senior Meteorological Forecaster for the India Meteorological Department (IMD).
    Review the following AI/ML model output for a tropical cyclone in the Bay of Bengal / Arabian Sea:

    Prediction Data:
    {json.dumps(prediction_output, indent=2)}

    Generate a concise, professional 3-bullet point Meteorological Diagnostic Bulletin:
    1. **Intensity & Category Analysis**: State the MSW in knots and IMD category with confidence.
    2. **Eye Localization & Structure**: Discuss vortex eye coordinates and symmetry.
    3. **Track Projection & Rapid Intensification Alert**: Summarize the 72-hour trajectory cone and RI warning.
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return f"[GEMINI AI PRO WARN] API returned status {response.status_code}"
    except Exception as err:
        return f"[GEMINI AI PRO WARN] Failed to contact Gemini API: {err}"
