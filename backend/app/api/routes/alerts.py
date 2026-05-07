from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.model import Alert
from jose import jwt, JWTError
from app.core.security import SECRET_KEY, ALGORITHM

router = APIRouter()

# --- TON IDENTIFIANT D'USINE (TENANT) ---
REAL_TENANT_ID = "4535d643-2fc6-47e1-9e2a-21f2e4fc14b1"

@router.get("/")
def get_alerts(authorization: str = Header(None), db: Session = Depends(get_db)):
    # 1. Verify security token
    if not authorization:
        raise HTTPException(status_code=401, detail="Non autorisé")
    
    try:
        token = authorization.split(" ")[1]
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    # 2. Fetch active alerts ONLY for this specific tenant!
    active_alerts = db.query(Alert).filter(
        Alert.tenant_id == REAL_TENANT_ID,
        Alert.triggered == True
    ).order_by(Alert.created_at.desc()).limit(20).all()
    
    # 3. Format them for React
    formatted_alerts = []
    for alert in active_alerts:
        ui_type = "warning"
        db_type_lower = str(alert.type).lower()
        
        # Auto-detect colors based on keywords
        if "error" in db_type_lower or "camera" in db_type_lower or "critical" in db_type_lower:
            ui_type = "error"
        elif "info" in db_type_lower or "update" in db_type_lower:
            ui_type = "info"
            
        formatted_alerts.append({
            "id": str(alert.id),
            "type": ui_type,
            "message": f"{alert.type.upper()} : Seuil franchi ({alert.threshold})",
            "date": alert.created_at.strftime("%H:%M")
        })
        
    return {"alerts": formatted_alerts}

@router.put("/{alert_id}/dismiss")
def dismiss_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.triggered = False
        db.commit()
    return {"status": "success"}

@router.post("/test")
def create_test_alert(type: str = "Camera Timeout", threshold: float = 5000.0, db: Session = Depends(get_db)):
    """Use this in Swagger UI to instantly trigger an alert on the frontend!"""
    new_alert = Alert(
        tenant_id=REAL_TENANT_ID,
        type=type,
        threshold=threshold, # This is now a valid float!
        triggered=True
    )
    db.add(new_alert)
    db.commit()
    return {"message": "Test alert created! Go refresh your React dashboard."}