"""Seed script — creates the default firm on first run.

This ensures the database has at least one firm record so that
clients can be created immediately after deployment.

Run manually: python -m app.seed
Or it runs automatically on app startup if no firms exist.
"""

import uuid

from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.firm import Firm

# Default firm ID (matches the DEFAULT_FIRM_ID in routes/clients.py)
DEFAULT_FIRM_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def seed_default_firm(db: Session) -> None:
    """Create the default firm if it doesn't already exist."""
    existing = db.query(Firm).filter(Firm.id == DEFAULT_FIRM_ID).first()
    if existing:
        print(f"Default firm already exists: {existing.firm_name}")
        return

    firm = Firm(
        id=DEFAULT_FIRM_ID,
        firm_code="CPA",
        firm_name="Childsplay Accounting",
    )
    db.add(firm)
    db.commit()
    print(f"Created default firm: {firm.firm_name} ({firm.firm_code})")


def run_seed() -> None:
    """Run all seed operations."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_default_firm(db)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
