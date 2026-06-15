from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Header, Query
from jose import jwt, JWTError
from app.core.security import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session
from ultralytics import YOLO
from PIL import Image
import io
from pathlib import Path
from app.core.database import get_db
from app.core.model import PredictionRecord
from rembg import remove
from typing import Optional

router = APIRouter()

# Seuil de confiance minimum pour valider une prédiction
CONFIDENCE_THRESHOLD = 0.70

ROOT_DIR = Path(__file__).resolve().parents[4]
MODEL_PATH = ROOT_DIR / "ai" / "models" / "Tomato_grading_YOLO_BEST.pt"

try:
    print(f"Chargement du modele YOLO : {MODEL_PATH}")
    yolo_model = YOLO(str(MODEL_PATH))
    print("Modele charge avec succes.")
except Exception as e:
    print(f"Erreur de chargement du modele : {e}")
    yolo_model = None

@router.post("/")
async def predict_tomato(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authorization: str = Header(None),
    model_type: Optional[str] = Query(default="yolo", description="yolo ou cnn"),
):
    if yolo_model is None:
        raise HTTPException(status_code=500, detail="Modele IA non disponible.")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Format de fichier invalide.")

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization manquante")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    tenant_id = "4535d643-2fc6-47e1-9e2a-21f2e4fc14b1"
    try:
        contents = await file.read()
        file_size = len(contents)
        print(f"Fichier recu : {file.filename} | Taille : {file_size} octets")

        if file_size == 0:
            raise HTTPException(status_code=400, detail="Fichier vide.")

        # Suppression du fond avant classification
        no_bg_bytes = remove(contents)

        try:
            image = Image.open(io.BytesIO(no_bg_bytes)).convert('RGB')
        except Exception as img_error:
            raise HTTPException(status_code=400, detail="Image corrompue ou format non valide.")

        # Inference YOLO
        results = yolo_model.predict(image)

        names_dict = results[0].names
        predicted_class_index = results[0].probs.top1
        confidence = float(results[0].probs.top1conf)
        predicted_class_name = names_dict[predicted_class_index]

        # Mapping classe YOLO -> classe metier
        if predicted_class_name == "Export":
            mapped_class = "A"
        elif predicted_class_name == "Local":
            mapped_class = "B"
        else:
            mapped_class = "C"
            predicted_class_name = "Rejet"

        # Probabilites de toutes les classes (pour les barres de confiance)
        all_probs_tensor = results[0].probs.data
        all_probabilities = {
            names_dict[i]: round(float(all_probs_tensor[i]) * 100, 2)
            for i in range(len(names_dict))
        }
        all_probabilities_mapped = {}
        for raw_name, prob in all_probabilities.items():
            if raw_name != "Export" and raw_name != "Local":
                all_probabilities_mapped["Rejet"] = prob
            else:
                all_probabilities_mapped[raw_name] = prob

        # Si la confiance est trop faible, on ne loggue pas en base
        if confidence < CONFIDENCE_THRESHOLD:
            print(f"Confiance insuffisante ({confidence*100:.1f}%) - prediction ignoree")
            return {
                "success": True,
                "recognized": False,
                "decision": "Inconnu",
                "classe": "?",
                "confidence": confidence,
                "all_probabilities": all_probabilities_mapped,
                "model_used": model_type,
                "message": f"Confiance insuffisante ({confidence*100:.1f}% < {CONFIDENCE_THRESHOLD*100:.0f}%)"
            }

        # Sauvegarde en base de donnees
        db_record = PredictionRecord(
            tenant_id=tenant_id,
            user_id=user_id,
            classe=mapped_class,
            confidence=confidence,
            decision=predicted_class_name,
            image_path=None
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return {
            "success": True,
            "recognized": True,
            "id": str(db_record.id),
            "filename": file.filename,
            "prediction": predicted_class_name,
            "classe": mapped_class,
            "confidence": confidence,
            "all_probabilities": all_probabilities_mapped,
            "model_used": model_type
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")