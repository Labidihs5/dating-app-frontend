from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Header
from app.api.deps import get_current_user_id
from app import schemas
import chess
from app.services import chess_ai
from app.ws.manager import game_manager
from app.core.security import decode_token
from app.services import node_api

router = APIRouter(prefix="/games", tags=["games"])


@router.post("/create")
async def create_game(
    payload: schemas.GameCreateRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    return await node_api.post("/api/games/create", token=authorization, json=payload.dict())


@router.post("/move")
async def game_move(
    payload: schemas.GameMoveRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    result = await node_api.post("/api/games/move", token=authorization, json=payload.dict())
    game_manager.broadcast_sync(
        f"game:{payload.game_id}",
        {"type": "game_move", "game_id": str(payload.game_id), "payload": payload.move},
    )
    return result


@router.get("/state")
async def game_state(game_id: str, user_id=Depends(get_current_user_id), authorization: str | None = Header(None)):
    return await node_api.get("/api/games/state", token=authorization, params={"game_id": game_id})


@router.post("/challenge_generate")
async def challenge_generate(
    payload: schemas.ChallengeGenerateRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    return await node_api.post("/api/games/challenge_generate", token=authorization, json=payload.dict())


@router.post("/chess/matchmake")
async def chess_matchmake(
    payload: schemas.ChessMatchmakeRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    return await node_api.post("/api/games/chess/matchmake", token=authorization, json={"user_id": payload.user_id, "fen": chess.STARTING_FEN})


@router.post("/chess/move")
async def chess_move(
    payload: schemas.ChessMoveRequest,
    user_id=Depends(get_current_user_id),
    authorization: str | None = Header(None),
):
    board = chess.Board(payload.fen)
    try:
        move = chess.Move.from_uci(payload.uci)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid move")
    if move not in board.legal_moves:
        raise HTTPException(status_code=400, detail="Illegal move")
    board.push(move)
    new_fen = board.fen()
    game_manager.broadcast_sync(f"game:{payload.game_id}", {"type": "game_move", "game_id": str(payload.game_id), "payload": {"fen": new_fen, "uci": payload.uci}})
    return await node_api.post(
        "/api/games/chess/move",
        token=authorization,
        json={"game_id": payload.game_id, "user_id": payload.user_id, "uci": payload.uci, "fen": new_fen},
    )


@router.post("/chess/ai_move")
def chess_ai_move(payload: schemas.ChessAIMoveRequest, user_id=Depends(get_current_user_id)):
    move = chess_ai.best_move(payload.fen, payload.depth or 16)
    if not move:
        raise HTTPException(status_code=500, detail="Stockfish not configured")
    board = chess.Board(payload.fen)
    board.push_uci(move)
    return {"uci": move, "fen": board.fen()}


@router.websocket("/ws/{game_id}")
async def game_ws(websocket: WebSocket, game_id: str):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4401)
        return
    try:
        _ = decode_token(token)
    except Exception:
        await websocket.close(code=4401)
        return
    await game_manager.connect(f"game:{game_id}", websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        game_manager.disconnect(f"game:{game_id}", websocket)
