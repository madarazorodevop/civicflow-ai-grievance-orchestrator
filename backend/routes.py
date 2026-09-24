from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import get_db

from ai_provider import get_ai_provider
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/complaints/", response_model=schemas.ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    ai_provider = get_ai_provider()
    triage_result = None
    try:
        triage_result = await ai_provider.triage_complaint(description=complaint.description, image_url=complaint.image_url)
    except Exception as e:
        logger.error(f"Failed to triage complaint with AI: {e}")
        # Proceed with creation anyway, falling back to basic defaults

    return crud.create_complaint(db=db, complaint=complaint, triage_result=triage_result)

@router.get("/complaints/", response_model=List[schemas.ComplaintResponse])
def read_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    complaints = crud.get_complaints(db, skip=skip, limit=limit)
    return complaints

@router.get("/complaints/{complaint_id}", response_model=schemas.ComplaintResponse)
def read_complaint(complaint_id: int, db: Session = Depends(get_db)):
    db_complaint = crud.get_complaint(db, complaint_id=complaint_id)
    if db_complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return db_complaint
