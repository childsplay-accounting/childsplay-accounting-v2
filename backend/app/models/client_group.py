"""Client Group model — for grouping related entities (e.g., holding companies)."""

import uuid

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ClientGroup(Base):
    __tablename__ = "client_groups"
    __table_args__ = (UniqueConstraint("firm_id", "group_code"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    firm_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("firms.id"), nullable=False)
    group_code: Mapped[str] = mapped_column(String(20), nullable=False)
    group_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    firm = relationship("Firm", back_populates="client_groups")
    clients = relationship("Client", back_populates="client_group")
