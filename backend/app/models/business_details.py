"""BusinessDetails model — single-record master file for Childsplay Accounting.

This table stores the one-and-only record of the business's own details:
registered name, trading name, domains, contact info, address, bank details,
member info, and copyright template. All future references to business details
(e.g. Status Bar copyright) are pulled from this single record.
"""

import uuid
from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BusinessDetails(Base):
    __tablename__ = "business_details"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Developer identification
    developer_code: Mapped[str] = mapped_column(String(2), nullable=False)

    # Business identity
    registered_name: Mapped[str] = mapped_column(String(255), nullable=False)
    registration_number: Mapped[str] = mapped_column(String(50), nullable=False)
    trading_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Domains
    basic_domain_coza: Mapped[str | None] = mapped_column(String(255), nullable=True)
    parked_domain_com: Mapped[str | None] = mapped_column(String(255), nullable=True)
    parked_domain_info: Mapped[str | None] = mapped_column(String(255), nullable=True)
    parked_domain_biz: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Contact
    email_contact_us: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telephone_office: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # Address (flat — single record, no need for relational table)
    address_complex_unit_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address_complex_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_street_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address_street_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_suburb: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_town: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_postal_code: Mapped[str | None] = mapped_column(String(10), nullable=True)
    address_province: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address_country: Mapped[str] = mapped_column(String(100), default="South Africa")

    # Bank details
    bank_account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_account_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bank_account_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bank_institution: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_branch_code: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # Member details
    member_full_names_and_surname: Mapped[str | None] = mapped_column(String(255), nullable=True)
    member_identification_number: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Copyright template (the year is computed dynamically at runtime)
    # Stored as template: "© {registered_name} {year} All Rights Reserved"
    # The API response computes the actual copyright string with the current year.
    copyright_template: Mapped[str] = mapped_column(
        String(500),
        default="© {registered_name} {year} All Rights Reserved",
        nullable=False,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
