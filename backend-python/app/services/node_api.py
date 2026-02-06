from typing import Any, Dict, Optional
import httpx
from fastapi import HTTPException
from app.core.config import settings


async def request(
    method: str,
    path: str,
    *,
    token: Optional[str] = None,
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
) -> Any:
    url = f"{settings.node_api_url.rstrip('/')}{path}"
    headers: Dict[str, str] = {}
    if token:
        headers["Authorization"] = token
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.request(method, url, headers=headers, json=json, params=params)
            resp.raise_for_status()
            if resp.status_code == 204:
                return None
            return resp.json()
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text or "Node API error"
        raise HTTPException(status_code=exc.response.status_code, detail=detail)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Node API unreachable: {exc}")


async def get(path: str, *, token: Optional[str] = None, params: Optional[Dict[str, Any]] = None) -> Any:
    return await request("GET", path, token=token, params=params)


async def post(path: str, *, token: Optional[str] = None, json: Optional[Dict[str, Any]] = None) -> Any:
    return await request("POST", path, token=token, json=json)
