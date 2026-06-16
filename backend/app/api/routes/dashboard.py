from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from jose import jwt, JWTError
from app.core.database import get_db
from app.core.model import PredictionRecord
from app.core.security import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.get("/")
def get_dashboard_stats(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Non autorisé")
    try:
        token = authorization.split(" ")[1]
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        print(f"JWT decode error in dashboard: {e}")
        raise HTTPException(status_code=401, detail=f"Token invalide: {str(e)}")
   
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