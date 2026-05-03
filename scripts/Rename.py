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

    for filename in files:
        # Check if the file is an image (ignores hidden files like .DS_Store)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
            
            # Extract the file extension (e.g., '.jpg')
            file_extension = os.path.splitext(filename)[1]
            
            # Create the new file name
            new_name = f"{Type}_Tomato_{count}{file_extension}"
            
            # Get the full absolute paths for the old and new files
            old_file_path = os.path.join(folder_path, filename)
            new_file_path = os.path.join(folder_path, new_name)
            
            try:
                # Rename the file
                os.rename(old_file_path, new_file_path)
                print(f"Renamed: '{filename}' -> '{new_name}'")
                count += 1
            except FileExistsError:
                print(f"Skipped: '{new_name}' already exists.")
            except Exception as e:
                print(f"Error renaming '{filename}': {e}")

    print(f"\nSuccess! Renamed {count - 1} tomato images.")

# ==========================================
# USER CONFIGURATION
# ==========================================
# Replace the string below with the actual path to your images folder.
# Example for Windows: r"C:\Users\YourName\Pictures\Tomatoes"
# Example for Mac/Linux: "/Users/YourName/Pictures/Tomatoes"

DIRECTORY_PATH = r"C:\Users\hp\Desktop\Tomato_dataset\Local" 

rename_tomato_images(DIRECTORY_PATH,"Local")