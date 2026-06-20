"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with defaults for local development."""

    APP_NAME: str = "Childsplay Accounting"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/childsplay"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()
