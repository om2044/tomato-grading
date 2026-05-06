from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.model import PredictionRecord

router = APIRouter()

@router.get("/")
def get_dashboard_stats(db: Session = Depends(get_db)):
   
    total_scans = db.query(PredictionRecord).count()
    
    
    decision_counts = db.query(
        PredictionRecord.decision, 
        func.count(PredictionRecord.id)
    ).group_by(PredictionRecord.decision).all()
    
    
    breakdown = {
        "Export": 0,
        "Local": 0,
        "Rejet": 0
    }
    
    for decision, count in decision_counts:
       
        if decision in breakdown:
            breakdown[decision] = count
        elif decision is not None:
            breakdown[decision] = count

    
    avg_confidence = db.query(func.avg(PredictionRecord.confidence)).scalar()
    
    
    formatted_confidence = round(avg_confidence * 100, 2) if avg_confidence else 0.0

    return {
        "success": True,
        "metrics": {
            "total_scans": total_scans,
            "average_confidence": f"{formatted_confidence}%",
            "breakdown": breakdown
        }
    }