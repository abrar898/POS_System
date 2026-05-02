from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    product_name: Optional[str] = None
    quantity: int
    price: float

class OrderBase(BaseModel):
    items: List[OrderItem]
    total_price: float
    status: str = "pending" # pending, preparing, dispatched, delivered, cancelled
    table_number: Optional[str] = None
    customer_name: Optional[str] = None
    payment_method: Optional[str] = "Cash"
    type: Optional[str] = "dine-in" # dine-in, delivery, takeaway
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    items: Optional[List[OrderItem]] = None
    total_price: Optional[float] = None
    status: Optional[str] = None
    table_number: Optional[str] = None
    customer_name: Optional[str] = None
    payment_method: Optional[str] = None
    type: Optional[str] = None

class OrderInDB(OrderBase):
    id: Optional[str] = Field(alias="_id", default=None)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
