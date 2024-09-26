import uuid
from datetime import datetime, timezone
from typing import List

from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class InquiryBase(SQLModel):
    text: str = Field(min_length=10, max_length=255)


class InquiryCreate(InquiryBase):
    text: str = Field(min_length=10, max_length=255)


# Database model, database table inferred from class name
class Inquiry(InquiryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(min_length=10, max_length=255, unique=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Properties to return via API, id is always required
class InquiryPublic(InquiryBase):
    id: uuid.UUID
    text: str
    created_at: datetime


class InquriesPublic(SQLModel):
    data: list[InquiryPublic]
    count: int


# Schema
# https://lucid.app/lucidchart/2d988dda-8c81-4024-9cfe-33e23521288b/edit?invitationId=inv_32e97de0-7f01-43aa-85d3-72ad0b6e1f2b&page=0_0#
