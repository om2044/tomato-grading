import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Correction classique : SQLAlchemy demande 'postgresql://' et non 'postgres://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Création du moteur
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # Test connection before use — recovers from Neon idle timeout
    pool_recycle=300,     # Recycle connections every 5 min (before Neon kills them)
    pool_size=5,
    max_overflow=2,
)

# Création de la session (l'usine à requêtes)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Fonction pour fournir la connexion aux autres fichiers (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()