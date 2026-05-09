import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# 1. Charge les variables du fichier .env
load_dotenv()

# --- Configuration des chemins absolus ---
# Omar ayont le dossier data car il'a pas possible de pusher les données sur GitHub.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

BRONZE_DIR = DATA_DIR / "bronze"
KAGGLE_DIR = BRONZE_DIR / "kaggle"
CUSTOM_DIR = BRONZE_DIR / "custom_photos"

CLASSES_METIER = ["Export", "Marche_Local", "Rejet"]
DATASET_NAME = "mohamedafkir90/tomato-quality-classification"

def setup_architecture():
    """Crée l'arborescence des dossiers si elle n'existe pas."""
    print("🏗️  Création de l'architecture Data (Bronze/Silver/Gold)...")
    
    (DATA_DIR / "silver").mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "gold").mkdir(parents=True, exist_ok=True)
    KAGGLE_DIR.mkdir(parents=True, exist_ok=True)
    
    for classe in CLASSES_METIER:
        (CUSTOM_DIR / classe).mkdir(parents=True, exist_ok=True)
        
    print("✅ Architecture locale prête.")

def ingest_kaggle_data():
    """Tente de télécharger les données Kaggle."""
    # On vérifie d'abord s'il y a déjà des images (pour ne pas re-télécharger pour rien)
    if any(KAGGLE_DIR.iterdir()):
        print("\n📦 Les données Kaggle semblent déjà présentes. Ingestion ignorée.")
        return

    print(f"\n📥 Tentative de téléchargement du dataset Kaggle ({DATASET_NAME})...")
    
    # 2. On force l'envoi des variables d'environnement au terminal
    env_vars = os.environ.copy()
    
    try:
        subprocess.run([
            "kaggle", "datasets", "download", 
            "-d", DATASET_NAME, 
            "-p", str(KAGGLE_DIR), 
            "--unzip"
        ], check=True, env=env_vars)
        print("\n🎉 TÉLÉCHARGEMENT RÉUSSI ET AUTOMATISÉ !")
        
    except subprocess.CalledProcessError:
        print("\n❌ ERREUR Kaggle : Accès refusé ou dataset introuvable.")
        print("💡 Vérifiez que vos identifiants dans le fichier .env sont corrects.")
        afficher_fallback()
        
    except FileNotFoundError:
        print("\n❌ ERREUR : La commande 'kaggle' n'est pas installée sur cette machine.")
        print("💡 Exécutez : pip install kaggle")
        afficher_fallback()

def afficher_fallback():
    """Affiche les instructions manuelles si tout échoue."""
    print("\n" + "="*60)
    print("👨‍💻 MESSAGE POUR L'ÉQUIPE (ACTION REQUISE) :")
    print("1. Vous n'avez pas configuré votre fichier .env correctement.")
    print("2. Ce n'est pas grave ! Téléchargez l'archive manuellement ici :")
    print(f"   -> https://www.kaggle.com/datasets/{DATASET_NAME}")
    print("3. Extrayez le contenu du fichier ZIP directement dans :")
    print(f"   -> {KAGGLE_DIR.relative_to(BASE_DIR)}")
    print("="*60 + "\n")

if __name__ == "__main__":
    print("🚀 Démarrage du Pipeline - 01 : INGESTION BRONZE\n")
    setup_architecture()
    ingest_kaggle_data()