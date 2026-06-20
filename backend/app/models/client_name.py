"""Client Name model — supports multiple names per client (surname, trading name, etc.)."""

import uuid

from sqlalchemy import String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import NameType, IndividualTitle


class ClientName(Base):
    __tablename__ = "client_names"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    name_type: Mapped[NameType] = mapped_column(
        Enum(NameType, native_enum=False, length=50), nullable=False
    )
    name_value: Mapped[str] = mapped_column(String(255), nullable=False)
    individual_title: Mapped[IndividualTitle | None] = mapped_column(
        Enum(IndividualTitle, native_enum=False, length=20), nullable=True
    )
    non_capitalization_surname: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    client = relationship("Client", back_populates="names")
