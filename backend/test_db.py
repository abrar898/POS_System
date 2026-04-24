import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def test():
    url = os.getenv("MONGODB_URL")
    print(f"Testing connection to {url}")
    client = AsyncIOMotorClient(url)
    db = client[os.getenv("DATABASE_NAME")]
    try:
        count = await db.waiters.count_documents({})
        print(f"Connection successful! Waiter count: {count}")
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test())
