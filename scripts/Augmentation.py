import cv2
import os
import random
import albumentations as A

# --- CONFIGURATION ---
# Replace these paths with your actual folder paths!
input_dir = r"C:\Users\hp\Desktop\export\Matixa"
output_dir = r"C:\Users\hp\Desktop\Tomato_dataset\Export"

# 224x224 is the standard size for most modern image classification models 
TARGET_SIZE = (224, 224) 
TARGET_TOTAL_IMAGES = 2000

# Create the output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# --- AUGMENTATION PIPELINE ---
# This defines how the images will be randomly altered.
# We are using transformations that make sense for tomatoes (flipping, rotating, lighting changes).
transform = A.Compose([
    A.HorizontalFlip(p=0.5),               # 50% chance to flip left-right
    A.VerticalFlip(p=0.5),                 # 50% chance to flip upside down
    A.RandomRotate90(p=0.5),               # 50% chance to rotate by 90 degrees
    A.ShiftScaleRotate(shift_limit=0.05, scale_limit=0.1, rotate_limit=30, p=0.7), # Random shifting/zooming
    A.RandomBrightnessContrast(p=0.6),     # Simulates different lighting conditions
    A.HueSaturationValue(hue_shift_limit=10, sat_shift_limit=20, val_shift_limit=10, p=0.5), # Slight color tweaks
    A.GaussNoise(var_limit=(10.0, 50.0), p=0.2) # Adds slight camera noise occasionally
])

# --- STEP 1: READ AND RESIZE ORIGINAL IMAGES ---
original_images = []
valid_extensions = ('.png', '.jpg', '.jpeg')

# Get all image files from the input directory
image_files = [f for f in os.listdir(input_dir) if f.lower().endswith(valid_extensions)]

print(f"Found {len(image_files)} original images. Starting processing...")

for filename in image_files:
    img_path = os.path.join(input_dir, filename)
    
    # Read image using OpenCV
    image = cv2.imread(img_path)
    if image is None:
        print(f"Warning: Could not read {filename}. Skipping.")
        continue
        
    # OpenCV reads in BGR format, Albumentations expects RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize to make the images smaller and uniform
    image = cv2.resize(image, TARGET_SIZE)
    original_images.append(image)
    
    # Save the resized original image to the output folder
    save_path = os.path.join(output_dir, f"orig_resized_{filename}")
    cv2.imwrite(save_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

# --- STEP 2: GENERATE AUGMENTED IMAGES ---
current_count = len(original_images)
images_needed = TARGET_TOTAL_IMAGES - current_count

print(f"Resized and saved {current_count} originals. Generating {images_needed} new augmented images...")

for i in range(images_needed):
    # 1. Pick a random original image to alter
    base_image = random.choice(original_images)
    
    # 2. Apply the random augmentations
    augmented = transform(image=base_image)
    aug_image = augmented['image']
    
    # 3. Save the new image
    save_path = os.path.join(output_dir, f"aug_generated_{i}.jpg")
    
    # Convert back to BGR before saving with OpenCV
    cv2.imwrite(save_path, cv2.cvtColor(aug_image, cv2.COLOR_RGB2BGR))
    
    # Print progress every 200 images
    if (i + 1) % 200 == 0:
        print(f"Generated {i + 1} / {images_needed} images...")

print(f"\nSuccess! You now have {TARGET_TOTAL_IMAGES} images in the '{output_dir}' folder.")