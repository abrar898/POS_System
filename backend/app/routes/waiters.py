from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..db.mongodb import get_database
from ..models.waiter import Waiter, WaiterCreate, WaiterUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Waiter])
async def get_waiters():
    db = get_database()
    waiters = await db.waiters.find().to_list(1000)
    for waiter in waiters:
        waiter["_id"] = str(waiter["_id"])
    return waiters

@router.post("/", response_model=Waiter)
async def create_waiter(waiter: WaiterCreate = Body(...)):
    db = get_database()
    waiter_dict = waiter.dict()
    waiter_dict["joinedAt"] = datetime.now()
    new_waiter = await db.waiters.insert_one(waiter_dict)
    created_waiter = await db.waiters.find_one({"_id": new_waiter.inserted_id})
    created_waiter["_id"] = str(created_waiter["_id"])
    return created_waiter

@router.put("/{waiter_id}", response_model=Waiter)
async def update_waiter(waiter_id: str, waiter: WaiterUpdate = Body(...)):
    db = get_database()
    update_data = {k: v for k, v in waiter.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.waiters.update_one(
        {"_id": ObjectId(waiter_id)}, {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Waiter not found")
    
    updated_waiter = await db.waiters.find_one({"_id": ObjectId(waiter_id)})
    updated_waiter["_id"] = str(updated_waiter["_id"])
    return updated_waiter

@router.delete("/{waiter_id}")
async def delete_waiter(waiter_id: str):
    db = get_database()
    result = await db.waiters.delete_one({"_id": ObjectId(waiter_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Waiter not found")
    return {"message": "Waiter deleted successfully"}
