"""Application configuration loaded from environment variables."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with defaults for local development.

    Railway provides DATABASE_URL automatically when you add a PostgreSQL plugin.
    CORS_ORIGINS should include your frontend URL (Railway gives you a public URL).
    """

    APP_NAME: str = "Childsplay Accounting"
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/childsplay",
    )
    CORS_ORIGINS: list[str] = ["*"]

    @property
    def database_url_safe(self) -> str:
        """Ensure DATABASE_URL uses 'postgresql://' (not 'postgres://').

        Railway and some other providers use 'postgres://' which SQLAlchemy 2.0
        no longer accepts. This property fixes that automatically.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

# Print database connection info on startup (host only, no password)
_safe_display = settings.database_url_safe.split("@")[-1] if "@" in settings.database_url_safe else "localhost"
print(f"[CONFIG] Connecting to database at: {_safe_display}")
