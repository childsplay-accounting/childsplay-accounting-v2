"""Client Connected Person model — relationships between clients and other people."""

import uuid

from sqlalchemy import ForeignKey, Enum, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship as sa_relationship

from app.database import Base
from app.models.enums import ConnectedPersonRelationship


class ClientConnectedPerson(Base):
    __tablename__ = "client_connected_persons"
    __table_args__ = (
        CheckConstraint(
            "(connected_client_id IS NOT NULL AND contact_person_id IS NULL) OR "
            "(connected_client_id IS NULL AND contact_person_id IS NOT NULL)",
            name="check_one_reference",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), nullable=False)
    connected_client_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("clients.id"), nullable=True
    )
    contact_person_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("contact_persons.id"), nullable=True
    )
    relationship_type: Mapped[ConnectedPersonRelationship] = mapped_column(
        "relationship",
        Enum(ConnectedPersonRelationship, native_enum=False, length=50),
        nullable=False,
    )

    # ORM relationships
    client = sa_relationship(
        "Client",
        back_populates="connected_persons",
        foreign_keys="[ClientConnectedPerson.client_id]",
    )
    connected_client = sa_relationship(
        "Client",
        foreign_keys="[ClientConnectedPerson.connected_client_id]",
    )
    contact_person = sa_relationship("ContactPerson")
