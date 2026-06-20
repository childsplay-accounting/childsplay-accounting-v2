"""Client model — the central entity in the Client Information Database."""

import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, ForeignKey, DateTime, UniqueConstraint, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import (
    EntityType,
    ClientFileType,
    ClientIdType,
    PreferredLanguage,
    PreferredCommunicationMethod,
)


class Client(Base):
    __tablename__ = "clients"
    __table_args__ = (UniqueConstraint("firm_id", "client_code"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    firm_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("firms.id"), nullable=False)
    client_group_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("client_groups.id"), nullable=True
    )
    client_code: Mapped[str] = mapped_column(String(20), nullable=False)
    entity_type: Mapped[EntityType] = mapped_column(
        Enum(EntityType, native_enum=False, length=100), nullable=False
    )
    client_file_type: Mapped[ClientFileType] = mapped_column(
        Enum(ClientFileType, native_enum=False, length=50), nullable=False
    )
    client_id_type: Mapped[ClientIdType | None] = mapped_column(
        Enum(ClientIdType, native_enum=False, length=50), nullable=True
    )
    client_id_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    preferred_language: Mapped[PreferredLanguage] = mapped_column(
        Enum(PreferredLanguage, native_enum=False, length=50),
        default=PreferredLanguage.ENGLISH,
    )
    preferred_communication_method: Mapped[PreferredCommunicationMethod] = mapped_column(
        Enum(PreferredCommunicationMethod, native_enum=False, length=50),
        default=PreferredCommunicationMethod.EMAIL,
    )
    temporary_marker: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    firm = relationship("Firm", back_populates="clients")
    client_group = relationship("ClientGroup", back_populates="clients")
    names = relationship("ClientName", back_populates="client", cascade="all, delete-orphan")
    addresses = relationship("ClientAddress", back_populates="client", cascade="all, delete-orphan")
    phones = relationship("ClientPhone", back_populates="client", cascade="all, delete-orphan")
    emails = relationship("ClientEmail", back_populates="client", cascade="all, delete-orphan")
    tax_registrations = relationship(
        "ClientTaxRegistration", back_populates="client", cascade="all, delete-orphan"
    )
    income_sources = relationship(
        "ClientIncomeSource", back_populates="client", cascade="all, delete-orphan"
    )
    dates = relationship("ClientDate", back_populates="client", cascade="all, delete-orphan")
    connected_persons = relationship(
        "ClientConnectedPerson",
        back_populates="client",
        foreign_keys="[ClientConnectedPerson.client_id]",
        cascade="all, delete-orphan",
    )
    personal_details = relationship(
        "ClientPersonalDetails", back_populates="client", uselist=False, cascade="all, delete-orphan"
    )
