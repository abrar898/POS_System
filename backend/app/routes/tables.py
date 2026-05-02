from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..db.mongodb import get_database
from ..models.table import Table, TableCreate, TableUpdate
from ..crud import table as table_crud

router = APIRouter()

@router.get("/", response_model=List[Table])
async def get_tables():
    db = get_database()
    return await table_crud.get_all_tables(db)

@router.post("/", response_model=Table)
async def create_table(table: TableCreate = Body(...)):
    db = get_database()
    return await table_crud.create_table(db, table)

@router.put("/{table_id}", response_model=Table)
async def update_table(table_id: str, table: TableUpdate = Body(...)):
    db = get_database()
    updated = await table_crud.update_table(db, table_id, table)
    if not updated:
        raise HTTPException(status_code=404, detail="Table not found")
    return updated

@router.delete("/{table_id}")
async def delete_table(table_id: str):
    db = get_database()
    success = await table_crud.delete_table(db, table_id)
    if not success:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table deleted successfully"}
