import os
from pathlib import Path
from PIL import Image
from rembg import remove

# --- 1. Configuration des chemins ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
BRONZE_KAGGLE_DIR = BASE_DIR / "data" / "bronze" / "kaggle"
SILVER_DIR = BASE_DIR / "data" / "silver"

TARGET_SIZE = (224, 224) 


DIR_MAPPING = {
    "OriginalData/ExportOriginal": "Export",
    "OriginalData/localOriginal": "Marche_Local",
    "OriginalData/RottenOriginal": "Rejet"
}

def clean_and_map_data():
    print("🧹 Démarrage du nettoyage Silver avec suppression d'arrière-plan (rembg)...\n")
    
    for final_class in ["Export", "Marche_Local", "Rejet"]:
        (SILVER_DIR / final_class).mkdir(parents=True, exist_ok=True)

    if not BRONZE_KAGGLE_DIR.exists():
        print(f"\n❌ Erreur : Le dossier {BRONZE_KAGGLE_DIR} est introuvable.")
        return

    stats = {"Export": 0, "Marche_Local": 0, "Rejet": 0}

    for relative_path, target_class in DIR_MAPPING.items():
        source_dir = BRONZE_KAGGLE_DIR / relative_path
        target_dir = SILVER_DIR / target_class
        
        if not source_dir.exists():
            continue
            
        print(f"🔄 Traitement et détourage de '{source_dir.name}' vers '{target_class}'...")
        
        for img_path in source_dir.glob("*.*"):
            if img_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                
                # Sauvegarde en PNG car le JPEG ne gère pas la transparence du fond retiré
                new_filename = f"kgl_{source_dir.name}_{img_path.stem}.png"
                output_path = target_dir / new_filename
                
                if output_path.exists():
                    continue # Ignore si déjà traité
                
                try:
                    # 1. Ouvrir l'image originale
                    img = Image.open(img_path)
                    
                    # 2. Ta logique : Retirer le fond
                    clean_img = remove(img)
                    
                    # 3. Redimensionner et sauvegarder
                    clean_img = clean_img.resize(TARGET_SIZE)
                    clean_img.save(output_path, "PNG")
                    
                    stats[target_class] += 1
                except Exception as e:
                    print(f"  ❌ Erreur avec l'image {img_path.name}: {e}")

    print("\n✅ Nettoyage Silver terminé ! Bilan des données :")
    for classe, count in stats.items():
        print(f"  - {classe} : {count} images PNG détourées")

if __name__ == "__main__":
    clean_and_map_data()