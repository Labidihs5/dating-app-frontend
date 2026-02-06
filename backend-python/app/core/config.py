from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    node_api_url: str = "https://lovematchback-production.up.railway.app"
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    allowed_origins: str = "http://localhost:3000"
    allowed_origin_regex: str = r"https?://localhost(:\d+)?|https?://127\.0\.0\.1(:\d+)?"
    groq_api_key: str | None = None
    groq_model: str = "llama3-70b-8192"
    sd_api_url: str | None = None
    sd_api_key: str | None = None
    stockfish_path: str | None = None

    @property
    def origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")
