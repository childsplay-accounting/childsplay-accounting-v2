"""Client Personal Details model — one-to-one personal info (marital status, domain)."""

import uuid

from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import MaritalStatus


class ClientPersonalDetails(Base):
    __tablename__ = "client_personal_details"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("clients.id"), unique=True, nullable=False
    )
    marital_status: Mapped[MaritalStatus | None] = mapped_column(
        Enum(MaritalStatus, native_enum=False, length=100), nullable=True
    )
    spouse_contact_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    domain: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationships
    client = relationship("Client", back_populates="personal_details")
