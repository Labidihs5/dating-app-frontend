from fastapi import APIRouter, Depends, Header
from app.api.deps import get_current_user_id
from app import schemas
from app.services import ai as ai_service
import json
from app.services import node_api

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate_message")
async def generate_message(payload: schemas.AIGenerateMessageRequest, user_id=Depends(get_current_user_id)):
    text = await ai_service.coach_message(payload.context, payload.intent)
    return {"message": text}


@router.post("/suggest_reply")
async def suggest_reply(payload: schemas.AISuggestReplyRequest, user_id=Depends(get_current_user_id)):
    text = await ai_service.suggest_reply(payload.last_message, payload.tone)
    return {"suggestion": text}


@router.post("/analyze_tone")
async def analyze_tone(payload: schemas.AIAnalyzeToneRequest, user_id=Depends(get_current_user_id)):
    tone = await ai_service.analyze_tone(payload.message)
    return {"tone": tone}


@router.post("/translate_message")
async def translate_message(payload: schemas.AITranslateMessageRequest, user_id=Depends(get_current_user_id)):
    text = await ai_service.translate_message(payload.message, payload.target_language)
    return {"translation": text}


@router.post("/create_profile")
async def create_profile(
    payload: schemas.AICreateProfileRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    created = []
    for _ in range(payload.count):
        raw = await ai_service.generate_profile_text(payload.relationship_type)
        try:
            data = json.loads(raw["raw"])
        except Exception:
            data = {
                "name": "Ava",
                "age": 26,
                "gender": "female",
                "bio": raw["raw"][:200],
                "interests": ["Travel", "Music", "Reading", "Hiking", "Cooking"],
                "city": "Paris",
                "country": "France",
            }
        profile = {
            "name": data.get("name", "Alex"),
            "age": int(data.get("age", 25)),
            "gender": data.get("gender", "female"),
            "relationshipType": payload.relationship_type,
            "bio": data.get("bio"),
            "interests": data.get("interests", []),
            "city": data.get("city"),
            "country": data.get("country"),
        }
        created.append(profile)
    result = await node_api.post("/api/ai-profiles", token=authorization, json={"profiles": created})
    return result


@router.get("/profiles")
async def get_profiles(user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.get("/api/ai-profiles", token=authorization)


@router.post("/eligibility_check")
async def eligibility_check(payload: schemas.EligibilityRequest, user_id=Depends(get_current_user_id)):
    # Placeholder logic; client should also validate
    ok = payload.age_min <= payload.age_max
    return {"eligible": ok}


@router.post("/propose_match")
async def propose_match(payload: schemas.MatchProposalRequest, user_id=Depends(get_current_user_id)):
    # Consent and eligibility should be checked before creating a match.
    return {"proposed": True, "user_id": str(payload.user_id), "target_id": str(payload.target_id)}
