"""Client CRUD API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.client import Client
from app.models.client_name import ClientName
from app.models.client_address import ClientAddress
from app.models.client_phone import ClientPhone
from app.models.client_email import ClientEmail
from app.models.client_tax_registration import ClientTaxRegistration
from app.models.client_income_source import ClientIncomeSource
from app.models.client_date import ClientDate
from app.models.client_connected_person import ClientConnectedPerson
from app.models.client_personal_details import ClientPersonalDetails
from app.models.enums import ClientFileType
from app.schemas.client import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
)
from app.utils.client_code import generate_client_code

router = APIRouter(prefix="/api/clients", tags=["Clients"])

# Default firm_id for MVP (single-firm usage).
# This will be replaced with auth-based firm resolution later.
DEFAULT_FIRM_ID = "00000000-0000-0000-0000-000000000001"


@router.get("/", response_model=list[ClientListResponse])
def list_clients(
    file_type: ClientFileType | None = None,
    search: str | None = Query(None, description="Search by client code or name"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List all clients with optional filtering."""
    query = db.query(Client).options(joinedload(Client.names))

    if file_type:
        query = query.filter(Client.client_file_type == file_type)

    if search:
        query = query.outerjoin(Client.names).filter(
            (Client.client_code.ilike(f"%{search}%"))
            | (ClientName.name_value.ilike(f"%{search}%"))
        )

    query = query.offset(skip).limit(limit)
    return query.all()


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: UUID, db: Session = Depends(get_db)):
    """Get a single client with all related data."""
    client = (
        db.query(Client)
        .options(
            joinedload(Client.names),
            joinedload(Client.addresses),
            joinedload(Client.phones),
            joinedload(Client.emails),
            joinedload(Client.tax_registrations),
            joinedload(Client.income_sources),
            joinedload(Client.dates),
            joinedload(Client.connected_persons),
            joinedload(Client.personal_details),
        )
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    return client


@router.post("/", response_model=ClientResponse, status_code=201)
def create_client(client_data: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client with all related data.

    If client_code is not provided, it is auto-generated from the primary
    client name using the format: 3 UPPERCASE alpha + 4 zero-padded numeric.
    """
    # Determine client code (auto-generate or use provided)
    client_code = client_data.client_code

    if not client_code:
        # Auto-generate from primary name
        primary_name = None
        non_cap_surname = None
        for name_entry in client_data.names:
            if name_entry.is_primary or primary_name is None:
                primary_name = name_entry.name_value
                non_cap_surname = name_entry.non_capitalization_surname

        if not primary_name:
            raise HTTPException(
                status_code=422,
                detail="A client name is required to auto-generate the client code. "
                       "Please provide at least one name entry.",
            )

        client_code = generate_client_code(
            db=db,
            firm_id=DEFAULT_FIRM_ID,
            name_value=primary_name,
            non_capitalization_surname=non_cap_surname,
        )

    # Check for duplicate client code
    existing = (
        db.query(Client)
        .filter(
            Client.firm_id == DEFAULT_FIRM_ID,
            Client.client_code == client_code,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Client code '{client_code}' already exists",
        )

    # Create client
    client = Client(
        firm_id=DEFAULT_FIRM_ID,
        client_code=client_code,
        entity_type=client_data.entity_type,
        client_file_type=client_data.client_file_type,
        client_id_type=client_data.client_id_type,
        client_id_number=client_data.client_id_number,
        client_group_id=client_data.client_group_id,
        preferred_language=client_data.preferred_language,
        preferred_communication_method=client_data.preferred_communication_method,
        temporary_marker=client_data.temporary_marker,
    )
    db.add(client)
    db.flush()  # Get the client ID

    # Create related records
    for name_data in client_data.names:
        db.add(ClientName(client_id=client.id, **name_data.model_dump()))

    for addr_data in client_data.addresses:
        db.add(ClientAddress(client_id=client.id, **addr_data.model_dump()))

    for phone_data in client_data.phones:
        db.add(ClientPhone(client_id=client.id, **phone_data.model_dump()))

    for email_data in client_data.emails:
        db.add(ClientEmail(client_id=client.id, **email_data.model_dump()))

    for tax_data in client_data.tax_registrations:
        db.add(ClientTaxRegistration(client_id=client.id, **tax_data.model_dump()))

    for income_data in client_data.income_sources:
        db.add(ClientIncomeSource(client_id=client.id, **income_data.model_dump()))

    for date_data in client_data.dates:
        db.add(ClientDate(client_id=client.id, **date_data.model_dump()))

    for conn_data in client_data.connected_persons:
        db.add(ClientConnectedPerson(client_id=client.id, **conn_data.model_dump()))

    if client_data.personal_details:
        db.add(
            ClientPersonalDetails(
                client_id=client.id, **client_data.personal_details.model_dump()
            )
        )

    db.commit()
    db.refresh(client)

    # Reload with all relationships
    return get_client(client.id, db)


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: UUID, client_data: ClientUpdate, db: Session = Depends(get_db)
):
    """Update a client's core fields."""
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Update only provided fields
    update_data = client_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)

    return get_client(client.id, db)


@router.delete("/{client_id}", status_code=204)
def delete_client(client_id: UUID, db: Session = Depends(get_db)):
    """Delete a client and all related data (cascade)."""
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(client)
    db.commit()


@router.post("/preview-code")
def preview_client_code(
    name_value: str = Query(..., description="The client name to generate code from"),
    non_capitalization_surname: str | None = Query(
        None, description="Surname prefix (e.g., 'de', 'van der') to skip"
    ),
    db: Session = Depends(get_db),
):
    """Preview what the auto-generated client code would be.

    This is a read-only endpoint used by the frontend to show the user
    what client code will be generated based on their name input.
    """
    code = generate_client_code(
        db=db,
        firm_id=DEFAULT_FIRM_ID,
        name_value=name_value,
        non_capitalization_surname=non_capitalization_surname,
    )
    return {"client_code": code}
