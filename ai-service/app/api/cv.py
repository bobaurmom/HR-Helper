from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.model_service import process_cv

router = APIRouter()

class ProcessCVRequest(BaseModel):
    pdf_url: str
    job_requirements: str

@router.post("/process-cv")
async def process_cv_endpoint(request: ProcessCVRequest):
    try:
        result = process_cv(request.pdf_url, request.job_requirements)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
