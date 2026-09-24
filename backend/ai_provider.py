import os
import json
from pydantic import BaseModel
import openai

class AIProvider:
    def triage_complaint(self, text: str) -> dict:
        raise NotImplementedError

class OpenAIProvider(AIProvider):
    def triage_complaint(self, text: str) -> dict:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return DemoAIProvider().triage_complaint(text)
        
        openai.api_key = api_key
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI Triage assistant. Analyze the complaint and return a strict JSON object with exact keys: 'risk_level' (HIGH, MEDIUM, or LOW), 'reason' (short string), 'priority' (string). HIGH risk gets 'HIGH' priority, MEDIUM gets 'MEDIUM', LOW gets 'LOW'."},
                    {"role": "user", "content": text}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception:
            return DemoAIProvider().triage_complaint(text)

class DemoAIProvider(AIProvider):
    def triage_complaint(self, text: str) -> dict:
        text = text.lower()
        if "fire" in text or "wire" in text or "accident" in text or "collapse" in text or "danger" in text or "emergency" in text:
            return {"risk_level": "HIGH", "reason": "Immediate hazard detected.", "priority": "HIGH"}
        elif "pothole" in text or "street" in text or "water" in text or "garbage" in text:
            return {"risk_level": "MEDIUM", "reason": "Moderate infrastructure issue.", "priority": "MEDIUM"}
        else:
            return {"risk_level": "LOW", "reason": "No immediate hazard detected.", "priority": "LOW"}

def get_ai_provider() -> AIProvider:
    return OpenAIProvider()
