from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.mongodb import connect_to_mongo, close_mongo_connection
from .core.config import settings
from .routes import products, orders, waiters, tables

app = FastAPI(title=settings.PROJECT_NAME, debug=settings.DEBUG)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to the POS System API", "status": "running"}

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(waiters.router, prefix="/api/waiters", tags=["waiters"])
app.include_router(tables.router, prefix="/api/tables", tags=["tables"])
