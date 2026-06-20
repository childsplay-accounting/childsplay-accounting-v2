"""Application configuration loaded from environment variables."""

import os


class Settings:
    """Application settings.

    Reads directly from os.environ to ensure Railway's environment
    variables are always picked up correctly.
    """

    APP_NAME: str = "Childsplay Accounting"
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/childsplay",
    )
    CORS_ORIGINS: list = ["*"]

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


settings = Settings()

# Print database connection info on startup (host only, no password)
_safe_display = settings.database_url_safe.split("@")[-1] if "@" in settings.database_url_safe else "localhost"
print(f"[CONFIG] Connecting to database at: {_safe_display}")
