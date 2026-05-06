import os
from rembg import remove
from PIL import Image

# --- CONFIGURATION ---
# Change these to match your actual folder names!
INPUT_DATASET_DIR = r"C:\Users\hp\Desktop\Tomato_dataset"  # This should be the parent folder containing Export, Local, Rotten
OUTPUT_DATASET_DIR = r"C:\Users\hp\Desktop\Clean_tomato_dataset" 
def process_dataset():
    print(f"🚀 Starting background removal pipeline...")
    
    # Check if input directory exists
    if not os.path.exists(INPUT_DATASET_DIR):
        print(f"❌ Error: Could not find input directory '{INPUT_DATASET_DIR}'")
        return

    # Create the master output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DATASET_DIR):
        os.makedirs(OUTPUT_DATASET_DIR)

    # Loop through every folder (Export, Local, Rotten)
    classes = os.listdir(INPUT_DATASET_DIR)
    
    for class_name in classes:
        input_class_folder = os.path.join(INPUT_DATASET_DIR, class_name)
        
        # Skip if it's not a folder (like a random .txt file)
        if not os.path.isdir(input_class_folder):
            continue
            
        # Create the matching folder in the output directory
        output_class_folder = os.path.join(OUTPUT_DATASET_DIR, class_name)
        if not os.path.exists(output_class_folder):
            os.makedirs(output_class_folder)

        print(f"\n📂 Processing class: {class_name}...")
        
        # Get all images in this class folder
        images = os.listdir(input_class_folder)
        
        for i, filename in enumerate(images):
            # Only process image files
            if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.jfif')):
                continue

            input_path = os.path.join(input_class_folder, filename)
            
            # Save all outputs as PNGs because JPEG doesn't support transparent backgrounds
            new_filename = f"{os.path.splitext(filename)[0]}.png"
            output_path = os.path.join(output_class_folder, new_filename)

            # Skip if we already processed this image (great for resuming if the script crashes)
            if os.path.exists(output_path):
                continue

            try:
                # 1. Open the original image
                original_img = Image.open(input_path)
                
                # 2. Magic: Remove the background
                clean_img = remove(original_img)
                
                # 3. Save the new image
                clean_img.save(output_path, "PNG")
                
                # Print progress every 50 images so your terminal doesn't get flooded
                if (i + 1) % 50 == 0:
                    print(f"  [{i + 1}/{len(images)}] Cleaned and saved...")
                    
            except Exception as e:
                print(f"  ⚠️ Failed to process {filename}: {e}")

    print("\n✅ Dataset cleaning complete! You are ready to retrain.")

if __name__ == "__main__":
    process_dataset()