"""Client Tax Registration model — supports multiple tax registrations per client."""

import uuid

from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import TaxType, TaxStatus, VatPeriod


class ClientTaxRegistration(Base):
    __tablename__ = "client_tax_registrations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    tax_type: Mapped[TaxType] = mapped_column(
        Enum(TaxType, native_enum=False, length=100), nullable=False
    )
    tax_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    tax_status: Mapped[TaxStatus] = mapped_column(
        Enum(TaxStatus, native_enum=False, length=50), nullable=False
    )
    vat_registration: Mapped[str | None] = mapped_column(String(50), nullable=True)
    vat_period: Mapped[VatPeriod | None] = mapped_column(
        Enum(VatPeriod, native_enum=False, length=100), nullable=True
    )
    efiling_client_code: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Relationships
    client = relationship("Client", back_populates="tax_registrations")
