import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pos_system")

async def seed():
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Sample Products
    products = [
        {"name": "Crown Crust Pizza", "description": "Large sized pizza with kebab crust", "price": 1450.0, "category": "Pizza", "is_available": True},
        {"name": "Zinger Burger", "description": "Crunchy chicken burger", "price": 550.0, "category": "Burgers", "is_available": True},
        {"name": "Loaded Fries", "description": "Fries with cheese and mayo", "price": 350.0, "category": "Sides", "is_available": True},
        {"name": "Coke 500ml", "description": "Soft drink", "price": 120.0, "category": "Drinks", "is_available": True},
        {"name": "Malai Boti Pizza", "description": "Regular sized pizza with malai boti", "price": 850.0, "category": "Pizza", "is_available": True},
        {"name": "Chicken Wings (6pc)", "description": "Spicy chicken wings", "price": 450.0, "category": "Sides", "is_available": True},
    ]

    print("Seeding Products...")
    await db.products.delete_many({})
    product_results = await db.products.insert_many(products)
    product_ids = product_results.inserted_ids

    # Sample Orders
    orders = [
        {
            "items": [
                {"product_id": str(product_ids[0]), "product_name": "Crown Crust Pizza", "quantity": 1, "price": 1450.0},
                {"product_id": str(product_ids[1]), "product_name": "Zinger Burger", "quantity": 1, "price": 550.0}
            ],
            "total_amount": 2000.0,
            "status": "new",
            "table_number": "Table 12",
            "customer_name": "Walk-in Customer",
            "created_at": datetime.utcnow() - timedelta(minutes=15)
        },
        {
            "items": [
                {"product_id": str(product_ids[4]), "product_name": "Malai Boti Pizza", "quantity": 1, "price": 850.0},
                {"product_id": str(product_ids[5]), "product_name": "Chicken Wings (6pc)", "quantity": 1, "price": 450.0}
            ],
            "total_amount": 1300.0,
            "status": "preparing",
            "table_number": "Takeaway",
            "customer_name": "Sara",
            "created_at": datetime.utcnow() - timedelta(minutes=45)
        },
        {
            "items": [
                {"product_id": str(product_ids[2]), "product_name": "Loaded Fries", "quantity": 2, "price": 350.0}
            ],
            "total_amount": 700.0,
            "status": "ready",
            "table_number": "Delivery",
            "customer_name": "Ahmed",
            "created_at": datetime.utcnow() - timedelta(minutes=60)
        }
    ]

    print("Seeding Orders...")
    await db.orders.delete_many({})
    await db.orders.insert_many(orders)

    # Sample Waiters
    waiters = [
        {"name": "Ahmed Khan", "phone": "0300-1234567", "email": "ahmed@pos.com", "status": "active", "assignedTables": ["Table 01", "Table 02"], "joinedAt": datetime.now()},
        {"name": "Sara Malik", "phone": "0321-7654321", "email": "sara@pos.com", "status": "active", "assignedTables": ["Table 03"], "joinedAt": datetime.now()},
    ]

    print("Seeding Waiters...")
    await db.waiters.delete_many({})
    await db.waiters.insert_many(waiters)

    print("Seeding Complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
