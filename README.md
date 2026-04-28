# 🍅 TomatoGrade — Classification industrielle de tomates par CNN

[![CI](https://github.com/TON_USERNAME/tomato-grading/actions/workflows/ci.yml/badge.svg)](https://github.com/TON_USERNAME/tomato-grading/actions)

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
# 1. Cloner
git clone https://github.com/TON_USERNAME/tomato-grading.git
cd tomato-grading

# 2. Configurer les variables d'environnement
make env

# 3. Entraîner le modèle
make train

# 4. Lancer toute l'application
make dev
```

Accès :
- Frontend : http://localhost:3000
- API docs : http://localhost:8000/docs

## Dataset
Tomato Maturity Detection & Quality Grading — Mendeley Data (DOI: 10.17632/s42kpg8h37.1)
2 986 images originales · 10 000 images augmentées · Licence CC BY 4.0
