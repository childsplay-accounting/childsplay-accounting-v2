"""Pydantic schemas for Client CRUD operations."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import (
    EntityType,
    ClientFileType,
    ClientIdType,
    PreferredLanguage,
    PreferredCommunicationMethod,
    NameType,
    IndividualTitle,
    AddressType,
    PhoneType,
    TaxType,
    TaxStatus,
    VatPeriod,
    OfficialDateType,
    YearEndMonth,
    ConnectedPersonRelationship,
    MaritalStatus,
)


# --- Sub-schemas for nested data ---


class ClientNameBase(BaseModel):
    name_type: NameType
    name_value: str
    individual_title: IndividualTitle | None = None
    non_capitalization_surname: str | None = None
    is_primary: bool = False


class ClientNameCreate(ClientNameBase):
    pass


class ClientNameResponse(ClientNameBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientAddressBase(BaseModel):
    address_type: AddressType
    complex_unit_number: str | None = None
    complex_name: str | None = None
    street_number: str | None = None
    street_name: str | None = None
    suburb: str | None = None
    city: str | None = None
    postal_code: str | None = None
    province: str | None = None
    country: str = "South Africa"
    is_primary: bool = False


class ClientAddressCreate(ClientAddressBase):
    pass


class ClientAddressResponse(ClientAddressBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientPhoneBase(BaseModel):
    phone_type: PhoneType
    phone_number: str
    is_primary: bool = False


class ClientPhoneCreate(ClientPhoneBase):
    pass


class ClientPhoneResponse(ClientPhoneBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientEmailBase(BaseModel):
    email_address: str
    is_primary: bool = False


class ClientEmailCreate(ClientEmailBase):
    pass


class ClientEmailResponse(ClientEmailBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientTaxRegistrationBase(BaseModel):
    tax_type: TaxType
    tax_number: str | None = None
    tax_status: TaxStatus
    vat_registration: str | None = None
    vat_period: VatPeriod | None = None
    efiling_client_code: str | None = None


class ClientTaxRegistrationCreate(ClientTaxRegistrationBase):
    pass


class ClientTaxRegistrationResponse(ClientTaxRegistrationBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientIncomeSourceBase(BaseModel):
    trading_name: str
    business_description: str | None = None
    occupation_description: str | None = None


class ClientIncomeSourceCreate(ClientIncomeSourceBase):
    pass


class ClientIncomeSourceResponse(ClientIncomeSourceBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientDateBase(BaseModel):
    date_type: OfficialDateType
    date_value: date
    year_end_month: YearEndMonth | None = None


class ClientDateCreate(ClientDateBase):
    pass


class ClientDateResponse(ClientDateBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientConnectedPersonBase(BaseModel):
    connected_client_id: UUID | None = None
    contact_person_id: UUID | None = None
    relationship_type: ConnectedPersonRelationship


class ClientConnectedPersonCreate(ClientConnectedPersonBase):
    pass


class ClientConnectedPersonResponse(ClientConnectedPersonBase):
    id: UUID

    class Config:
        from_attributes = True


class ClientPersonalDetailsBase(BaseModel):
    marital_status: MaritalStatus | None = None
    spouse_contact_code: str | None = None
    domain: str | None = None


class ClientPersonalDetailsCreate(ClientPersonalDetailsBase):
    pass


class ClientPersonalDetailsResponse(ClientPersonalDetailsBase):
    id: UUID

    class Config:
        from_attributes = True


# --- Main Client schemas ---


class ClientCreate(BaseModel):
    """Schema for creating a new client."""

    client_code: str
    entity_type: EntityType
    client_file_type: ClientFileType
    client_id_type: ClientIdType | None = None
    client_id_number: str | None = None
    client_group_id: UUID | None = None
    preferred_language: PreferredLanguage = PreferredLanguage.ENGLISH
    preferred_communication_method: PreferredCommunicationMethod = (
        PreferredCommunicationMethod.EMAIL
    )
    temporary_marker: bool = False

    # Nested data (optional on creation)
    names: list[ClientNameCreate] = []
    addresses: list[ClientAddressCreate] = []
    phones: list[ClientPhoneCreate] = []
    emails: list[ClientEmailCreate] = []
    tax_registrations: list[ClientTaxRegistrationCreate] = []
    income_sources: list[ClientIncomeSourceCreate] = []
    dates: list[ClientDateCreate] = []
    connected_persons: list[ClientConnectedPersonCreate] = []
    personal_details: ClientPersonalDetailsCreate | None = None


class ClientUpdate(BaseModel):
    """Schema for updating an existing client (all fields optional)."""

    client_code: str | None = None
    entity_type: EntityType | None = None
    client_file_type: ClientFileType | None = None
    client_id_type: ClientIdType | None = None
    client_id_number: str | None = None
    client_group_id: UUID | None = None
    preferred_language: PreferredLanguage | None = None
    preferred_communication_method: PreferredCommunicationMethod | None = None
    temporary_marker: bool | None = None


class ClientResponse(BaseModel):
    """Full client response with all related data."""

    id: UUID
    firm_id: UUID
    client_code: str
    entity_type: EntityType
    client_file_type: ClientFileType
    client_id_type: ClientIdType | None
    client_id_number: str | None
    client_group_id: UUID | None
    preferred_language: PreferredLanguage
    preferred_communication_method: PreferredCommunicationMethod
    temporary_marker: bool
    created_at: datetime
    updated_at: datetime

    # Related data
    names: list[ClientNameResponse] = []
    addresses: list[ClientAddressResponse] = []
    phones: list[ClientPhoneResponse] = []
    emails: list[ClientEmailResponse] = []
    tax_registrations: list[ClientTaxRegistrationResponse] = []
    income_sources: list[ClientIncomeSourceResponse] = []
    dates: list[ClientDateResponse] = []
    connected_persons: list[ClientConnectedPersonResponse] = []
    personal_details: ClientPersonalDetailsResponse | None = None

    class Config:
        from_attributes = True


class ClientListResponse(BaseModel):
    """Simplified client response for list views."""

    id: UUID
    client_code: str
    entity_type: EntityType
    client_file_type: ClientFileType
    client_id_number: str | None
    preferred_language: PreferredLanguage
    temporary_marker: bool

    # Include primary name for display
    names: list[ClientNameResponse] = []

    class Config:
        from_attributes = True
