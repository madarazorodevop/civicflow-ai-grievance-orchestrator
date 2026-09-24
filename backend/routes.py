from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import schemas, crud, auth, models
import shutil
import os
import uuid
import requests

router = APIRouter()

@router.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.is_banned == 1:
        raise HTTPException(status_code=403, detail="Account banned for spamming complaints.")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['webp', 'jpg', 'jpeg', 'png']:
        raise HTTPException(status_code=400, detail="only image file is accepted eg webp jpg png jpeg")
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs("uploads", exist_ok=True)
    with open(f"uploads/{filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/uploads/{filename}"}

@router.post("/complaints/", response_model=schemas.Complaint)
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "client":
        raise HTTPException(status_code=403, detail="Only clients can create complaints")
    
    if len(current_user.complaints) >= 10:
        current_user.is_banned = 1
        db.commit()
        raise HTTPException(status_code=403, detail="Account banned for submitting too many complaints.")
        
    return crud.create_complaint(db, complaint, current_user.id)

@router.get("/banned_users/")
def get_banned_users(db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    banned = db.query(models.User).filter(models.User.is_banned == 1).all()
    return [{"id": u.id, "email": u.email, "complaints_count": len(u.complaints)} for u in banned]

@router.get("/complaints/", response_model=list[schemas.Complaint])
def read_complaints(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_complaints(db, user_id=current_user.id, is_admin=(current_user.role=="admin"))

@router.patch("/complaints/{complaint_id}/status", response_model=schemas.Complaint)
def update_status(complaint_id: str, update: schemas.ComplaintUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    return crud.update_complaint_status(db, complaint_id, update.status)

@router.post("/complaints/{complaint_id}/approve", response_model=schemas.Complaint)
def approve_complaint(complaint_id: str, approval: schemas.ComplaintApproval, db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    return crud.approve_complaint(db, complaint_id, approval.action, approval.reason)

@router.get("/notifications/", response_model=list[schemas.Notification])
def get_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_notifications(db, current_user.id)

@router.get("/stats/")
def get_stats(db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    return crud.get_dashboard_stats(db)

@router.get("/complaints/{complaint_id}", response_model=schemas.Complaint)
def read_complaint(complaint_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_c = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not db_c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    if current_user.role != "admin" and db_c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this complaint")
    return db_c

@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/chat/")
def chat_with_ai(request: schemas.ChatRequest, current_user: models.User = Depends(auth.get_current_user)):
    groq_api_key = os.getenv("GROQ_API_KEY", "")
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [{"role": m.role, "content": m.content} for m in request.messages],
        "temperature": 0.7,
        "max_tokens": 1024
    }
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="AI Service is currently unavailable")

@router.post("/support/", response_model=schemas.SupportMessage)
def create_support_message(msg: schemas.SupportMessageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_support_message(db, msg, current_user.id)

@router.get("/support/", response_model=list[schemas.SupportMessage])
def get_support_messages(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_support_messages(db, current_user.id, current_user.role == "admin")

@router.post("/support/{msg_id}/reply", response_model=schemas.SupportMessage)
def reply_support_message(msg_id: int, reply: schemas.SupportMessageReply, db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    return crud.reply_support_message(db, msg_id, reply.admin_reply)
