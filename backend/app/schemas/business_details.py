"""Pydantic schemas for the BusinessDetails master file.

The Response schema includes a computed `copyright` field that derives
the current year dynamically (same logic as the Status Bar).
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, computed_field


class BusinessDetailsBase(BaseModel):
    """Shared fields for the business details master file."""

    developer_code: str = Field(..., min_length=2, max_length=2)
    registered_name: str
    registration_number: str
    trading_name: str

    # Domains
    basic_domain_coza: str | None = None
    parked_domain_com: str | None = None
    parked_domain_info: str | None = None
    parked_domain_biz: str | None = None

    # Contact
    email_contact_us: str | None = None
    telephone_office: str | None = None

    # Address
    address_complex_unit_number: str | None = None
    address_complex_name: str | None = None
    address_street_number: str | None = None
    address_street_name: str | None = None
    address_suburb: str | None = None
    address_town: str | None = None
    address_postal_code: str | None = None
    address_province: str | None = None
    address_country: str = "South Africa"

    # Bank details
    bank_account_name: str | None = None
    bank_account_number: str | None = None
    bank_account_type: str | None = None
    bank_institution: str | None = None
    bank_branch: str | None = None
    bank_branch_code: str | None = None

    # Member details
    member_full_names_and_surname: str | None = None
    member_identification_number: str | None = None

    # Copyright template (stored with placeholders)
    copyright_template: str = "© {registered_name} {year} All Rights Reserved"


class BusinessDetailsUpdate(BaseModel):
    """Schema for updating the business details (all fields optional)."""

    developer_code: str | None = Field(None, min_length=2, max_length=2)
    registered_name: str | None = None
    registration_number: str | None = None
    trading_name: str | None = None

    # Domains
    basic_domain_coza: str | None = None
    parked_domain_com: str | None = None
    parked_domain_info: str | None = None
    parked_domain_biz: str | None = None

    # Contact
    email_contact_us: str | None = None
    telephone_office: str | None = None

    # Address
    address_complex_unit_number: str | None = None
    address_complex_name: str | None = None
    address_street_number: str | None = None
    address_street_name: str | None = None
    address_suburb: str | None = None
    address_town: str | None = None
    address_postal_code: str | None = None
    address_province: str | None = None
    address_country: str | None = None

    # Bank details
    bank_account_name: str | None = None
    bank_account_number: str | None = None
    bank_account_type: str | None = None
    bank_institution: str | None = None
    bank_branch: str | None = None
    bank_branch_code: str | None = None

    # Member details
    member_full_names_and_surname: str | None = None
    member_identification_number: str | None = None

    # Copyright template
    copyright_template: str | None = None


class BusinessDetailsResponse(BusinessDetailsBase):
    """Full response with ID, timestamps, and computed copyright string."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def copyright(self) -> str:
        """Dynamically compute copyright with the current year.

        Uses the same logic as the Status Bar: derive the year from
        the current date at runtime.
        """
        current_year = datetime.now().year
        return self.copyright_template.format(
            registered_name=self.registered_name,
            year=current_year,
        )

    class Config:
        from_attributes = True
