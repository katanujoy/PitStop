# app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str  # "driver" or "mechanic"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

class MechanicProfileBase(BaseModel):
    services: str
    rates: float
    is_available: Optional[bool] = True

class MechanicProfileCreate(MechanicProfileBase):
    pass

class MechanicProfileResponse(MechanicProfileBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class RequestCreate(BaseModel):
    latitude: float
    longitude: float

class RequestResponse(BaseModel):
    id: int
    driver_id: int
    mechanic_id: Optional[int]
    status: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str

class ChatMessageBase(BaseModel):
    request_id: int
    content: str
    receiver_id: int

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    sender_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True