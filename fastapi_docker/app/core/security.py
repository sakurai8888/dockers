# app/core/security.py
from datetime import datetime, timedelta
from jose import jwt,JWTError
from passlib.context import CryptContext
import os

# Configuration (load from environment variables)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

system_password = pwd_context.hash("mysystemstrongpassword")

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check password against hash"""
    return pwd_context.verify(plain_password, hashed_password)



def create_access_token(data: dict, password_input: str, expires_delta: timedelta = None) -> str:
    """Generate JWT token with expiration"""
    if (verify_password(password_input, system_password)):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    else:
        return ("Invalid password, token not created")


def verify_jwt_token(token: str) -> str:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return (payload)
    except JWTError as e:
        return "Error of the token"