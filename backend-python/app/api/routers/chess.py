from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user_id
from app import schemas
from app.services import chess_ai

router = APIRouter(prefix="/chess", tags=["chess"])


@router.post("/analyze")
def analyze(payload: schemas.ChessAnalyzeRequest, user_id=Depends(get_current_user_id)):
    result = chess_ai.analyze_position(payload.fen, payload.depth or 14, payload.multipv or 3)
    if not result:
        raise HTTPException(status_code=500, detail="Stockfish not configured")
    return result


@router.post("/ai_move")
def ai_move(payload: schemas.ChessAIMoveRequest, user_id=Depends(get_current_user_id)):
    move = chess_ai.best_move(payload.fen, payload.depth or 16)
    if not move:
        raise HTTPException(status_code=500, detail="Stockfish not configured")
    return {"uci": move}
