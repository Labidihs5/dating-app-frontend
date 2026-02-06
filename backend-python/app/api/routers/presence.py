from fastapi import APIRouter, Depends, Header
from app.api.deps import get_current_user_id
from app.services import node_api

router = APIRouter(prefix="/presence", tags=["presence"])


@router.post("/online")
async def set_online(user_id: str, auth_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/presence/online", token=authorization, json={"user_id": user_id})


@router.post("/offline")
async def set_offline(user_id: str, auth_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/presence/offline", token=authorization, json={"user_id": user_id})
