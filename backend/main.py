from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from routes import router
import os
from dotenv import load_dotenv

load_dotenv()
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
    return {"status": "ok", "version": "8.5"}

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
