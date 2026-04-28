"""
Lance tout le pipeline AI de A à Z :
Bronze (ingestion + validation) → Argent (nettoyage + EDA) → Or (split + augmentation) → Entraînement
"""
import subprocess, sys

STEPS = [
    ("Bronze — Ingestion",      "pipeline/01_bronze_ingestion.py"),
    ("Bronze — Validation",     "pipeline/02_bronze_validation.py"),
    ("Argent — Nettoyage",      "pipeline/03_silver_cleaning.py"),
    ("Argent — EDA",            "pipeline/04_silver_eda.py"),
    ("Or — Split",              "pipeline/05_gold_split.py"),
    ("Or — Augmentation",       "pipeline/06_gold_augmentation.py"),
    ("Modèle — Entraînement",   "models/train.py"),
]

for label, script in STEPS:
    print(f"\n{'━'*50}\n  {label}\n{'━'*50}")
    result = subprocess.run([sys.executable, script])
    if result.returncode != 0:
        print(f"  ✗ Échec à l'étape : {label}")
        sys.exit(1)
    print(f"  ✓ {label} terminé")

print("\n🍅 Pipeline complet terminé — modèle prêt dans ai/models/saved/")
