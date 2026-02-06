from fastapi import Header, HTTPException, status
from app.core.security import decode_token


def get_current_user_id(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    return decode_token(token)


def get_auth_header(authorization: str = Header(None)) -> str | None:
    return authorization
