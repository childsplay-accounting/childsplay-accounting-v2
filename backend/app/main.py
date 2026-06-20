"""FastAPI application entry point for Childsplay Accounting."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.models import *  # noqa: F401, F403 — registers all models
from app.routes import clients_router, health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """On startup: create all database tables and seed default data.

    This means you don't need to run migrations manually on Railway.
    Tables are only created if they're missing — existing data is never lost.
    The seed script only creates the default firm if it doesn't already exist.
    """
    Base.metadata.create_all(bind=engine)

    # Seed default firm (safe to run multiple times — skips if already exists)
    from app.seed import seed_default_firm
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        seed_default_firm(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Client Information Database — Module 1 of Childsplay Accounting",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware to allow the React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router)
app.include_router(clients_router)


@app.get("/")
def root():
    """Root endpoint with API info."""
    return {
        "app": settings.APP_NAME,
        "module": "Client Information Database",
        "version": "0.1.0",
        "docs": "/docs",
    }
