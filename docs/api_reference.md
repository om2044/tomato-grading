# API Reference

## Auth
POST /api/auth/login      — obtenir un token JWT
POST /api/auth/refresh    — rafraîchir le token
POST /api/auth/logout     — invalider le token

## Predict
POST /api/predict         — classifier une image de tomate
  Body: multipart/form-data { image: File }
  Response: { classe: "A", confidence: 0.94, decision: "Export" }

## History
GET /api/history          — liste des classifications passées
GET /api/history/{id}     — détail d'une classification

## Dashboard
GET /api/dashboard/stats  — statistiques globales (% A/B/C, tendance)

## Alerts
GET  /api/alerts          — liste des alertes actives
POST /api/alerts          — créer une règle d'alerte

## Reports
GET /api/reports/pdf      — exporter rapport PDF
GET /api/reports/csv      — exporter données CSV

## Users
GET    /api/users         — liste des utilisateurs (admin only)
POST   /api/users         — créer un utilisateur
DELETE /api/users/{id}    — supprimer un utilisateur
