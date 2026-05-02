from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "POS System API"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "pos_system"
    DEBUG: bool = True
    
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
