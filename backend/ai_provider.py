import os
import json
from typing import Dict, Any, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIProvider:
    async def triage_complaint(self, description: str, image_url: str = None) -> Dict[str, Any]:
        raise NotImplementedError

class DemoAIProvider(AIProvider):
    async def triage_complaint(self, description: str, image_url: str = None) -> Dict[str, Any]:
        logger.info("Using DemoAIProvider for triage")
        desc_lower = description.lower()
        
        category = "OTHER"
        severity = "LOW"
        priority = "LOW"
        
        if "pothole" in desc_lower or "road" in desc_lower:
            category = "ROAD_DAMAGE"
            severity = "HIGH"
            priority = "HIGH"
        elif "light" in desc_lower or "street" in desc_lower:
            category = "STREETLIGHT"
            severity = "MEDIUM"
            priority = "MEDIUM"
        elif "water" in desc_lower or "pipe" in desc_lower or "drain" in desc_lower:
            category = "WATER_SUPPLY"
            severity = "CRITICAL"
            priority = "CRITICAL"
            
        return {
            "category": category,
            "severity": severity,
            "priority": priority,
            "summary": f"Reported issue concerning {category.lower()}",
            "confidence": 0.95,
            "evidence": ["Matched keywords in description"]
        }

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=api_key)

    async def triage_complaint(self, description: str, image_url: str = None) -> Dict[str, Any]:
        logger.info("Using OpenAIProvider for triage")
        system_prompt = """
        You are an AI assistant for a civic grievance system. 
        Triage the following citizen complaint.
        Return ONLY a JSON object with the following schema:
        {
          "category": "ROAD_DAMAGE" | "STREETLIGHT" | "WATER_SUPPLY" | "SANITATION" | "OTHER",
          "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          "summary": "Short summary",
          "confidence": 0.0 to 1.0,
          "evidence": ["Reason 1", "Reason 2"]
        }
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Complaint description: {description}"}
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise

def get_ai_provider() -> AIProvider:
    provider_name = os.getenv("AI_PROVIDER", "openai").lower()
    
    if provider_name == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            return OpenAIProvider(api_key=api_key)
        else:
            logger.warning("OpenAI configured but OPENAI_API_KEY is missing. Falling back to DemoAIProvider.")
            return DemoAIProvider()
    
    # Default fallback
    return DemoAIProvider()
