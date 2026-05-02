from typing import List, Optional
from bson import ObjectId
from ..models.waiter import WaiterCreate, WaiterUpdate
from datetime import datetime

async def get_all_waiters(db) -> List[dict]:
    waiters = await db.waiters.find().to_list(1000)
    for waiter in waiters:
        waiter["_id"] = str(waiter["_id"])
    return waiters

async def create_waiter(db, waiter: WaiterCreate) -> dict:
    waiter_dict = waiter.dict()
    waiter_dict["joinedAt"] = datetime.now()
    new_waiter = await db.waiters.insert_one(waiter_dict)
    created_waiter = await db.waiters.find_one({"_id": new_waiter.inserted_id})
    created_waiter["_id"] = str(created_waiter["_id"])
    return created_waiter

async def update_waiter(db, waiter_id: str, waiter: WaiterUpdate) -> Optional[dict]:
    update_data = {k: v for k, v in waiter.dict().items() if v is not None}
    if not update_data:
        return None
    
    result = await db.waiters.update_one(
        {"_id": ObjectId(waiter_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        return None
    
    updated_waiter = await db.waiters.find_one({"_id": ObjectId(waiter_id)})
    updated_waiter["_id"] = str(updated_waiter["_id"])
    return updated_waiter

async def delete_waiter(db, waiter_id: str) -> bool:
    result = await db.waiters.delete_one({"_id": ObjectId(waiter_id)})
    return result.deleted_count > 0
