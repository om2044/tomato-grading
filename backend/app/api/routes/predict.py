from fastapi import APIRouter, File, UploadFile, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from pathlib import Path

# 1. Initialize the router
router = APIRouter()

# 2. Automatically find the root 'tomato-grading' folder
# This tells Python to go UP 5 folders from predict.py (routes -> api -> app -> backend -> root)
ROOT_DIR = Path(__file__).resolve().parents[4]

# 3. Build the exact path to the model
MODEL_PATH = ROOT_DIR / "ai" / "models" / "Tomato_grading_01.keras"

# 4. Load the model using the calculated path
try:
    print(f"Attempting to load model from: {MODEL_PATH}") # This will print the path in your terminal so you can verify it
    model = tf.keras.models.load_model(str(MODEL_PATH))
    print("Model successfully loaded! ✅")
except Exception as e:
    print(f"Warning: Model failed to load. Error: {e}")
    model = None
class_names = ['Local', 'Export', 'Rotten']

@router.post("/")
async def predict_tomato(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="AI Model is not available on the server.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        contents = await file.read()
        
        # --- NEW DEBUGGING LOGIC ---
        file_size = len(contents)
        print(f"Received file: {file.filename} | Size: {file_size} bytes")
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is completely empty (0 bytes).")
        # ---------------------------

        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
        except Exception as img_error:
            # If Pillow fails, it will print exactly why here
            print(f"Pillow failed to open image: {img_error}")
            raise HTTPException(status_code=400, detail="The file is corrupted or not a valid image format.")
        
        # Resize and format for the model
        image = image.resize((224, 224))
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make the prediction
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        return {
            "success": True,
            "filename": file.filename,
            "prediction": class_names[predicted_class_index],
            "confidence": confidence
        }
        
    except HTTPException:
        # Pass HTTP exceptions straight through to the user
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")