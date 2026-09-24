from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from routes import router
import os

app = FastAPI(title="CIVICFLOW API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"status": "ok", "version": "0.2"}

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    from sqlalchemy.orm import Session
    from database import SessionLocal
    import auth
    db = SessionLocal()
    if not db.query(models.User).filter(models.User.email=="admin@civicflow.com").first():
        db_user = models.User(email="admin@civicflow.com", hashed_password=auth.get_password_hash("admin123"), role="admin")
        db.add(db_user)
        db.commit()
    if not db.query(models.User).filter(models.User.email=="client@civicflow.com").first():
        db_user = models.User(email="client@civicflow.com", hashed_password=auth.get_password_hash("client123"), role="client")
        db.add(db_user)
        db.commit()
    db.close()
