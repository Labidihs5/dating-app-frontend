# FastAPI Backend (AI Dating + Games + Rooms)

This service runs alongside the existing Next.js app and provides AI, games, challenges, and room APIs.

## Requirements
- Python 3.11+
- Node backend running (DB managed in Node + Prisma)

## Setup
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Environment
Edit `.env` and set `NODE_API_URL` to your Node backend base URL.

## Run
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Notes
- JWT auth expected in `Authorization: Bearer <token>`.
- WebSocket auth uses `token` query param.
- For Chess AI, install Stockfish and set `STOCKFISH_PATH`.
- Database schema and migrations live in `backend/prisma`.
