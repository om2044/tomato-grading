from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.model import User
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter()

# Data models for what the API expects to receive
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Hash the password and save to DB
    hashed_password = get_password_hash(user.password)
    REAL_TENANT_ID = "4535d643-2fc6-47e1-9e2a-21f2e4fc14b1"
    new_user = User(email=user.email, 
                    hashed_pwd=hashed_password,
                    tenant_id=REAL_TENANT_ID)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully. You can now log in!"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    # 2. Check if user exists AND password matches
    if not db_user or not verify_password(user.password, db_user.hashed_pwd):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # 3. Create the JWT Token
    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role, "tenant_id": str(db_user.tenant_id)})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role
        }
    }