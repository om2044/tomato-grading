import cv2
import albumentations as A
from pathlib import Path

# --- CONFIGURATION ---
INPUT_DIR = Path(r"C:\Users\hp\Desktop\export\Matixa")
OUTPUT_DIR = Path(r"C:\Users\hp\Desktop\Tomato_dataset\Export")

TARGET_SIZE = (224, 224) 
COPIES_PER_IMAGE = 2  # Change this to 1 or 2 as needed

# Define augmentations (Spatial transformations don't strictly require RGB conversion)
transform = A.Compose([
    A.HorizontalFlip(p=0.5),              
    A.VerticalFlip(p=0.5),                 
    A.RandomRotate90(p=0.5),               
])

def process_dataset():
    # Create the output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    valid_extensions = {'.png', '.jpg', '.jpeg'}
    
    # Find all valid images in the input directory
    image_paths = [p for p in INPUT_DIR.iterdir() if p.suffix.lower() in valid_extensions]
    
    print(f"Found {len(image_paths)} original images. Starting processing...")
    
    total_generated = 0

    for img_path in image_paths:
        # Read image using OpenCV
        image = cv2.imread(str(img_path))
        if image is None:
            print(f"Warning: Could not read {img_path.name}. Skipping.")
            continue
        
        # Resize to make the images smaller and uniform
        resized_image = cv2.resize(image, TARGET_SIZE)
        
        # 1. Save the resized original image
        orig_save_path = OUTPUT_DIR / f"orig_{img_path.name}"
        cv2.imwrite(str(orig_save_path), resized_image)
        total_generated += 1

        # 2. Generate and save the requested number of augmented copies
        for i in range(COPIES_PER_IMAGE):
            augmented = transform(image=resized_image)
            aug_image = augmented['image']
            
            aug_save_path = OUTPUT_DIR / f"aug_{i+1}_{img_path.name}"
            cv2.imwrite(str(aug_save_path), aug_image)
            total_generated += 1

    print(f"\nSuccess! Processed {len(image_paths)} originals into {total_generated} total images.")
    print(f"Check your files in: {OUTPUT_DIR}")

if __name__ == "__main__":
    process_dataset()