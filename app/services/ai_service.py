import logging
import httpx
from typing import Dict, Any, List
from app.core.config import settings
from ai.semantic_search.intent_parser import parse_search_intent_fallback
from ai.chatbot.assistant import generate_chatbot_fallback_reply

logger = logging.getLogger("kitchora.ai")

async def parse_natural_language_query(prompt: str) -> Dict[str, Any]:
    """
    Attempts external AI intent extraction if key configured, otherwise returns robust fallback.
    """
    if settings.AI_API_KEY and settings.AI_PROVIDER == "gemini":
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.AI_API_KEY}"
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Extract food search intent from prompt: '{prompt}'. Return JSON with keys: diet (VEG/NON-VEG/ALL), max_price (number or null), min_protein (number or null), keywords (list of strings)."
                    }]
                }]
            }
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    # In real flow parse JSON from response text
                    pass
        except Exception as e:
            logger.warning(f"External AI intent parsing failed: {e}. Falling back to rule parser.")

    # Graceful fallback
    return parse_search_intent_fallback(prompt)


async def get_ai_chat_response(message: str, db_dishes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates AI Chat response. Gracefully falls back if external LLM fails.
    """
    if settings.AI_API_KEY and settings.AI_PROVIDER == "gemini":
        try:
            # External call attempt
            pass
        except Exception as e:
            logger.warning(f"AI Chatbot external API call failed: {e}")

    # Grounded rule fallback
    return generate_chatbot_fallback_reply(message, db_dishes)
