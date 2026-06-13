from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError
from app.core.database import get_db
from app.core.security import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.get("/")
def get_predictions(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Non autorisé")
    try:
        token = authorization.split(" ")[1]
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

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