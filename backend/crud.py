from sqlalchemy.orm import Session
import models, schemas
import uuid
from datetime import datetime, timedelta

def get_complaint(db: Session, complaint_id: int):
    return db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()

def get_complaint_by_reference(db: Session, reference_id: str):
    return db.query(models.Complaint).filter(models.Complaint.reference_id == reference_id).first()

def get_complaints(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).offset(skip).limit(limit).all()

def create_complaint(db: Session, complaint: schemas.ComplaintCreate, triage_result: dict = None):
    reference_id = f"CF-{str(uuid.uuid4().hex[:6]).upper()}"
    sla_deadline = datetime.utcnow() + timedelta(hours=48)
    
    # Apply triage results if available
    category = complaint.category
    priority = models.ComplaintPriority.MEDIUM
    if triage_result:
        category = triage_result.get("category", category)
        try:
            priority = models.ComplaintPriority(triage_result.get("priority", "MEDIUM").upper())
        except ValueError:
            pass
            
    db_complaint = models.Complaint(
        reference_id=reference_id,
        title=complaint.title,
        description=complaint.description,
        category=category,
        lat=complaint.lat,
        lng=complaint.lng,
        address=complaint.address,
        image_url=complaint.image_url,
        sla_deadline=sla_deadline,
        status=models.ComplaintStatus.OPEN,
        priority=priority
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
