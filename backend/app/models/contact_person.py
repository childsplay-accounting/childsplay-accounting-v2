"""Contact Person model — third-party contacts (not full clients)."""

import uuid

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ContactPerson(Base):
    __tablename__ = "contact_persons"
    __table_args__ = (UniqueConstraint("firm_id", "contact_code"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    firm_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("firms.id"), nullable=False)
    contact_code: Mapped[str] = mapped_column(String(20), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email_address: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationships
    firm = relationship("Firm", back_populates="contact_persons")
