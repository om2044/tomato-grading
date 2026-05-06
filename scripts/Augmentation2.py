import cv2
import random
import albumentations as A
from pathlib import Path

# --- CONFIGURATION ---
# The folder containing your current images (e.g., Local, Rotten, or Export)
FOLDER_PATH = Path(r"C:\Users\hp\Desktop\Tomato_dataset\Rotten")

TARGET_TOTAL = 5136 
TARGET_SIZE = (224, 224)

transform = A.Compose([
    A.HorizontalFlip(p=0.5),              
    A.VerticalFlip(p=0.5),                 
    A.RandomRotate90(p=0.5),               
])

def resize_and_balance_in_place():
    valid_extensions = {'.png', '.jpg', '.jpeg'}
    
    image_paths = [p for p in FOLDER_PATH.iterdir() if p.suffix.lower() in valid_extensions and p.is_file()]
    
    print(f"Found {len(image_paths)} images. Step 1: Resizing originals IN PLACE...")
    
    # --- STEP 1: RESIZE AND OVERWRITE ORIGINALS ---
    # We will also store them in RAM so the augmentation step is lightning fast
    resized_originals = []
    
    for p in image_paths:
        img = cv2.imread(str(p))
        if img is not None:
            # Resize the image to 224x224
            resized_img = cv2.resize(img, TARGET_SIZE)
            
            # OVERWRITE the original file with the new resized version
            cv2.imwrite(str(p), resized_img)
            
            # Keep a copy in RAM for the augmentation phase
            resized_originals.append((p.name, resized_img))

    current_count = len(resized_originals)
    print(f"Successfully resized and overwrote {current_count} original images.")
    
    # --- STEP 2: CALCULATE GAP ---
    images_needed = TARGET_TOTAL - current_count
    
    if images_needed <= 0:
        print("No augmentation needed! Your images have been resized.")
        return
        
    print(f"Step 2: Generating {images_needed} new augmented images...")
    
    # --- STEP 3: TURBO AUGMENTATION ---
    for i in range(images_needed):
        # Pick from the tiny 224x224 images already in RAM
        orig_name, image = random.choice(resized_originals)
        
        # Apply the random augmentations
        augmented = transform(image=image)
        aug_image = augmented['image']
        
        # Save the new augmented image back into the SAME folder
        new_filename = f"aug_balance_{i}_{orig_name}"
        save_path = FOLDER_PATH / new_filename
        cv2.imwrite(str(save_path), aug_image)
        
        # Print progress every 50 images
        if (i + 1) % 50 == 0:
            print(f"Generated {i + 1} / {images_needed} images...")

    print(f"\nSuccess! '{FOLDER_PATH.name}' now contains exactly {TARGET_TOTAL} resized (224x224) images.")

if __name__ == "__main__":
    resize_and_balance_in_place()