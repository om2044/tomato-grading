# Architecture Technique — Tomato Grading

## Vue d'ensemble
Solution SaaS B2B de classification industrielle de tomates par CNN.

## Stack
| Couche     | Technologie                        |
|------------|------------------------------------|
| Frontend   | React 18 + Vite + TailwindCSS      |
| Backend    | FastAPI + SQLAlchemy               |
| Base de données | PostgreSQL 16               |
| AI         | TensorFlow/Keras — CNN from scratch |
| Infra      | Docker + Nginx + GitHub Actions    |

## Architecture des données — Médaillon
Bronze (données brutes) → Argent (nettoyées) → Or (ML-ready)

## Modèle de classification
- **Classe A** : tomate export international
- **Classe B** : marché local
- **Classe C** : rejet
