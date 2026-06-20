"""FastAPI application entry point for Childsplay Accounting."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import clients_router, health_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Client Information Database — Module 1 of Childsplay Accounting",
    version="0.1.0",
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
