from pydantic import BaseModel, Field
from typing import Optional

class TableBase(BaseModel):
    number: str
    capacity: int
    section: str
    status: str = "available"
    assignedWaiterId: Optional[str] = None

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    number: Optional[str] = None
    capacity: Optional[int] = None
    section: Optional[str] = None
    status: Optional[str] = None
    assignedWaiterId: Optional[str] = None

class Table(TableBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
