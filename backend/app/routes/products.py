from fastapi import APIRouter, HTTPException, status
from typing import List
from ..crud import product as product_crud
from ..models.product import ProductCreate, ProductUpdate, ProductInDB

router = APIRouter()

@router.get("/", response_model=List[ProductInDB])
async def read_products():
    return await product_crud.get_products()

@router.get("/{product_id}", response_model=ProductInDB)
async def read_product(product_id: str):
    product = await product_crud.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductInDB, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    return await product_crud.create_product(product)

@router.put("/{product_id}", response_model=ProductInDB)
async def update_product(product_id: str, product: ProductUpdate):
    updated_product = await product_crud.update_product(product_id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: str):
    deleted = await product_crud.delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
