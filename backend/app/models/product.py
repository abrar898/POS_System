from typing import Optional, List
from pydantic import Field
from ..db.base import MongoBaseModel

class ProductBase(MongoBaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True
    stock_quantity: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None

class ProductInDB(ProductBase):
    pass
