import os

def rename_tomato_images(folder_path, Type):
    # Verify the folder exists
    if not os.path.exists(folder_path):
        print(f"Error: The folder '{folder_path}' does not exist.")
        return

    # Get a list of all files in the directory
    files = os.listdir(folder_path)
    
    # Initialize our number counter
    count = 1
    renamed_total = 0

    for filename in files:
        # Check if the file is an image
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
            
            file_extension = os.path.splitext(filename)[1]
            new_name = f"{Type}_Tomato_{count}{file_extension}"
            
            # If the file is ALREADY correctly named, skip it but advance the counter
            if filename == new_name:
                count += 1
                continue
            
            # Get the full absolute paths
            old_file_path = os.path.join(folder_path, filename)
            new_file_path = os.path.join(folder_path, new_name)
            
            # THE FIX: Keep increasing the counter until we find a name that doesn't exist yet
            while os.path.exists(new_file_path):
                count += 1
                new_name = f"{Type}_Tomato_{count}{file_extension}"
                new_file_path = os.path.join(folder_path, new_name)
            
            try:
                # Rename the file
                os.rename(old_file_path, new_file_path)
                print(f"Renamed: '{filename}' -> '{new_name}'")
                
                # Advance the counter for the next image in the loop
                count += 1
                renamed_total += 1
            except Exception as e:
                print(f"Error renaming '{filename}': {e}")

    print(f"\nSuccess! Renamed {renamed_total} tomato images.")

# ==========================================
# USER CONFIGURATION
# ==========================================
DIRECTORY_PATH = r"C:\Users\hp\Desktop\Tomato_dataset\Rotten"  # Change this to your folder path
rename_tomato_images(DIRECTORY_PATH, "Rotten")