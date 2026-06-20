"""Client Income Source model — trading names and business descriptions."""

import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ClientIncomeSource(Base):
    __tablename__ = "client_income_sources"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    trading_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    occupation_description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    client = relationship("Client", back_populates="income_sources")
