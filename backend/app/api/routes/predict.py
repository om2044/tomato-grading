from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from pathlib import Path
from app.core.database import get_db
from app.core.model import PredictionRecord

router = APIRouter()

ROOT_DIR = Path(__file__).resolve().parents[4]

MODEL_PATH = ROOT_DIR / "ai" / "models" / "Tomato_grading_01.keras"


try:
    print(f"Attempting to load model from: {MODEL_PATH}") 
    model = tf.keras.models.load_model(str(MODEL_PATH))
    
except Exception as e:
    print(f"Warning: Model failed to load. Error: {e}")
    model = None
class_names = ['Local', 'Export', 'Rotten']

@router.post("/")
async def predict_tomato(file: UploadFile = File(...),db: Session = Depends(get_db)):
    if model is None:
        raise HTTPException(status_code=500, detail="AI Model is not available on the server.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        contents = await file.read()
        
        file_size = len(contents)
        print(f"Received file: {file.filename} | Size: {file_size} bytes")
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is completely empty (0 bytes).")
       

        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
        except Exception as img_error:
            
            print(f"Pillow failed to open image: {img_error}")
            raise HTTPException(status_code=400, detail="The file is corrupted or not a valid image format.")
        
        
        image = image.resize((224, 224))
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        
        
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
       
        if class_names[predicted_class_index] == "Export":
            mapped_class = "A"
        elif class_names[predicted_class_index] == "Local":
            mapped_class = "B"
        else:
            mapped_class = "C"

        REAL_TENANT_ID = "4535d643-2fc6-47e1-9e2a-21f2e4fc14b1" 
        REAL_USER_ID = "37b1ebf3-27b8-4b62-82b6-ac6015bd2a8a"
        
        db_record = PredictionRecord(
            #-------
            #just pour test
            tenant_id=REAL_TENANT_ID, 
            user_id=REAL_USER_ID,
            #------
            classe=mapped_class,
            confidence=confidence,
            decision=class_names[predicted_class_index] ,
            image_path=None
           
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
       

        return {
            "success": True,
            "id": str(db_record.id),
            "filename": file.filename,
            "prediction": class_names[predicted_class_index], 
            "classe": mapped_class, 
            "confidence": confidence
        }
        
    except HTTPException:
       
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")