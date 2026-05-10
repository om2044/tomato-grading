import cv2
import random
import albumentations as A
from pathlib import Path

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
TRAIN_DIR = BASE_DIR / "data" / "gold" / "train"

CLASSES_METIER = ["Export", "Marche_Local", "Rejet"]

# Ton objectif de balancement (modifie ce chiffre selon tes besoins)
#TARGET_TOTAL = 5000 
TARGET_TOTAL = 60
TARGET_SIZE = (224, 224)

# Ta configuration Albumentations
transform = A.Compose([
    A.HorizontalFlip(p=0.5),              
    A.VerticalFlip(p=0.5),                 
    A.RandomRotate90(p=0.5),               
])

def augment_and_balance_train_data():
    print("🧬 Démarrage de l'équilibrage et de l'augmentation Gold (Albumentations)...\n")

    if not TRAIN_DIR.exists():
        print(f"❌ Erreur : Le dossier {TRAIN_DIR} n'existe pas. Lancez le script 05 d'abord.")
        return

    for classe in CLASSES_METIER:
        class_dir = TRAIN_DIR / classe
        if not class_dir.exists(): 
            continue
            
        valid_extensions = {'.png', '.jpg', '.jpeg'}
        image_paths = [p for p in class_dir.iterdir() if p.suffix.lower() in valid_extensions and p.is_file()]
        
        if not image_paths:
            continue

        print(f"🔄 Classe '{classe}' : {len(image_paths)} originales trouvées.")
        
        # Charger les originales en RAM
        resized_originals = []
        for p in image_paths:
            img = cv2.imread(str(p), cv2.IMREAD_UNCHANGED) # IMREAD_UNCHANGED pour garder la transparence PNG !
            if img is not None:
                # Les images sont déjà en 224x224 depuis Silver, mais on s'assure du format
                if img.shape[:2] != TARGET_SIZE:
                    img = cv2.resize(img, TARGET_SIZE)
                    cv2.imwrite(str(p), img)
                resized_originals.append((p.name, img))

        current_count = len(resized_originals)
        images_needed = TARGET_TOTAL - current_count
        
        if images_needed <= 0:
            print(f"  ✅ Déjà équilibré (>= {TARGET_TOTAL}).")
            continue
            
        print(f"  ⚙️ Génération de {images_needed} nouvelles images...")
        
        # Générer le manque
        for i in range(images_needed):
            orig_name, image = random.choice(resized_originals)
            
            augmented = transform(image=image)
            aug_image = augmented['image']
            
            new_filename = f"aug_balance_{i}_{orig_name}"
            save_path = class_dir / new_filename
            cv2.imwrite(str(save_path), aug_image)

        print(f"  ✅ '{classe}' contient maintenant exactement {TARGET_TOTAL} images.")

if __name__ == "__main__":
    augment_and_balance_train_data()