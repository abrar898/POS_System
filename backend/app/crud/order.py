from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from ..db.mongodb import get_database
from ..models.order import OrderCreate, OrderUpdate, OrderInDB

COLLECTION_NAME = "orders"

async def get_orders() -> List[OrderInDB]:
    db = get_database()
    cursor = db[COLLECTION_NAME].find().sort("created_at", -1)
    orders = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        orders.append(OrderInDB(**document))
    return orders

async def get_order(order_id: str) -> Optional[OrderInDB]:
    db = get_database()
    if not ObjectId.is_valid(order_id):
        return None
    document = await db[COLLECTION_NAME].find_one({"_id": ObjectId(order_id)})
    if document:
        document["_id"] = str(document["_id"])
        return OrderInDB(**document)
    return None

async def create_order(order: OrderCreate) -> OrderInDB:
    db = get_database()
    order_dict = order.model_dump(by_alias=True, exclude={"id"})
    order_dict["created_at"] = datetime.utcnow()
    order_dict["updated_at"] = datetime.utcnow()
    result = await db[COLLECTION_NAME].insert_one(order_dict)
    order_dict["_id"] = str(result.inserted_id)
    return OrderInDB(**order_dict)

async def update_order(order_id: str, order: OrderUpdate) -> Optional[OrderInDB]:
    db = get_database()
    if not ObjectId.is_valid(order_id):
        return None
    update_data = order.model_dump(by_alias=True, exclude_unset=True, exclude={"id"})
    update_data["updated_at"] = datetime.utcnow()
    await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(order_id)},
        {"$set": update_data}
    )
    return await get_order(order_id)

async def delete_order(order_id: str) -> bool:
    db = get_database()
    if not ObjectId.is_valid(order_id):
        return False
    result = await db[COLLECTION_NAME].delete_one({"_id": ObjectId(order_id)})
    return result.deleted_count > 0
