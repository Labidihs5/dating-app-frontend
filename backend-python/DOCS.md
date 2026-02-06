# API Docs (FastAPI)

## Auth
All REST requests require `Authorization: Bearer <JWT>`.  
WebSocket requires `?token=<JWT>` query param.

## AI
- `POST /ai/generate_message`
- `POST /ai/suggest_reply`
- `POST /ai/analyze_tone`
- `POST /ai/translate_message`
- `POST /ai/create_profile`
- `GET /ai/profiles`
- `POST /ai/eligibility_check`
- `POST /ai/propose_match`

## Games
- `POST /games/create`
- `POST /games/move`
- `GET /games/state?game_id=...`
- `POST /games/challenge_generate`
- `POST /games/chess/matchmake`
- `POST /games/chess/move`
- `POST /games/chess/ai_move`
- `WS /games/ws/{game_id}`

## Chess (Stockfish)
- `POST /chess/analyze`
- `POST /chess/ai_move`

## Challenges
- `POST /challenges/generate`

## Rooms
- `GET /rooms`
- `POST /rooms/create`
- `POST /rooms/join`
- `POST /rooms/message`
- `GET /rooms/messages?room_id=...`
- `WS /rooms/ws/{room_id}`

## Presence
- `POST /presence/online?user_id=...`
- `POST /presence/offline?user_id=...`

## WebSocket Global
- `WS /ws/events`

Events:
`user_online`, `user_offline`, `new_message`, `game_move`, `challenge_generated`, `match_proposed`
