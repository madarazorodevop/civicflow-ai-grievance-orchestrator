from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    role: str = "client"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    image_url: Optional[str] = None

class Complaint(BaseModel):
    id: str
    user_id: int
    title: str
    description: str
    category: str
    image_url: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    address: Optional[str]
    status: str
    riskLevel: Optional[str] = None
    riskReason: Optional[str] = None
    priority: Optional[str] = None
    analyzedAt: Optional[datetime] = None
    eta: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True

class ComplaintUpdate(BaseModel):
    status: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
