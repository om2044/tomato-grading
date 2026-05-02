import os
import shutil
import random
from pathlib import Path

# --- 1. Configuration des chemins ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SILVER_DIR = BASE_DIR / "data" / "silver"
GOLD_DIR = BASE_DIR / "data" / "gold"

# Ratio de séparation (80% pour l'entraînement, 20% pour le test)
SPLIT_RATIO = 0.8
# Fixer la graine aléatoire pour la reproductibilité (avoir le même split à chaque fois)
random.seed(42)

CLASSES_METIER = ["Export", "Marche_Local", "Rejet"]

def create_gold_layer():
    print("🏆 Démarrage de la préparation Gold (Train/Val Split)...\n")
    
    if not SILVER_DIR.exists():
        print(f"❌ Erreur : Le dossier Silver {SILVER_DIR} n'existe pas.")
        return

    # Nettoyer le dossier Gold s'il existe déjà pour éviter les doublons lors des relances
    if GOLD_DIR.exists():
        print("🧹 Nettoyage de l'ancien dossier Gold...")
        shutil.rmtree(GOLD_DIR)

    # Création de l'architecture Gold requise par PyTorch/TensorFlow
    for split in ['train', 'val']:
        for classe in CLASSES_METIER:
            (GOLD_DIR / split / classe).mkdir(parents=True, exist_ok=True)
            
    print("🏗️  Architecture Gold prête (train/ et val/).")

    total_train = 0
    total_val = 0

    # --- 2. LOGIQUE DE SÉPARATION ---
    for classe in CLASSES_METIER:
        source_dir = SILVER_DIR / classe
        
        if not source_dir.exists():
            continue
            
        # Récupérer toutes les images de cette classe
        images = [f for f in source_dir.glob("*.*") if f.is_file()]
        
        if not images:
            print(f"⚠️ Aucun fichier trouvé dans Silver/{classe}. Classe ignorée.")
            continue
            
        # Mélanger les images aléatoirement
        random.shuffle(images)
        
        # Calculer le point de coupure (80%)
        split_index = int(len(images) * SPLIT_RATIO)
        
        train_images = images[:split_index]
        val_images = images[split_index:]
        
        print(f"🔄 Déplacement de la classe '{classe}' : {len(train_images)} Train | {len(val_images)} Val")
        
        # Copier les images vers Gold/train
        for img_path in train_images:
            shutil.copy2(img_path, GOLD_DIR / 'train' / classe / img_path.name)
            total_train += 1
            
        # Copier les images vers Gold/val
        for img_path in val_images:
            shutil.copy2(img_path, GOLD_DIR / 'val' / classe / img_path.name)
            total_val += 1

    # --- Bilan ---
    print("\n" + "="*40)
    print("📊 BILAN DE LA ZONE GOLD")
    print("="*40)
    print(f"Total des images d'Entraînement (Train) : {total_train}")
    print(f"Total des images de Validation (Val)  : {total_val}")
    print("="*40)
    print("🚀 Les données sont prêtes à être ingérées par le modèle IA !")

if __name__ == "__main__":
    create_gold_layer()