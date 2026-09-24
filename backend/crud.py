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
    triage = ai.triage_complaint(f"[{complaint.category}] {complaint.title} {complaint.description}")
    risk = triage.get("risk_level", "LOW")
    
    eta = "7 days"
    if risk == "SEVERE":
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
        riskLevel=risk,
        riskReason=triage.get("reason", ""),
        priority=triage.get("priority", "LOW"),
        analyzedAt=datetime.datetime.utcnow(),
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

def approve_complaint(db: Session, complaint_id: str, action: str, reason: str = None):
    db_c = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if db_c:
        if action == "APPROVE":
            db_c.approvalStatus = "APPROVED"
            db_c.status = "Approved"
            msg = f"Your complaint {db_c.id} has been approved."
        else:
            db_c.approvalStatus = "REJECTED"
            db_c.status = "Rejected"
            db_c.approvalReason = reason
            msg = f"Your complaint {db_c.id} has been rejected. Reason: {reason}"
        
        notif = models.Notification(user_id=db_c.user_id, message=msg)
        db.add(notif)
        db.commit()
        db.refresh(db_c)
    return db_c

def get_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()

def get_dashboard_stats(db: Session):
    complaints = db.query(models.Complaint).all()
    return {
        "total": len(complaints),
        "new": len([c for c in complaints if c.status == "Submitted"]),
        "severe_risk": len([c for c in complaints if c.riskLevel == "SEVERE"]),
        "medium_risk": len([c for c in complaints if c.riskLevel == "MEDIUM"]),
        "low_risk": len([c for c in complaints if c.riskLevel == "LOW"]),
        "in_progress": len([c for c in complaints if c.status in ["Under Review", "Assigned", "In Progress"]]),
        "resolved": len([c for c in complaints if c.status == "Resolved"])
    }

def create_support_message(db: Session, msg: schemas.SupportMessageCreate, user_id: int):
    db_msg = models.SupportMessage(user_id=user_id, message=msg.message)
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

def get_support_messages(db: Session, user_id: int = None, is_admin: bool = False):
    if is_admin:
        return db.query(models.SupportMessage).order_by(models.SupportMessage.created_at.desc()).all()
    return db.query(models.SupportMessage).filter(models.SupportMessage.user_id == user_id).order_by(models.SupportMessage.created_at.desc()).all()

def reply_support_message(db: Session, msg_id: int, reply: str):
    db_msg = db.query(models.SupportMessage).filter(models.SupportMessage.id == msg_id).first()
    if db_msg:
        db_msg.admin_reply = reply
        db.commit()
        db.refresh(db_msg)
        notif = models.Notification(user_id=db_msg.user_id, message="Admin replied to your support message!")
        db.add(notif)
        db.commit()
    return db_msg
