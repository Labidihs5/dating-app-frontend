import chess
import chess.engine
from app.core.config import settings


def get_engine():
    if not settings.stockfish_path:
        return None
    return chess.engine.SimpleEngine.popen_uci(settings.stockfish_path)


def best_move(fen: str, depth: int = 16):
    board = chess.Board(fen)
    engine = get_engine()
    if not engine:
        return None
    try:
        result = engine.play(board, chess.engine.Limit(depth=depth))
        return result.move.uci()
    finally:
        engine.quit()


def analyze_position(fen: str, depth: int = 16, multipv: int = 3):
    board = chess.Board(fen)
    engine = get_engine()
    if not engine:
        return None
    try:
        info = engine.analyse(board, chess.engine.Limit(depth=depth), multipv=multipv)
        if not isinstance(info, list):
            info = [info]
        results = []
        for item in info:
            score = item.get("score")
            if score is not None:
                pov = score.pov(chess.WHITE)
                cp = pov.score(mate_score=100000)
                mate = pov.mate()
            else:
                cp = None
                mate = None
            pv = item.get("pv") or []
            best = pv[0].uci() if pv else None
            results.append({
                "best_move": best,
                "eval_cp": cp,
                "mate": mate,
            })
        return {
            "best_move": results[0].get("best_move") if results else None,
            "eval_cp": results[0].get("eval_cp") if results else None,
            "mate": results[0].get("mate") if results else None,
            "top": results,
        }
    finally:
        engine.quit()
