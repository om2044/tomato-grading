import os
from pathlib import Path
from PIL import Image

# --- Configuration des chemins ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
BRONZE_DIR = BASE_DIR / "data" / "bronze"

def validate_bronze_data():
    print("🛡️  Démarrage de la validation des données Bronze...\n")
    
    if not BRONZE_DIR.exists():
        print("❌ Erreur : Le dossier Bronze n'existe pas. Lancez le script 01 d'abord.")
        return

    # Extensions d'images acceptées
    valid_extensions = {'.jpg', '.jpeg', '.png'}
    
    stats = {
        "total_fichiers": 0,
        "images_valides": 0,
        "fichiers_corrompus": 0,
        "mauvaises_extensions": 0
    }

    # rglob("*") permet de chercher dans tous les sous-dossiers automatiquement !
    for file_path in BRONZE_DIR.rglob("*"):
        if file_path.is_file():
            stats["total_fichiers"] += 1
            
            # 1. Vérification de l'extension
            if file_path.suffix.lower() not in valid_extensions:
                print(f"⚠️ Extension non reconnue (ignorée) : {file_path.name}")
                stats["mauvaises_extensions"] += 1
                continue
                
            # 2. Vérification de l'intégrité de l'image
            try:
                with Image.open(file_path) as img:
                    img.verify() # Vérifie que l'image n'est pas cassée sans la charger en RAM
                stats["images_valides"] += 1
            except Exception as e:
                print(f"🚨 Image corrompue détectée et supprimée : {file_path.name} ({e})")
                os.remove(file_path) # On supprime le fichier cassé
                stats["fichiers_corrompus"] += 1

    # --- Affichage du Rapport ---
    print("\n" + "="*40)
    print("📊 RAPPORT DE VALIDATION BRONZE")
    print("="*40)
    print(f"📁 Total de fichiers scannés : {stats['total_fichiers']}")
    print(f"✅ Images saines et prêtes   : {stats['images_valides']}")
    
    if stats['fichiers_corrompus'] > 0:
        print(f"🗑️ Fichiers corrompus (supprimés) : {stats['fichiers_corrompus']}")
    if stats['mauvaises_extensions'] > 0:
        print(f"⚠️ Fichiers ignorés (non-image) : {stats['mauvaises_extensions']}")
        
    print("="*40)
    
    if stats['images_valides'] > 0:
        print("\n🟢 SUCCESS : La zone Bronze est validée. Vous pouvez passer à l'étape Silver !")
    else:
        print("\n🔴 FAILED : Aucune image valide trouvée dans la zone Bronze.")

if __name__ == "__main__":
    validate_bronze_data()