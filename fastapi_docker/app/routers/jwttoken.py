from app.core.security import create_access_token, verify_password, get_password_hash, verify_jwt_token
from fastapi import APIRouter, Depends, HTTPException, status,Body


router = APIRouter()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"


@router.post("/token")
async def login(data_body: dict):
    token = create_access_token(data_body.get("mybody"), data_body.get("password_input"))
    return {"token": token}



@router.post("/verify_jwt")
async def verifyjwt(data: dict = Body(...)):
    tokenvalue = data.get("mytoken")
    verify_jwt_results = verify_jwt_token(tokenvalue)
    return {str(verify_jwt_results)}

