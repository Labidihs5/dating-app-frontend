from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class AIGenerateMessageRequest(BaseModel):
    user_id: str
    context: str
    intent: str


class AISuggestReplyRequest(BaseModel):
    user_id: str
    last_message: str
    tone: Optional[str] = None


class AIAnalyzeToneRequest(BaseModel):
    user_id: str
    message: str


class AITranslateMessageRequest(BaseModel):
    user_id: str
    message: str
    target_language: str


class AICreateProfileRequest(BaseModel):
    count: int = 1
    relationship_type: str = "serious"


class AIProfile(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    relationship_type: str
    bio: Optional[str] = None
    interests: List[str] = []
    photo_url: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None


class EligibilityRequest(BaseModel):
    user_id: str
    target_id: str
    age_min: int
    age_max: int
    gender: str
    relationship_type: str
    distance_km: Optional[int] = None


class MatchProposalRequest(BaseModel):
    user_id: str
    target_id: str


class GameCreateRequest(BaseModel):
    game_type: str
    mode: str
    player1_id: str
    player2_id: Optional[str] = None


class GameMoveRequest(BaseModel):
    game_id: str
    player_id: str
    move: Dict[str, Any]
    state: Optional[Dict[str, Any]] = None


class ChessMatchmakeRequest(BaseModel):
    user_id: str


class ChessMoveRequest(BaseModel):
    game_id: str
    user_id: str
    uci: str
    fen: str


class ChessAIMoveRequest(BaseModel):
    fen: str
    depth: Optional[int] = 16


class ChessAnalyzeRequest(BaseModel):
    fen: str
    depth: Optional[int] = 14
    multipv: Optional[int] = 3


class ChallengeGenerateRequest(BaseModel):
    game_type: str
    trigger: str
    user_id: str
    target_id: Optional[str] = None


class RoomCreateRequest(BaseModel):
    name: str
    type: str
    owner_id: Optional[str] = None
    is_verified_only: bool = False


class RoomJoinRequest(BaseModel):
    room_id: str
    user_id: str


class RoomMessageRequest(BaseModel):
    room_id: str
    user_id: str
    content: str


class RoomMessageOut(BaseModel):
    message_id: str
    room_id: str
    user_id: str
    content: str
    created_at: datetime
