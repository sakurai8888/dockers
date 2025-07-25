from fastapi import APIRouter, Path, Query, Body, HTTPException
from fastapi.responses import JSONResponse
import uuid


router = APIRouter(
    prefix="/getproduct",
    tags=["getproduct"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{product_id}")
async def getproduct(
    product_id: int = Path(..., title="The ID of the product to retrieve"),
    product_type: str = Query(..., title="The type of the product", description="Type of the product to filter results",required=True),
    product_name: str = Query("No Name specified", title="The name of the product", description="Name of the product to filter results"),
    price: float = Query(None, title="The price of the product", description="Price of the product to filter results"),
    quantity: int = Query(None, title="The quantity of the product", description="Quantity of the product to filter results")
):
    return {
        "product_id": product_id,
        "product_type": product_type,
        "product_name": product_name,
        "price": price,
        "quantity": quantity,
        "message": "Product details retrieved successfully.Thanks"
    }



@router.post("/{product_id}/update")
async def update_product(
    product_id: int = Path(..., title="The ID of the product to update"),
    new_data: dict = Body(..., media_type="application/json", embedded=True),
):
    product_name = new_data.get("Product Name")
    return JSONResponse({"message": f"Product {product_id} updated successfully.", "Data": product_name}, status_code=200)