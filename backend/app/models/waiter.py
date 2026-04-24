from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class WaiterBase(BaseModel):
    name: str
    phone: str
    email: str
    status: str = "active"
    assignedTables: List[str] = []

class WaiterCreate(WaiterBase):
    pass

class WaiterUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None
    assignedTables: Optional[List[str]] = None

class Waiter(WaiterBase):
    id: str = Field(alias="_id")
    joinedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
