from typing import Optional, List
from datetime import datetime
from pydantic import Field
from ..db.base import MongoBaseModel

class OrderItem(MongoBaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class OrderBase(MongoBaseModel):
    items: List[OrderItem]
    total_amount: float
    status: str = "pending" # pending, preparing, ready, completed, cancelled
    table_number: Optional[str] = None
    customer_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(OrderBase):
    pass

class OrderUpdate(OrderBase):
    items: Optional[List[OrderItem]] = None
    total_amount: Optional[float] = None
    status: Optional[str] = None

class OrderInDB(OrderBase):
    pass
