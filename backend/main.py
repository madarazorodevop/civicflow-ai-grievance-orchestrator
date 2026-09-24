import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import engine, get_db, Base

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CIVICFLOW API",
    description="AI-powered civic grievance resolution platform",
    version="1.0.0",
)

origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CIVICFLOW API"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0"
    }

# Additional routes
from routes import router as complaints_router
app.include_router(complaints_router, prefix="/api")
