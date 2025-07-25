from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    tax: Optional[float] = None


fake_items_db = {"plumbus": {"name": "Plumbus", "price": 10.99}, "gun": {"name": "Portal Gun", "price": 99.99}}


@router.get("/", response_model=List[Item])
async def read_items():
    return [Item(**item) for item in fake_items_db.values()]




@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    if item.name.lower() in fake_items_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item already exists"
        )
    fake_items_db[item.name.lower()] = item.dict()
    return item


@router.get("/{item_id}", response_model=Item)
async def read_item(item_id: str):
    if item_id not in fake_items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return Item(**fake_items_db[item_id])


@router.put("/{item_id}")
async def update_item(item_id: str, item: ItemUpdate):
    if item_id not in fake_items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    stored_item = fake_items_db[item_id]
    update_data = item.dict(exclude_unset=True)
    updated_item = {**stored_item, **update_data}
    fake_items_db[item_id] = updated_item
    return updated_item


@router.delete("/{item_id}")
async def delete_item(item_id: str):
    if item_id not in fake_items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    del fake_items_db[item_id]
    return {"message": "Item deleted successfully"}