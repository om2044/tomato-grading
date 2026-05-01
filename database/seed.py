import os
import random
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# 1. Charger les variables d'environnement (le fichier .env)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERREUR: DATABASE_URL introuvable dans le fichier .env")
    exit(1)

def seed_database():
    print("🔌 Connexion à Neon.tech en cours...")
    try:
        # Se connecter à la base PostgreSQL
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # 2. Créer une usine (Tenant)
        print("🏭 Création de l'usine 'Agadir Tomato Factory'...")
        cursor.execute("""
            INSERT INTO tenants (name, plan)
            VALUES ('Agadir Tomato Factory', 'premium')
            RETURNING id;
        """)
        tenant_id = cursor.fetchone()[0]

        # 3. Créer des utilisateurs
        print("👥 Création des opérateurs...")
        cursor.execute("""
            INSERT INTO users (tenant_id, email, hashed_pwd, role)
            VALUES
            (%s, 'admin@agadir-tomato.com', 'fake_hash_123', 'admin'),
            (%s, 'operateur1@agadir-tomato.com', 'fake_hash_456', 'operator')
            RETURNING id;
        """, (tenant_id, tenant_id))
        
        # Récupérer l'ID de l'admin pour l'associer aux prédictions
        user_ids = [row[0] for row in cursor.fetchall()]
        admin_id = user_ids[0]

        # 4. Générer 20 prédictions (scans de tomates) aléatoires
        print("🍅 Injection de 20 scans de tomates dans l'historique...")
        
        # Logique métier (plus de A que de C)
        classes_possibles = ['A', 'A', 'A', 'B', 'B', 'C'] 
        decisions_map = {'A': 'Export', 'B': 'Local', 'C': 'Rejet'}

        predictions_data = []
        for _ in range(20):
            classe = random.choice(classes_possibles)
            decision = decisions_map[classe]
            confidence = round(random.uniform(0.85, 0.99), 3) # Score IA entre 85% et 99%

            # Simuler des heures différentes (dans les 2 dernières heures)
            random_minutes = random.randint(0, 120)
            created_at = datetime.now() - timedelta(minutes=random_minutes)

            predictions_data.append((
                tenant_id,
                admin_id,
                classe,
                confidence,
                decision,
                None, # image_path (vide pour le moment)
                created_at
            ))

        # Insertion de masse (très performant en SQL)
        execute_values(
            cursor,
            """
            INSERT INTO predictions 
            (tenant_id, user_id, classe, confidence, decision, image_path, created_at) 
            VALUES %s
            """,
            predictions_data
        )

        # 5. Valider (sauvegarder) les changements
        conn.commit()
        print("✅ SUCCÈS ! La base de données est remplie et prête pour le front-end.")

    except Exception as e:
        print(f"❌ Erreur lors du seed : {e}")
        if conn:
            conn.rollback() # Annuler en cas d'erreur
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("🔌 Connexion fermée.")

if __name__ == "__main__":
    seed_database()