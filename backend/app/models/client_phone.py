"""Client Phone model — supports multiple phone numbers per client."""

import uuid

from sqlalchemy import String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import PhoneType


class ClientPhone(Base):
    __tablename__ = "client_phones"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    phone_type: Mapped[PhoneType] = mapped_column(
        Enum(PhoneType, native_enum=False, length=50), nullable=False
    )
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    client = relationship("Client", back_populates="phones")
