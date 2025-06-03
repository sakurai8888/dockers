from fastapi import APIRouter


router = APIRouter(
    prefix="/myotherroutes",
    tags=["myotherroutes"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def read_my_other_routes():
    return {"message": "This is another route in myotherroutes.py"} 