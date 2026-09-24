from sqlalchemy.orm import Session
import models, schemas, auth, ai_provider
import uuid
import datetime

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_complaint(db: Session, complaint: schemas.ComplaintCreate, user_id: int):
    c_id = f"CF-{str(uuid.uuid4())[:8].upper()}"
    
    ai = ai_provider.get_ai_provider()
    triage = ai.triage_complaint(complaint.title + " " + complaint.description)
    risk = triage.get("risk_level", "LOW")
    
    eta = "7 days"
    if risk == "HIGH":
        eta = "24 hours"
    elif risk == "MEDIUM":
        eta = "3 days"
        
    db_c = models.Complaint(
        id=c_id,
        user_id=user_id,
        title=complaint.title,
        description=complaint.description,
        category=complaint.category,
        lat=complaint.lat,
        lng=complaint.lng,
        address=complaint.address,
        image_url=complaint.image_url,
        ai_risk=risk,
        ai_reason=triage.get("reason", ""),
        priority=triage.get("priority", "LOW"),
        eta=eta
    )
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c

def get_complaints(db: Session, user_id: int = None, is_admin: bool = False):
    if is_admin:
        return db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).all()
    return db.query(models.Complaint).filter(models.Complaint.user_id == user_id).order_by(models.Complaint.created_at.desc()).all()

def update_complaint_status(db: Session, complaint_id: str, status: str):
    db_c = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if db_c:
        db_c.status = status
        if status == "Resolved":
            db_c.resolved_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(db_c)
    return db_c

def get_dashboard_stats(db: Session):
    complaints = db.query(models.Complaint).all()
    return {
        "total": len(complaints),
        "new": len([c for c in complaints if c.status == "Submitted"]),
        "high_risk": len([c for c in complaints if c.ai_risk == "HIGH"]),
        "medium_risk": len([c for c in complaints if c.ai_risk == "MEDIUM"]),
        "low_risk": len([c for c in complaints if c.ai_risk == "LOW"]),
        "in_progress": len([c for c in complaints if c.status in ["Under Review", "Assigned", "In Progress"]]),
        "resolved": len([c for c in complaints if c.status == "Resolved"])
    }
