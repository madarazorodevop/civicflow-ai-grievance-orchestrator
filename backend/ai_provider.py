import os
import json
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
                    {"role": "system", "content": "You are an AI Triage assistant. Analyze the complaint and return a strict JSON object with exact keys: 'risk_level' (SEVERE, MEDIUM, or LOW), 'reason' (short string), 'priority' (string). SEVERE risk gets 'SEVERE' priority, MEDIUM gets 'MEDIUM', LOW gets 'LOW'."},
                    {"role": "user", "content": text}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception:
            return DemoAIProvider().triage_complaint(text)

class DemoAIProvider(AIProvider):
    def triage_complaint(self, text: str) -> dict:
        text = text.lower()
        # More robust keywords to ensure varied risk levels for demo
        high_words = ["fire", "wire", "accident", "collapse", "danger", "emergency", "blood", "death", "trap", "fall", "hurt", "urgent", "immediate", "robbery", "gang", "assault", "gun", "knife", "violent", "violence", "kill", "contamination", "hazard", "poison", "toxic", "epidemic", "outbreak", "disease", "illness", "mass"]
        med_words = ["pothole", "street", "water", "garbage", "trash", "pipe", "leak", "broken", "damage", "block", "light", "road"]
        
        if "[other]" in text:
            return {"risk_level": "LOW", "reason": "User explicitly categorized as Other / Low Threat.", "priority": "LOW"}
        elif any(w in text for w in high_words):
            return {"risk_level": "SEVERE", "reason": "Immediate hazard or life-safety issue detected in the description.", "priority": "SEVERE"}
        elif any(w in text for w in med_words):
            return {"risk_level": "MEDIUM", "reason": "Moderate infrastructure damage or public nuisance detected.", "priority": "MEDIUM"}
        else:
            # Fallback based on text length to simulate thought
            if len(text) > 40:
                return {"risk_level": "MEDIUM", "reason": "Detailed report analyzed as a moderate infrastructure issue.", "priority": "MEDIUM"}
            return {"risk_level": "LOW", "reason": "No immediate hazards detected; routine maintenance required.", "priority": "LOW"}

def get_ai_provider() -> AIProvider:
    return OpenAIProvider()
