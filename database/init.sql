-- Schéma initial PostgreSQL — Tomato Grading SaaS
-- Multi-tenant : chaque tenant = une usine cliente

CREATE TABLE IF NOT EXISTS tenants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    plan        VARCHAR(20) DEFAULT 'starter',
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email       VARCHAR(150) UNIQUE NOT NULL,
    hashed_pwd  TEXT NOT NULL,
    role        VARCHAR(20) DEFAULT 'operator',  -- admin | operator
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id),
    classe      CHAR(1) NOT NULL,              -- A | B | C
    confidence  FLOAT NOT NULL,
    decision    VARCHAR(20) NOT NULL,           -- Export | Local | Rejet
    image_path  TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,           -- high_rejection_rate
    threshold   FLOAT NOT NULL,
    triggered   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_predictions_tenant   ON predictions(tenant_id);
CREATE INDEX idx_predictions_created  ON predictions(created_at DESC);
CREATE INDEX idx_predictions_classe   ON predictions(classe);
