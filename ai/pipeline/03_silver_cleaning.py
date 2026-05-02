import os
from pathlib import Path
from PIL import Image

# --- 1. Configuration des chemins ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Pointe vers le dossier où tu as extrait tes données Kaggle
BRONZE_KAGGLE_DIR = BASE_DIR / "data" / "bronze" / "kaggle"
SILVER_DIR = BASE_DIR / "data" / "silver"

# Taille standard requise par les modèles de Deep Learning
TARGET_SIZE = (224, 224) 

# --- 2. LA LOGIQUE MÉTIER ---
# Le nouveau mapping avec ta stratégie d'ajustement de la qualité
DIR_MAPPING = {
    "Original Dataset/Fresh": "Marche_Local", # Les tomates moyennes de Kaggle
    "Original Dataset/Rotten": "Rejet"        # Les tomates pourries de Kaggle
}

def clean_and_map_data():
    print("🧹 Démarrage du nettoyage Silver...\n")
    
    # Créer les 3 dossiers finaux dans Silver
    for final_class in ["Export", "Marche_Local", "Rejet"]:
        (SILVER_DIR / final_class).mkdir(parents=True, exist_ok=True)
        print(f"📁 Dossier cible prêt : {final_class}")

    if not BRONZE_KAGGLE_DIR.exists():
        print(f"\n❌ Erreur : Le dossier {BRONZE_KAGGLE_DIR} est introuvable.")
        return

    stats = {"Export": 0, "Marche_Local": 0, "Rejet": 0}

    # On parcourt notre mapping Kaggle -> Silver
    for relative_path, target_class in DIR_MAPPING.items():
        source_dir = BRONZE_KAGGLE_DIR / relative_path
        target_dir = SILVER_DIR / target_class
        
        if not source_dir.exists():
            print(f"⚠️ Attention : Le dossier source '{relative_path}' n'existe pas.")
            print("Vérifie bien les majuscules/minuscules dans tes dossiers.")
            continue
            
        print(f"🔄 Traitement des images de '{source_dir.name}' vers '{target_class}'...")
        
        # Parcourir et traiter chaque image du dossier source
        for img_path in source_dir.glob("*.*"):
            if img_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                try:
                    with Image.open(img_path) as img:
                        # Convertir en RGB et redimensionner
                        img = img.convert('RGB')
                        img_resized = img.resize(TARGET_SIZE)
                        
                        # On renomme l'image pour garder une trace de son origine (kgl = kaggle)
                        new_filename = f"kgl_{source_dir.name}_{img_path.name}"
                        img_resized.save(target_dir / new_filename, "JPEG", quality=90)
                        
                        stats[target_class] += 1
                except Exception as e:
                    print(f"  ❌ Erreur avec l'image {img_path.name}: {e}")

    print("\n✅ Nettoyage Silver terminé ! Bilan des données prêtes pour l'IA :")
    for classe, count in stats.items():
        print(f"  - {classe} : {count} images")

if __name__ == "__main__":
    clean_and_map_data()