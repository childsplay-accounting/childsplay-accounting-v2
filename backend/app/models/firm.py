"""Firm model — supports multi-firm usage."""

import uuid
from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Firm(Base):
    __tablename__ = "firms"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    firm_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    firm_name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    client_groups = relationship("ClientGroup", back_populates="firm")
    clients = relationship("Client", back_populates="firm")
    contact_persons = relationship("ContactPerson", back_populates="firm")
