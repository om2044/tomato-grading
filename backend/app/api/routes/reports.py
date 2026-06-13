from collections import defaultdict
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.database import get_db
from app.core.model import PredictionRecord
from app.core.security import SECRET_KEY, ALGORITHM

router = APIRouter()

def _format_confidence(value: float | None) -> float:
    return round(value * 100, 2) if value is not None else 0.0

@router.get("/")
def get_reports(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Non autorisé")
    try:
        token = authorization.split(" ")[1]
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    # 1. Build the date filters
    filters = []
    if start_date:
        filters.append(PredictionRecord.created_at >= start_date)
    if end_date:
        # If the database stores datetimes, you might want to ensure end_date covers the whole day 
        # e.g., end_date + timedelta(days=1) depending on your timezone needs.
        filters.append(PredictionRecord.created_at <= end_date)

    # 2. Total Scans
    total_scans = db.query(PredictionRecord).filter(*filters).count()

    # 3. Decision Counts
    decision_counts = db.query(
        PredictionRecord.decision,
        func.count(PredictionRecord.id)
    ).filter(*filters).group_by(PredictionRecord.decision).all()

    breakdown = {"Export": 0, "Local": 0, "Rejet": 0}
    for decision, count in decision_counts:
        if decision in breakdown:
            breakdown[decision] = count
        elif decision:
            breakdown[decision] = count

    # 4. Average Confidence
    avg_confidence_scalar = db.query(func.avg(PredictionRecord.confidence)).filter(*filters).scalar()
    avg_confidence = _format_confidence(avg_confidence_scalar)

    # 5. Monthly Data
    # Fetching rows with filters to aggregate in Python
    rows = db.query(
        PredictionRecord.created_at,
        PredictionRecord.decision,
    ).filter(*filters).all()

    monthly_data = defaultdict(
        lambda: {"Export": 0, "Local": 0, "Rejet": 0, "total": 0}
    )

    for created_at, decision in rows:
        if not created_at:
            continue

        month_key = f"{created_at.year}-{created_at.month:02d}"
        if decision in monthly_data[month_key]:
            monthly_data[month_key][decision] += 1
        elif decision:
            monthly_data[month_key][decision] = 1

        monthly_data[month_key]["total"] += 1

    monthly_report = [
        {
            "month": month_key,
            "total": values["total"],
            "export": values["Export"],
            "local": values["Local"],
            "rejet": values["Rejet"],
        }
        for month_key, values in sorted(monthly_data.items())
    ]

    return {
        "success": True,
        "report": {
            "total_scans": total_scans,
            "average_confidence": f"{avg_confidence}%",
            "decision_breakdown": breakdown,
            "monthly_production": monthly_report,
        },
    }