from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models import ComplaintStatus, ComplaintPriority

class ComplaintBase(BaseModel):
    title: str = Field(..., example="Large Pothole on Main St")
    description: str = Field(..., example="There is a large pothole in the right lane.")
    category: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    image_url: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintResponse(ComplaintBase):
    id: int
    reference_id: str
    status: ComplaintStatus
    priority: ComplaintPriority
    department: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    sla_deadline: Optional[datetime] = None
    
    class Config:
        from_attributes = True
