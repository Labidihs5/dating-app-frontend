# AI / Games / Rooms Integration

## Services
- Node backend: existing API (`NEXT_PUBLIC_API_URL`)
- FastAPI backend: new service (`NEXT_PUBLIC_PY_API_URL`)

## Setup
1. Start FastAPI:
   ```bash
   cd backend-python
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
   ```
2. Add env var:
   ```bash
   NEXT_PUBLIC_PY_API_URL=http://localhost:8001
   ```

## New Pages
- `/ai` AI coach
- `/games` Chess + Ludo
- `/rooms` chat rooms (WebSocket)
- `/challenges` dating challenges

## WebSocket
- Global events: `ws://<host>:8001/ws/events?token=...`
- Room: `ws://<host>:8001/rooms/ws/<room_id>?token=...`

## Notes
- JWT required for all FastAPI endpoints.
- Add Groq key and SD API to `.env` for AI.
- Install Stockfish and set `STOCKFISH_PATH` for chess AI.
