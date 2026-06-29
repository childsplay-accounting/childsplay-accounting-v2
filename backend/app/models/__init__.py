"""SQLAlchemy ORM models for the Client Information Database."""

from app.models.firm import Firm
from app.models.business_details import BusinessDetails
from app.models.client_group import ClientGroup
from app.models.client import Client
from app.models.client_name import ClientName
from app.models.client_address import ClientAddress
from app.models.client_phone import ClientPhone
from app.models.client_email import ClientEmail
from app.models.client_tax_registration import ClientTaxRegistration
from app.models.client_income_source import ClientIncomeSource
from app.models.client_date import ClientDate
from app.models.contact_person import ContactPerson
from app.models.client_connected_person import ClientConnectedPerson
from app.models.client_personal_details import ClientPersonalDetails

__all__ = [
    "Firm",
    "BusinessDetails",
    "ClientGroup",
    "Client",
    "ClientName",
    "ClientAddress",
    "ClientPhone",
    "ClientEmail",
    "ClientTaxRegistration",
    "ClientIncomeSource",
    "ClientDate",
    "ContactPerson",
    "ClientConnectedPerson",
    "ClientPersonalDetails",
]
