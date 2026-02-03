# 🚀 Déploiement Rapide - 3 Minutes

## Option 1 : Script Automatique (Recommandé)

### Windows
```bash
cd backend
deploy-railway.bat
```

### Linux/Mac
```bash
cd backend
chmod +x deploy-railway.sh
./deploy-railway.sh
```

## Option 2 : Manuel

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialiser
cd backend
railway init

# 4. Ajouter PostgreSQL
railway add --database postgres

# 5. Variables d'environnement
railway variables set JWT_SECRET="votre-secret-ici"
railway variables set NODE_ENV="production"

# 6. Déployer
railway up

# 7. Générer domaine
railway domain
```

## Option 3 : Via GitHub (Le plus simple)

1. Push votre code sur GitHub
2. Aller sur [railway.app](https://railway.app)
3. "New Project" → "Deploy from GitHub"
4. Sélectionner votre repo
5. Ajouter PostgreSQL depuis le dashboard
6. Configurer les variables d'environnement :
   - `JWT_SECRET` : votre secret
   - `NODE_ENV` : production
7. Railway déploie automatiquement !

## Après le déploiement

1. **Copier l'URL Railway** (ex: `https://heartmatch-backend.up.railway.app`)

2. **Configurer le Frontend** :
```bash
cd ../dating-app-frontend
```

Créer `.env.local` :
```env
NEXT_PUBLIC_API_URL=https://votre-url-railway.up.railway.app/api
```

3. **Déployer le Frontend sur Vercel** :
```bash
vercel
```

## ✅ C'est tout !

Votre app est maintenant en ligne :
- Backend : Railway
- Frontend : Vercel
- Database : Railway PostgreSQL

## 📊 Vérifier

```bash
# Logs
railway logs

# Dashboard
railway open

# Tester l'API
curl https://votre-url.up.railway.app/health
```

## 🆘 Problème ?

Voir `RAILWAY_DEPLOY.md` pour le guide complet.
