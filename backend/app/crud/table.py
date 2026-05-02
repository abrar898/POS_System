from typing import List, Optional
from bson import ObjectId
from ..models.table import TableCreate, TableUpdate

async def get_all_tables(db) -> List[dict]:
    tables = await db.tables.find().to_list(1000)
    for table in tables:
        table["_id"] = str(table["_id"])
    return tables

async def create_table(db, table: TableCreate) -> dict:
    table_dict = table.dict()
    new_table = await db.tables.insert_one(table_dict)
    created_table = await db.tables.find_one({"_id": new_table.inserted_id})
    created_table["_id"] = str(created_table["_id"])
    return created_table

async def update_table(db, table_id: str, table: TableUpdate) -> Optional[dict]:
    update_data = {k: v for k, v in table.dict().items() if v is not None}
    if not update_data:
        return None
    
    result = await db.tables.update_one(
        {"_id": ObjectId(table_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        return None
    
    updated_table = await db.tables.find_one({"_id": ObjectId(table_id)})
    updated_table["_id"] = str(updated_table["_id"])
    return updated_table

async def delete_table(db, table_id: str) -> bool:
    result = await db.tables.delete_one({"_id": ObjectId(table_id)})
    return result.deleted_count > 0
