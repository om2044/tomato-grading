import os
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns

# --- 1. Configuration des chemins ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SILVER_DIR = BASE_DIR / "data" / "silver"
# On crée un dossier spécial pour stocker les rapports visuels
EDA_DIR = BASE_DIR / "data" / "eda_reports"

CLASSES_METIER = ["Export", "Marche_Local", "Rejet"]

def run_silver_eda():
    print("📊 Démarrage de l'Analyse Exploratoire (EDA) Silver...\n")
    
    EDA_DIR.mkdir(parents=True, exist_ok=True)
    
    if not SILVER_DIR.exists():
        print(f"❌ Erreur : Le dossier {SILVER_DIR} n'existe pas. Lancez le script 03 d'abord.")
        return

    # --- 2. Comptage des données ---
    counts = {}
    total_images = 0
    
    for classe in CLASSES_METIER:
        class_dir = SILVER_DIR / classe
        if class_dir.exists():
            # On compte le nombre de fichiers dans le dossier
            nb_images = len([f for f in class_dir.glob("*.*") if f.is_file()])
            counts[classe] = nb_images
            total_images += nb_images
        else:
            counts[classe] = 0

    print("📈 Distribution actuelle des données dans l'usine (Zone Silver) :")
    for classe, count in counts.items():
        pourcentage = (count / total_images * 100) if total_images > 0 else 0
        print(f"  - {classe} : {count} images ({pourcentage:.1f}%)")

    # --- 3. Génération du Graphique ---
    if total_images == 0:
        print("\n⚠️ Aucune image à analyser. Arrêt du script.")
        return

    plt.figure(figsize=(10, 6))
    sns.set_theme(style="whitegrid")
    
    # Création d'un beau diagramme en barres
    ax = sns.barplot(x=list(counts.keys()), y=list(counts.values()), palette="viridis")
    
    # Ajout des valeurs au-dessus des barres
    for p in ax.patches:
        ax.annotate(f'{int(p.get_height())}', 
                    (p.get_x() + p.get_width() / 2., p.get_height()), 
                    ha = 'center', va = 'center', 
                    xytext = (0, 9), 
                    textcoords = 'offset points')

    plt.title("Répartition des Tomates par Classe (Zone Silver)", fontsize=16, pad=20)
    plt.xlabel("Classes Métier", fontsize=12)
    plt.ylabel("Nombre d'images", fontsize=12)
    
    # --- 4. Sauvegarde et Affichage ---
    save_path = EDA_DIR / "silver_class_distribution.png"
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    print(f"\n✅ Graphique HD sauvegardé avec succès dans : {save_path.relative_to(BASE_DIR)}")
    
    print("👀 Ouverture du graphique sur votre écran...")
    plt.show()

if __name__ == "__main__":
    run_silver_eda()