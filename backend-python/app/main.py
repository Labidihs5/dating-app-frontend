from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import ai, games, rooms, presence, challenges, chess
from fastapi import WebSocket, WebSocketDisconnect
from app.core.security import decode_token
from app.ws.manager import ConnectionManager

app = FastAPI(title="HeartMatch AI/Games/Rooms API")
ws_manager = ConnectionManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_origin_regex=settings.allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)
app.include_router(games.router)
app.include_router(rooms.router)
app.include_router(presence.router)
app.include_router(challenges.router)
app.include_router(chess.router)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.websocket("/ws/events")
async def events_ws(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4401)
        return
    try:
        _ = decode_token(token)
    except Exception:
        await websocket.close(code=4401)
        return
    await ws_manager.connect("global", websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await ws_manager.broadcast("global", data)
    except WebSocketDisconnect:
        ws_manager.disconnect("global", websocket)
