from typing import Annotated
from fastapi import FastAPI, File, Form, UploadFile, APIRouter

router = APIRouter(
    prefix="/uploadfiles",
    tags=["uploadfiles"],
    responses={404: {"description": "Not found"}},
)



@router.post("/")
async def create_file(
    file: UploadFile = File(..., content_type="application/octet-stream")
):
    return {"filename": file.filename,
            "filezie": file.size, 
            "content_type": file.content_type}