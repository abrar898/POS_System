from typing import List, Optional
from bson import ObjectId
from ..db.mongodb import get_database
from ..models.product import ProductCreate, ProductUpdate, ProductInDB

COLLECTION_NAME = "products"

async def get_products() -> List[ProductInDB]:
    db = get_database()
    cursor = db[COLLECTION_NAME].find()
    products = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        products.append(ProductInDB(**document))
    return products

async def get_product(product_id: str) -> Optional[ProductInDB]:
    db = get_database()
    document = await db[COLLECTION_NAME].find_one({"_id": ObjectId(product_id)})
    if document:
        document["_id"] = str(document["_id"])
        return ProductInDB(**document)
    return None

async def create_product(product: ProductCreate) -> ProductInDB:
    db = get_database()
    product_dict = product.model_dump(by_alias=True, exclude={"id"})
    result = await db[COLLECTION_NAME].insert_one(product_dict)
    product_dict["_id"] = str(result.inserted_id)
    return ProductInDB(**product_dict)

async def update_product(product_id: str, product: ProductUpdate) -> Optional[ProductInDB]:
    db = get_database()
    update_data = product.model_dump(by_alias=True, exclude_unset=True, exclude={"id"})
    await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    return await get_product(product_id)

async def delete_product(product_id: str) -> bool:
    db = get_database()
    result = await db[COLLECTION_NAME].delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0
