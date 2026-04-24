from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..db.mongodb import get_database
from ..models.table import Table, TableCreate, TableUpdate
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[Table])
async def get_tables():
    db = get_database()
    tables = await db.tables.find().to_list(1000)
    for table in tables:
        table["_id"] = str(table["_id"])
    return tables

@router.post("/", response_model=Table)
async def create_table(table: TableCreate = Body(...)):
    db = get_database()
    table_dict = table.dict()
    new_table = await db.tables.insert_one(table_dict)
    created_table = await db.tables.find_one({"_id": new_table.inserted_id})
    created_table["_id"] = str(created_table["_id"])
    return created_table

@router.put("/{table_id}", response_model=Table)
async def update_table(table_id: str, table: TableUpdate = Body(...)):
    db = get_database()
    update_data = {k: v for k, v in table.dict().items() if v is not None}
    
    result = await db.tables.update_one(
        {"_id": ObjectId(table_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")
    
    updated_table = await db.tables.find_one({"_id": ObjectId(table_id)})
    updated_table["_id"] = str(updated_table["_id"])
    return updated_table

@router.delete("/{table_id}")
async def delete_table(table_id: str):
    db = get_database()
    result = await db.tables.delete_one({"_id": ObjectId(table_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table deleted successfully"}
