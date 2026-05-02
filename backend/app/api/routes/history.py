from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

@router.get("/")
def get_predictions(db: Session = Depends(get_db)):
    try:
        # On utilise text() pour exécuter notre requête SQL dans SQLAlchemy
        result = db.execute(text("""
            SELECT id, classe, confidence, decision, created_at 
            FROM predictions 
            ORDER BY created_at DESC;
        """))
        
        # On transforme le résultat en liste de dictionnaires (format JSON)
        predictions = [dict(row._mapping) for row in result]
        return {"data": predictions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur DB: {str(e)}")