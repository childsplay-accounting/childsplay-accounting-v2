"""Client Date model — official dates (birthday, registration, year-end, etc.)."""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import OfficialDateType, YearEndMonth


class ClientDate(Base):
    __tablename__ = "client_dates"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    date_type: Mapped[OfficialDateType] = mapped_column(
        Enum(OfficialDateType, native_enum=False, length=50), nullable=False
    )
    date_value: Mapped[date] = mapped_column(Date, nullable=False)
    year_end_month: Mapped[YearEndMonth | None] = mapped_column(
        Enum(YearEndMonth, native_enum=False, length=20), nullable=True
    )

    # Relationships
    client = relationship("Client", back_populates="dates")
