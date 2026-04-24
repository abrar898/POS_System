from fastapi import APIRouter, HTTPException, status
from typing import List
from ..crud import order as order_crud
from ..models.order import OrderCreate, OrderUpdate, OrderInDB

router = APIRouter()

@router.get("/", response_model=List[OrderInDB])
async def read_orders():
    return await order_crud.get_orders()

@router.get("/{order_id}", response_model=OrderInDB)
async def read_order(order_id: str):
    order = await order_crud.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderInDB, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate):
    return await order_crud.create_order(order)

@router.put("/{order_id}", response_model=OrderInDB)
async def update_order(order_id: str, order: OrderUpdate):
    updated_order = await order_crud.update_order(order_id, order)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated_order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: str):
    deleted = await order_crud.delete_order(order_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return None
