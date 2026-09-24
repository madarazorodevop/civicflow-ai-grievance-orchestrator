from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from database import Base

class ComplaintStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"

class ComplaintPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True) # e.g. CF-1042
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    
    # Location
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    address = Column(String, nullable=True)
    
    # Status and tracking
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.OPEN)
    priority = Column(Enum(ComplaintPriority), default=ComplaintPriority.MEDIUM)
    department = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    sla_deadline = Column(DateTime(timezone=True), nullable=True)
    
    # User / Submitter
    submitter_id = Column(String, nullable=True) # Could link to a User table later
    
    # Image URL
    image_url = Column(String, nullable=True)
