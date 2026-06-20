"""API route definitions."""

from app.routes.clients import router as clients_router
from app.routes.health import router as health_router

__all__ = ["clients_router", "health_router"]
