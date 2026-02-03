# 🚀 Déploiement Complet sur Railway

## Déploiement Automatique (1 commande)

```bash
deploy-all-railway.bat
```

Le script va :
1. ✅ Déployer le backend + PostgreSQL
2. ✅ Déployer le frontend
3. ✅ Configurer automatiquement les URLs

## Déploiement Manuel

### 1. Backend

```bash
cd backend
railway login
railway init
railway add --database postgres
railway variables set JWT_SECRET="votre-secret"
railway variables set NODE_ENV="production"
railway up
railway domain
```

Copier l'URL backend (ex: `https://backend-xxx.up.railway.app`)

### 2. Frontend

```bash
cd ..
railway init
railway variables set NEXT_PUBLIC_API_URL="https://backend-xxx.up.railway.app/api"
railway up
railway domain
```

## Via GitHub (Plus Simple)

### Backend
1. Push `backend/` sur GitHub
2. Railway → New Project → Deploy from GitHub
3. Sélectionner le repo
4. Root Directory: `/backend`
5. Add PostgreSQL
6. Variables: `JWT_SECRET`, `NODE_ENV=production`

### Frontend
1. Railway → New Project → Deploy from GitHub
2. Même repo
3. Root Directory: `/` (racine)
4. Variable: `NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app/api`

## Résultat

- **Backend**: `https://backend-xxx.up.railway.app`
- **Frontend**: `https://frontend-xxx.up.railway.app`
- **Database**: PostgreSQL automatique

## Coûts

- **Hobby**: $5/mois (500h)
- **Pro**: $20/mois (illimité)
- 2 services = 2x le prix

## Commandes Utiles

```bash
# Voir les logs
railway logs

# Dashboard
railway open

# Redéployer
railway up

# Changer de projet
railway link
```

---

✅ **Tout est sur Railway !**
