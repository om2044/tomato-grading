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
    "OriginalData/OriginalData/ExportOriginal": "Export",
    "OriginalData/OriginalData/Marche_Local": "Marche_Local",
    "OriginalData/OriginalData/Rejet": "Rejet"
}

def clean_and_map_data():
    print("🧹 Démarrage du nettoyage Silver avec suppression d'arrière-plan (rembg)...\n")
    
    for final_class in FOLDER_MAPPING.values():
        (SILVER_DIR / final_class).mkdir(parents=True, exist_ok=True)

    if not BRONZE_KAGGLE_DIR.exists():
        print(f"\n❌ Erreur : Le dossier {BRONZE_KAGGLE_DIR} est introuvable.")
        return

    stats = {"Export": 0, "Marche_Local": 0, "Rejet": 0}

    for source_name, target_class in FOLDER_MAPPING.items():
        # Recherche dynamique du dossier (rglob cherche partout dans les sous-dossiers)
        found_dirs = [d for d in BRONZE_KAGGLE_DIR.rglob(source_name) if d.is_dir()]
        
        if not found_dirs:
            print(f"⚠️ Impossible de trouver le dossier '{source_name}' dans le zip Kaggle.")
            continue
            
        source_dir = found_dirs[0]
        
        # Trouver toutes les images
        images = [f for f in source_dir.glob("*.*") if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        print(f"\n🔄 Traitement de '{source_dir.name}' vers '{target_class}' ({len(images)} images)...")
        
        for i, img_path in enumerate(images):
            new_filename = f"kgl_{source_dir.name}_{img_path.stem}.png"
            output_path = SILVER_DIR / target_class / new_filename
            
            # Reprise en cas de coupure (ignore si l'image est déjà détourée)
            if output_path.exists():
                stats[target_class] += 1
                continue
            
            try:
                img = Image.open(img_path)
                clean_img = remove(img)
                clean_img = clean_img.resize(TARGET_SIZE)
                clean_img.save(output_path, "PNG")
                stats[target_class] += 1
                
                # Afficher la progression pour savoir que le script tourne !
                if (i + 1) % 50 == 0:
                    print(f"     [{i + 1}/{len(images)}] Images détourées et sauvegardées...")
                    
            except Exception as e:
                print(f"  ❌ Erreur avec {img_path.name}: {e}")

    print("\n✅ Nettoyage Silver terminé ! Bilan des données :")
    for classe, count in stats.items():
        print(f"  - {classe} : {count} images PNG détourées")

if __name__ == "__main__":
    clean_and_map_data()