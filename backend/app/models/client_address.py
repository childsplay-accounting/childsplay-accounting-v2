"""Client Address model — supports multiple addresses per client."""

import uuid

from sqlalchemy import String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import AddressType


class ClientAddress(Base):
    __tablename__ = "client_addresses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    address_type: Mapped[AddressType] = mapped_column(
        Enum(AddressType, native_enum=False, length=50), nullable=False
    )
    complex_unit_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    complex_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    street_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    street_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    suburb: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str | None] = mapped_column(String(255), nullable=True)
    postal_code: Mapped[str | None] = mapped_column(String(10), nullable=True)
    province: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), default="South Africa")
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    client = relationship("Client", back_populates="addresses")
