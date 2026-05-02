import os
from pathlib import Path
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent.parent.parent
TRAIN_DIR = BASE_DIR / "data" / "gold" / "train"

CLASSES_METIER = ["Export", "Marche_Local", "Rejet"]

# Nombre de nouvelles images à générer pour chaque image originale
AUGMENTATION_MULTIPLIER = 3 

# Configuration des déformations réalistes pour des tomates
datagen = ImageDataGenerator(
    rotation_range=40,      # Tourner l'image jusqu'à 40 degrés
    width_shift_range=0.1,  # Décaler légèrement horizontalement
    height_shift_range=0.1, # Décaler légèrement verticalement
    zoom_range=0.2,         # Zoomer ou dézoomer de 20%
    horizontal_flip=True,   # Inverser l'image (effet miroir)
    fill_mode='reflect'     # Remplir les pixels vides après une rotation
)

def augment_training_data():
    print("🧬 Démarrage de l'Augmentation des données Gold (Train uniquement)...\n")

    if not TRAIN_DIR.exists():
        print(f"❌ Erreur : Le dossier {TRAIN_DIR} n'existe pas. Lancez le script 05 d'abord.")
        return

    total_generated = 0

    for classe in CLASSES_METIER:
        class_dir = TRAIN_DIR / classe
        if not class_dir.exists(): continue

        # On liste uniquement les images originales (pour ne pas re-augmenter des images déjà augmentées en cas de double lancement)
        original_images = [f for f in class_dir.glob("*.*") if not f.name.startswith("aug_")]
        
        if not original_images:
            continue
            
        print(f"🔄 Augmentation de la classe '{classe}' ({len(original_images)} images originales)...")

        for img_path in original_images:
            try:
                # Charger l'image et la convertir en tableau numpy
                img = load_img(img_path)
                x = img_to_array(img)
                x = x.reshape((1,) + x.shape) # Format attendu par Keras (1, 224, 224, 3)

                # Générer de nouvelles images et les sauvegarder
                i = 0
                for batch in datagen.flow(x, batch_size=1, save_to_dir=class_dir, save_prefix=f'aug_{img_path.stem}', save_format='jpeg'):
                    i += 1
                    total_generated += 1
                    if i >= AUGMENTATION_MULTIPLIER:
                        break # On s'arrête après avoir généré le nombre voulu de copies
            except Exception as e:
                print(f"  ❌ Erreur avec {img_path.name}: {e}")

    print("\n" + "="*40)
    print("📊 BILAN DE L'AUGMENTATION")
    print("="*40)
    print(f"Images physiquement générées : +{total_generated}")
    print("="*40)
    print("🚀 Les données Train sont désormais gonflées à bloc !")

if __name__ == "__main__":
    augment_training_data()