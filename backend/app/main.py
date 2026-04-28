from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, predict, history, dashboard, alerts, reports, users

app = FastAPI(
    title="Tomato Grading API",
    description="Classification industrielle de tomates — Classe A/B/C",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(predict.router,   prefix="/api/predict",   tags=["Predict"])
app.include_router(history.router,   prefix="/api/history",   tags=["History"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(alerts.router,    prefix="/api/alerts",    tags=["Alerts"])
app.include_router(reports.router,   prefix="/api/reports",   tags=["Reports"])
app.include_router(users.router,     prefix="/api/users",     tags=["Users"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "tomato-grading-api"}
