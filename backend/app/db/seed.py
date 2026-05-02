import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import sys

# Add the backend directory to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.core.config import settings

async def seed_data():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    # 1. Seed Products
    print("Seeding products...")
    await db.products.delete_many({})
    products = [
        {
            "name": "Chicken Karahi",
            "description": "Traditional Pakistani style chicken karahi with fresh ginger and green chilies.",
            "price": 1250,
            "category": "Main Course",
            "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop",
            "rating": 4.8,
            "badge": "Best Seller",
            "is_available": True,
            "stock_quantity": 50
        },
        {
            "name": "Beef Seekh Kabab",
            "description": "Succulent minced beef skewers grilled to perfection.",
            "price": 850,
            "category": "Starters",
            "image_url": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop",
            "rating": 4.7,
            "badge": "Hot",
            "is_available": True,
            "stock_quantity": 40
        },
        {
            "name": "Mutton Biryani",
            "description": "Fragrant basmati rice cooked with tender mutton and traditional spices.",
            "price": 1450,
            "category": "Rice",
            "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop",
            "rating": 4.9,
            "badge": "Chef Choice",
            "is_available": True,
            "stock_quantity": 30
        },
        {
            "name": "Garlic Naan",
            "description": "Soft and fluffy oven-baked flatbread with garlic butter.",
            "price": 120,
            "category": "Sides",
            "image_url": "https://images.unsplash.com/photo-1601050633647-81a35137d286?w=500&auto=format&fit=crop",
            "rating": 4.5,
            "is_available": True,
            "stock_quantity": 100
        },
        {
            "name": "Peshawari Chappal Kebab",
            "description": "Pashtun-style minced kebab, usually made from ground beef or mutton with various spices.",
            "price": 950,
            "category": "Main Course",
            "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop",
            "rating": 4.6,
            "is_available": True,
            "stock_quantity": 25
        }
    ]
    await db.products.insert_many(products)

    # 2. Seed Waiters
    print("Seeding waiters...")
    await db.waiters.delete_many({})
    waiters = [
        {"name": "Ahmed Ali", "phone": "0300-1234567", "email": "ahmed@example.com", "shift": "morning", "status": "active", "joinedAt": datetime.now()},
        {"name": "Sara Khan", "phone": "0311-9876543", "email": "sara@example.com", "shift": "evening", "status": "active", "joinedAt": datetime.now()},
        {"name": "Bilal Sheikh", "phone": "0322-1112223", "email": "bilal@example.com", "shift": "night", "status": "active", "joinedAt": datetime.now()},
        {"name": "Zainab Abbas", "phone": "0333-4445556", "email": "zainab@example.com", "shift": "evening", "status": "active", "joinedAt": datetime.now()},
        {"name": "Hamza Yousaf", "phone": "0344-7778889", "email": "hamza@example.com", "shift": "morning", "status": "on_leave", "joinedAt": datetime.now()}
    ]
    await db.waiters.insert_many(waiters)

    # 3. Seed Tables
    print("Seeding tables...")
    await db.tables.delete_many({})
    tables = [
        {"number": 1, "capacity": 2, "status": "available", "location": "indoor"},
        {"number": 2, "capacity": 4, "status": "available", "location": "indoor"},
        {"number": 3, "capacity": 4, "status": "occupied", "location": "outdoor"},
        {"number": 4, "capacity": 6, "status": "available", "location": "terrace"},
        {"number": 5, "capacity": 8, "status": "reserved", "location": "indoor"},
        {"number": 6, "capacity": 2, "status": "available", "location": "indoor"},
        {"number": 7, "capacity": 4, "status": "occupied", "location": "indoor"},
        {"number": 8, "capacity": 4, "status": "available", "location": "outdoor"},
        {"number": 9, "capacity": 6, "status": "reserved", "location": "terrace"},
        {"number": 10, "capacity": 12, "status": "available", "location": "family_hall"}
    ]
    await db.tables.insert_many(tables)

    # 4. Seed Orders (Optional, but good for testing dashboard)
    print("Seeding orders...")
    await db.orders.delete_many({})
    # Get a sample product ID
    sample_product = await db.products.find_one()
    orders = [
        {
            "customer_name": "Ethan Blake",
            "items": [{"product_id": str(sample_product["_id"]), "quantity": 2, "price": sample_product["price"]}],
            "total_price": sample_product["price"] * 2,
            "status": "delivered",
            "payment_method": "Cash",
            "type": "delivery",
            "created_at": datetime.now()
        },
        {
            "customer_name": "Sara Malik",
            "items": [{"product_id": str(sample_product["_id"]), "quantity": 1, "price": sample_product["price"]}],
            "total_price": sample_product["price"],
            "status": "preparing",
            "payment_method": "Card",
            "type": "delivery",
            "created_at": datetime.now()
        }
    ]
    await db.orders.insert_many(orders)

    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
