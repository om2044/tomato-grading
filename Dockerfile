# Utiliser une version légère de Python
FROM python:3.11-slim

# Éviter que Python ne génère des fichiers .pyc et forcer l'affichage des logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installer les dépendances système nécessaires pour PostgreSQL (psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les librairies Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du projet
COPY . .

# Commande par défaut (peut être surchargée)
CMD ["python"]