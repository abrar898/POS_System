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

    # Sample Products
    products = [
        {
            "name": "Chicken Karahi",
            "description": "Traditional Pakistani chicken karahi cooked with fresh tomatoes and spices.",
            "price": 1890.0,
            "category": "Mains",
            "image_url": "https://images.unsplash.com/photo-1603894584202-933259bb0999?w=400&auto=format&fit=crop",
            "rating": 4.8,
            "badge": "Popular",
            "is_available": True,
            "stock_quantity": 50
        },
        {
            "name": "Mutton Handi",
            "description": "Creamy mutton handi slow-cooked in a clay pot.",
            "price": 2490.0,
            "category": "Mains",
            "image_url": "https://images.unsplash.com/photo-1545240000-0000-000000000000?w=400&auto=format&fit=crop",
            "rating": 4.9,
            "badge": "Chef Choice",
            "is_available": True,
            "stock_quantity": 30
        },
        {
            "name": "Chicken Tikka Pizza",
            "description": "12 inch pizza with spicy chicken tikka chunks and cheese.",
            "price": 1290.0,
            "category": "Pizza",
            "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop",
            "rating": 4.5,
            "is_available": True,
            "stock_quantity": 100
        },
        {
            "name": "Plain Naan",
            "description": "Freshly baked tandoori naan.",
            "price": 80.0,
            "category": "Breads",
            "image_url": "https://images.unsplash.com/photo-1601050648497-3f9eba95b584?w=400&auto=format&fit=crop",
            "rating": 4.7,
            "is_available": True,
            "stock_quantity": 500
        },
        {
            "name": "Sweet Lassi",
            "description": "Traditional yogurt-based sweet drink.",
            "price": 220.0,
            "category": "Drinks",
            "image_url": "https://images.unsplash.com/photo-1571115177098-24ec42ed2bb4?w=400&auto=format&fit=crop",
            "rating": 4.6,
            "is_available": True,
            "stock_quantity": 200
        }
    ]

    # Sample Waiters
    waiters = [
        {
            "name": "Ahmed Ali",
            "phone": "0300-1234567",
            "email": "ahmed@pos.com",
            "status": "active",
            "assignedTables": ["Table 01", "Table 02"],
            "joinedAt": datetime.now()
        },
        {
            "name": "Sara Khan",
            "phone": "0321-7654321",
            "email": "sara@pos.com",
            "status": "active",
            "assignedTables": ["Table 03"],
            "joinedAt": datetime.now()
        },
        {
            "name": "Bilal Sheikh",
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

    print("Seeding Products...")
    await db.products.delete_many({})
    product_results = await db.products.insert_many(products)
    product_ids = product_results.inserted_ids

    print("Seeding Waiters...")
    await db.waiters.delete_many({})
    await db.waiters.insert_many(waiters)

    print("Seeding Tables...")
    await db.tables.delete_many({})
    await db.tables.insert_many(tables)

    # Sample Orders
    orders = [
        {
            "items": [
                {"product_id": str(product_ids[0]), "product_name": "Chicken Karahi", "quantity": 1, "price": 1890.0},
                {"product_id": str(product_ids[3]), "product_name": "Plain Naan", "quantity": 2, "price": 80.0}
            ],
            "total_price": 2050.0,
            "status": "delivered",
            "table_number": "Table 02",
            "customer_name": "Walk-in Customer",
            "payment_method": "Cash",
            "type": "dine-in",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "items": [
                {"product_id": str(product_ids[2]), "product_name": "Chicken Tikka Pizza", "quantity": 2, "price": 1290.0}
            ],
            "total_price": 2580.0,
            "status": "pending",
            "customer_name": "Online Customer",
            "payment_method": "JazzCash",
            "type": "delivery",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    print("Seeding Orders...")
    await db.orders.delete_many({})
    await db.orders.insert_many(orders)

    print("Seeding Complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
