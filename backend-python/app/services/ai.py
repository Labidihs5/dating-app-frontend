import uuid
from typing import List, Dict, Any
import httpx
from app.core.config import settings


async def groq_chat(prompt: str) -> str:
    if not settings.groq_api_key:
        return "AI service not configured."
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.groq_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]


async def generate_profile_text(relationship_type: str) -> Dict[str, Any]:
    prompt = (
        "Generate a realistic dating profile for a serious relationship. "
        "Return JSON with name, age (18-45), gender (male/female), bio, interests (5 items), city, country."
    )
    text = await groq_chat(prompt)
    return {"raw": text, "relationship_type": relationship_type}


async def generate_image(prompt: str) -> str | None:
    if not settings.sd_api_url:
        return None
    headers = {"Authorization": f"Bearer {settings.sd_api_key}"} if settings.sd_api_key else {}
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(settings.sd_api_url, json={"prompt": prompt}, headers=headers)
        r.raise_for_status()
        data = r.json()
        return data.get("image_url")


async def coach_message(context: str, intent: str) -> str:
    prompt = f"Act as a dating coach. Context: {context}. Intent: {intent}. Suggest 3 messages."
    return await groq_chat(prompt)


async def suggest_reply(last_message: str, tone: str | None) -> str:
    prompt = f"Suggest a reply. Tone: {tone or 'friendly'}. Message: {last_message}"
    return await groq_chat(prompt)


async def analyze_tone(message: str) -> str:
    prompt = f"Analyze the tone of this message and return a short label: {message}"
    return await groq_chat(prompt)


async def translate_message(message: str, target_language: str) -> str:
    prompt = f"Translate the following message to {target_language}. Return only the translation: {message}"
    return await groq_chat(prompt)
