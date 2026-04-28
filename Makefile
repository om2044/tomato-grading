.PHONY: dev test deploy train clean

# Lance tout en local (développement)
dev:
	cd infra && docker-compose up --build

# Lance les tests
test:
	cd backend && pytest tests/ -v
	cd frontend && npm test

# Déploie en production
deploy:
	cd infra && docker-compose -f docker-compose.prod.yml up -d --build

# Entraîne le modèle CNN
train:
	cd ai && python run_pipeline.py

# Nettoie les conteneurs et volumes
clean:
	cd infra && docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .ipynb_checkpoints -exec rm -rf {} +

# Initialise la base de données
db-init:
	cd infra && docker-compose up db -d
	sleep 3
	docker exec -i tomato-grading-db-1 psql -U user -d tomato_grading < database/init.sql

# Variables d'environnement
env:
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env
	cp .env.example .env
	@echo "⚠️  Modifie les .env avec tes vraies valeurs !"
