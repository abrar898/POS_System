from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..db.mongodb import get_database
from ..models.waiter import Waiter, WaiterCreate, WaiterUpdate
from ..crud import waiter as waiter_crud

router = APIRouter()

@router.get("/", response_model=List[Waiter])
async def get_waiters():
    db = get_database()
    return await waiter_crud.get_all_waiters(db)

@router.post("/", response_model=Waiter)
async def create_waiter(waiter: WaiterCreate = Body(...)):
    db = get_database()
    return await waiter_crud.create_waiter(db, waiter)

@router.put("/{waiter_id}", response_model=Waiter)
async def update_waiter(waiter_id: str, waiter: WaiterUpdate = Body(...)):
    db = get_database()
    updated = await waiter_crud.update_waiter(db, waiter_id, waiter)
    if not updated:
        raise HTTPException(status_code=404, detail="Waiter not found or no update data")
    return updated

@router.delete("/{waiter_id}")
async def delete_waiter(waiter_id: str):
    db = get_database()
    success = await waiter_crud.delete_waiter(db, waiter_id)
    if not success:
        raise HTTPException(status_code=404, detail="Waiter not found")
    return {"message": "Waiter deleted successfully"}
