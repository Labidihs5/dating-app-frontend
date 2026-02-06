from fastapi import APIRouter, Depends, Header
from app.api.deps import get_current_user_id
from app import schemas
from app.services import node_api

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.post("/generate")
async def generate_challenge(payload: schemas.ChallengeGenerateRequest, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/challenges", token=authorization, json=payload.dict())
