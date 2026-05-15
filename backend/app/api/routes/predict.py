from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
import numpy as np
from ultralytics import YOLO
from PIL import Image
import io
from pathlib import Path
from app.core.database import get_db
from app.core.model import PredictionRecord
from rembg import remove

router = APIRouter()

ROOT_DIR = Path(__file__).resolve().parents[4]

# 🛑 1. Pointing to the YOLO model you trained
MODEL_PATH = ROOT_DIR / "ai" / "models" / "Tomato_grading_YOLO_BEST.pt"

try:
    print(f"📥 Loading YOLO model from: {MODEL_PATH}")
    # 🛑 2. The YOLO production loader
    model = YOLO(str(MODEL_PATH))
    print("✅ Model fully loaded and ready for production!")
    
except Exception as e:
    print(f"❌ Warning: Model failed to load. Error: {e}")
    model = None

@router.post("/")
async def predict_tomato(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if model is None:
        raise HTTPException(status_code=500, detail="AI Model is not available on the server.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        contents = await file.read()
        no_bg_bytes = remove(contents)
        
        file_size = len(contents)
        print(f"Received file: {file.filename} | Size: {file_size} bytes")
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is completely empty (0 bytes).")

        try:
            image = Image.open(io.BytesIO(no_bg_bytes)).convert('RGB')
        except Exception as img_error:
            print(f"Pillow failed to open image: {img_error}")
            raise HTTPException(status_code=400, detail="The file is corrupted or not a valid image format.")
        
        # 🛑 3. Handling the YOLO Model Output
        results = model.predict(image)
        
        names_dict = results[0].names
        predicted_class_index = results[0].probs.top1
        confidence = float(results[0].probs.top1conf)
        
        predicted_class_name = names_dict[predicted_class_index]
        
        if predicted_class_name == "Export":
            mapped_class = "A"
        elif predicted_class_name == "Local":
            mapped_class = "B"
        else:
            mapped_class = "C"

        REAL_TENANT_ID = "4535d643-2fc6-47e1-9e2a-21f2e4fc14b1" 
        REAL_USER_ID = "37b1ebf3-27b8-4b62-82b6-ac6015bd2a8a"
        
        db_record = PredictionRecord(
            tenant_id=REAL_TENANT_ID, 
            user_id=REAL_USER_ID,
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
            "id": str(db_record.id),
            "filename": file.filename,
            "prediction": predicted_class_name, 
            "classe": mapped_class, 
            "confidence": confidence
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")