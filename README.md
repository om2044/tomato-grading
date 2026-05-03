# 🍅 TomatoGrade — Classification industrielle de tomates par CNN

[![CI](https://github.com/om2044/tomato-grading/actions/workflows/ci.yml/badge.svg)](https://github.com/om2044/tomato-grading/actions)

Solution SaaS B2B de tri automatique de tomates récoltées par deep learning.
Classifie chaque tomate en **Classe A** (export), **Classe B** (marché local) ou **Classe C** (rejet).

## Stack technique
| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend  | FastAPI + PostgreSQL + JWT |
| AI       | TensorFlow/Keras — CNN from scratch |
| Infra    | Docker Compose + Nginx + GitHub Actions |

## Architecture des données — Médaillon
```
Bronze (raw) → Argent (clean) → Or (ML-ready) → CNN → API → Frontend
```

## Démarrage rapide

```bash
# 1. Cloner le projet
git clone [https://github.com/om2044/tomato-grading.git](https://github.com/om2044/tomato-grading.git)
cd tomato-grading

# 2. Créer et activer l'environnement virtuel
python -m venv .venv
# Sur Windows :
.\.venv\Scripts\activate
# Sur Mac/Linux :
# source .venv/bin/activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configurer les variables d'environnement
# (Assurez-vous que Make est installé sur votre machine)
# pour windows
winget install GnuWin32.Make

make env

# 5. Entraîner le modèle
make train

# 6. Lancer toute l'application
make dev

Accès :
- Frontend : http://localhost:3000
- API docs : http://localhost:8000/docs

## Dataset

**Kaggle Dataset :** [Tomato Quality Classification (Augmented)](https://www.kaggle.com/datasets/mohamedafkir90/tomato-quality-classification)

Notre modèle a été entraîné sur une version augmentée et préparée pour le machine learning, accessible publiquement via le lien ci-dessus. 

* **Source originale :** Tomato Maturity Detection & Quality Grading — Mendeley Data (DOI: 10.17632/s42kpg8h37.1)
* **Volume :** 2 986 images originales · 10 000+ images augmentées
* **Licence :** CC BY 4.0


