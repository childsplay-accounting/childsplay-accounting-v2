"""Seed script — creates the default firm and business details on first run.

This ensures the database has at least one firm record so that
clients can be created immediately after deployment, and a single
business details master record for application-wide references.

Run manually: python -m app.seed
Or it runs automatically on app startup if no firms exist.
"""

import uuid

from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.firm import Firm
from app.models.business_details import BusinessDetails

# Default firm ID (matches the DEFAULT_FIRM_ID in routes/clients.py)
DEFAULT_FIRM_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")

# Default business details ID (single record — always this UUID)
DEFAULT_BUSINESS_DETAILS_ID = uuid.UUID("00000000-0000-0000-0000-000000000002")


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


def seed_business_details(db: Session) -> None:
    """Create the single business details master record if it doesn't exist."""
    existing = (
        db.query(BusinessDetails)
        .filter(BusinessDetails.id == DEFAULT_BUSINESS_DETAILS_ID)
        .first()
    )
    if existing:
        print(f"Business details already exists: {existing.trading_name}")
        return

    details = BusinessDetails(
        id=DEFAULT_BUSINESS_DETAILS_ID,
        developer_code="CA",
        registered_name="Comparative Shopping CC",
        registration_number="1997/039382/23",
        trading_name="Childsplay Accounting",
        basic_domain_coza="http://childsplay-accounting.co.za/",
        parked_domain_com="http://childsplay-accounting.com/",
        parked_domain_info="http://childsplay-accounting.info/",
        parked_domain_biz="http://childsplay-accounting.biz/",
        email_contact_us="webmaster@childsplay-accounting.co.za",
        telephone_office="+27283121080",
        address_complex_unit_number="B",
        address_complex_name="Sun Jomar Accountants",
        address_street_number="17",
        address_street_name="Flower Street",
        address_suburb="Westcliff",
        address_town="Hermanus",
        address_postal_code="7200",
        address_province="Western Cape",
        address_country="South Africa",
        bank_account_name="Childsplay Accounting",
        bank_account_number="62006692835",
        bank_account_type="Current Account",
        bank_institution="First National Bank",
        bank_branch="Hermanus",
        bank_branch_code="200412",
        member_full_names_and_surname="Johannes De Villiers de Kock",
        member_identification_number="7101295167083",
        copyright_template="\u00a9 {registered_name} {year} All Rights Reserved",
    )
    db.add(details)
    db.commit()
    print(f"Created business details: {details.trading_name} ({details.developer_code})")


def run_seed() -> None:
    """Run all seed operations."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_default_firm(db)
        seed_business_details(db)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
