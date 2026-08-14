import logging
import json
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
    if settings.AI_API_KEY:
        try:
            if settings.AI_PROVIDER.lower() == "openrouter":
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {settings.AI_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": settings.FRONTEND_URL,
                    "X-Title": "Kitchora AI"
                }
                messages = [
                    {
                        "role": "system",
                        "content": (
                            "You are Kitchora's AI intent extractor. Extract JSON with keys: "
                            "diet ('VEG', 'NON-VEG', or 'ALL'), max_price (number or null), "
                            "min_protein (number or null), keywords (list of dish keywords)."
                        )
                    },
                    {"role": "user", "content": prompt}
                ]
                payload = {
                    "model": "meta-llama/llama-3.3-70b-instruct:free",
                    "messages": messages,
                    "response_format": {"type": "json_object"}
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        content = res.json()["choices"][0]["message"]["content"]
                        parsed = json.loads(content)
                        return parsed
            elif settings.AI_PROVIDER.lower() == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.AI_API_KEY}"
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"Extract food search intent from prompt: '{prompt}'. Return JSON only with keys: diet (VEG/NON-VEG/ALL), max_price (number or null), min_protein (number or null), keywords (list of strings)."
                        }]
                    }]
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                        clean_text = text.replace("```json", "").replace("```", "").strip()
                        return json.loads(clean_text)
        except Exception as e:
            logger.warning(f"External AI intent parsing failed: {e}. Falling back to rule parser.")

    # Rule-based intent fallback
    return parse_search_intent_fallback(prompt)


async def get_ai_chat_response(message: str, db_dishes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates AI Chat response using OpenRouter / Gemini or intelligent rule fallback.
    """
    if settings.AI_API_KEY:
        try:
            dish_summary = "\n".join([f"- {d['name']} (₹{d['price']}, {d['protein_g']}g protein, {'Veg' if d['is_veg'] else 'Non-Veg'})" for d in db_dishes[:10]])
            system_prompt = (
                f"You are Kitchy, Kitchora's AI Food & Culinary Assistant. "
                f"Be warm, helpful, and concise. Below is our current menu context:\n{dish_summary}\n"
                f"Recommend relevant dishes from the menu when appropriate."
            )
            
            if settings.AI_PROVIDER.lower() == "openrouter":
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {settings.AI_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": settings.FRONTEND_URL,
                    "X-Title": "Kitchora AI Assistant"
                }
                payload = {
                    "model": "meta-llama/llama-3.3-70b-instruct:free",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ]
                }
                async with httpx.AsyncClient(timeout=6.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        reply_text = res.json()["choices"][0]["message"]["content"]
                        return {
                            "reply": reply_text,
                            "suggested_dishes": db_dishes[:3],
                            "ai_used": True
                        }
            elif settings.AI_PROVIDER.lower() == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.AI_API_KEY}"
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"{system_prompt}\n\nUser Question: {message}"
                        }]
                    }]
                }
                async with httpx.AsyncClient(timeout=6.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        reply_text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "reply": reply_text,
                            "suggested_dishes": db_dishes[:3],
                            "ai_used": True
                        }
        except Exception as e:
            logger.warning(f"AI Chatbot external API call failed: {e}")

    # Grounded rule fallback
    return generate_chatbot_fallback_reply(message, db_dishes)
