from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

# In serverless environments like Vercel, we initialize the client at the module level.
# Motor's AsyncIOMotorClient doesn't block and will connect on demand.
client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]

async def connect_to_mongo():
    # Keep for compatibility with main.py if needed, but the client is already initialized
    logging.info("MongoDB client initialized at module level")
    pass

async def close_mongo_connection():
    # Serverless functions don't usually need explicit closure, but we'll keep it
    client.close()

def get_database():
    return database
