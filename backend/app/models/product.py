from pydantic import BaseModel, Field
from typing import Optional, List

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    image_url: Optional[str] = None
    rating: float = 4.5
    badge: Optional[str] = None
    is_available: bool = True
    stock_quantity: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    badge: Optional[str] = None
    is_available: Optional[bool] = None
    stock_quantity: Optional[int] = None

class ProductInDB(ProductBase):
    id: Optional[str] = Field(alias="_id", default=None)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
