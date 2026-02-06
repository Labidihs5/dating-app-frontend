from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Header
from app.api.deps import get_current_user_id
from app import schemas
from app.core.security import decode_token
from app.services import node_api

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("")
async def list_rooms(user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.get("/api/rooms", token=authorization)


@router.post("/create")
async def create_room(payload: schemas.RoomCreateRequest, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/rooms/create", token=authorization, json=payload.dict())


@router.post("/join")
async def join_room(payload: schemas.RoomJoinRequest, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/rooms/join", token=authorization, json=payload.dict())


@router.post("/message")
async def post_message(payload: schemas.RoomMessageRequest, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.post("/api/rooms/message", token=authorization, json=payload.dict())


@router.get("/messages")
async def get_messages(room_id: str, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.get("/api/rooms/messages", token=authorization, params={"room_id": room_id})


@router.websocket("/ws/{room_id}")
async def room_ws(websocket: WebSocket, room_id: str):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4401)
        return
    try:
        _ = decode_token(token)
    except Exception:
        await websocket.close(code=4401)
        return
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            await websocket.send_json({"type": "new_message", "room_id": str(room_id), "payload": data})
    except WebSocketDisconnect:
        return
