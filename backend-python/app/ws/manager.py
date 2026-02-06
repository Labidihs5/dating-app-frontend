from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active: Dict[str, List[WebSocket]] = {}

    async def connect(self, channel: str, websocket: WebSocket):
        await websocket.accept()
        self.active.setdefault(channel, []).append(websocket)

    def disconnect(self, channel: str, websocket: WebSocket):
        if channel in self.active and websocket in self.active[channel]:
            self.active[channel].remove(websocket)

    async def broadcast(self, channel: str, message: dict):
        for ws in self.active.get(channel, []):
            await ws.send_json(message)

    def broadcast_sync(self, channel: str, message: dict):
        # Best-effort sync helper for REST endpoints (fire-and-forget)
        import asyncio
        loop = asyncio.get_event_loop()
        for ws in self.active.get(channel, []):
            try:
                loop.create_task(ws.send_json(message))
            except Exception:
                pass


game_manager = ConnectionManager()
