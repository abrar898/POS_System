import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pos_system")

async def seed():
    print(f"Connecting to {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Sample Waiters
    waiters = [
        {
            "name": "Ahmed Khan",
            "phone": "0300-1234567",
            "email": "ahmed@pos.com",
            "status": "active",
            "assignedTables": ["Table 01", "Table 02"],
            "joinedAt": datetime.now()
        },
        {
            "name": "Sara Malik",
            "phone": "0321-7654321",
            "email": "sara@pos.com",
            "status": "active",
            "assignedTables": ["Table 03"],
            "joinedAt": datetime.now()
        },
        {
            "name": "Bilal Raza",
            "phone": "0311-9988776",
            "email": "bilal@pos.com",
            "status": "inactive",
            "assignedTables": [],
            "joinedAt": datetime.now()
        }
    ]

    # Sample Tables
    tables = [
        {"number": "Table 01", "capacity": 4, "section": "Main Hall", "status": "available"},
        {"number": "Table 02", "capacity": 2, "section": "Window Side", "status": "occupied"},
        {"number": "Table 03", "capacity": 6, "section": "Main Hall", "status": "reserved"},
        {"number": "Table 04", "capacity": 4, "section": "Main Hall", "status": "available"},
        {"number": "Table 05", "capacity": 4, "section": "Terrace", "status": "available"},
    ]

    print("Seeding Waiters...")
    await db.waiters.delete_many({})
    await db.waiters.insert_many(waiters)

    print("Seeding Tables...")
    await db.tables.delete_many({})
    await db.tables.insert_many(tables)

    print("Seeding Complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
