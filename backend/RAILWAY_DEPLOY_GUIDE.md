# 🚀 Déploiement Backend sur Railway

## Méthode 1: Script Automatique (Recommandé)

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

---

## Méthode 2: Manuelle

### 1. Installer Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login Railway

```bash
railway login
```

Cela ouvrira votre navigateur pour vous connecter.

### 3. Créer un nouveau projet ou lier existant

**Nouveau projet:**
```bash
railway init
```

**Lier projet existant:**
```bash
railway link
```

### 4. Ajouter PostgreSQL

```bash
railway add --database postgres
```

Railway va automatiquement:
- Créer une base PostgreSQL
- Générer DATABASE_URL
- L'ajouter aux variables d'environnement

### 5. Configurer les variables d'environnement

```bash
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key-here
```

### 6. Générer Prisma Client

```bash
npx prisma generate
```

### 7. Pousser le schéma vers la DB

```bash
railway run npx prisma db push
```

Ou avec migration:
```bash
railway run npx prisma migrate deploy
```

### 8. Seed les rooms système

```bash
railway run npx ts-node src/rooms/rooms.seeder.ts
```

### 9. Déployer

```bash
railway up
```

---

## Méthode 3: Via GitHub (CI/CD)

### 1. Connecter GitHub à Railway

1. Aller sur [railway.app](https://railway.app)
2. Créer nouveau projet
3. Choisir "Deploy from GitHub repo"
4. Sélectionner votre repo

### 2. Ajouter PostgreSQL

Dans le dashboard Railway:
- Cliquer "New" → "Database" → "PostgreSQL"

### 3. Configurer Build Command

Dans Settings → Deploy:

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

### 4. Variables d'environnement

Ajouter dans Railway Dashboard → Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key
```

### 5. Deploy Hook (Post-Deploy)

Créer `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma db push && npx ts-node src/rooms/rooms.seeder.ts && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Vérification du Déploiement

### 1. Obtenir l'URL

```bash
railway domain
```

Ou dans le dashboard Railway.

### 2. Tester l'API

```bash
curl https://your-app.railway.app/health
```

### 3. Tester les Rooms

```bash
curl https://your-app.railway.app/v1/rooms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Variables d'Environnement Requises

```env
# Database (Auto-généré par Railway)
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=production

# Auth
JWT_SECRET=your-super-secret-key-change-this

# Optional
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## Commandes Utiles

### Voir les logs
```bash
railway logs
```

### Ouvrir le dashboard
```bash
railway open
```

### Exécuter une commande
```bash
railway run <command>
```

### Redéployer
```bash
railway up --detach
```

### Variables
```bash
railway variables
railway variables set KEY=value
railway variables delete KEY
```

---

## Troubleshooting

### Erreur: Prisma Client not generated

```bash
railway run npx prisma generate
railway up
```

### Erreur: Database connection failed

Vérifier DATABASE_URL:
```bash
railway variables
```

### Erreur: Port already in use

Railway assigne automatiquement le port. Utiliser:
```typescript
const port = process.env.PORT || 3001;
```

### Rooms non créées

Exécuter manuellement:
```bash
railway run npx ts-node src/rooms/rooms.seeder.ts
```

---

## Post-Déploiement

### 1. Mettre à jour le Frontend

Dans `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### 2. Configurer CORS

Dans `main.ts`:
```typescript
app.enableCors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
});
```

### 3. Tester WebSocket

```javascript
const socket = io('https://your-backend.railway.app/rooms');
```

---

## Monitoring

### Railway Dashboard
- CPU/Memory usage
- Logs en temps réel
- Metrics

### Logs
```bash
railway logs --follow
```

---

## Rollback

```bash
railway rollback
```

Ou dans le dashboard: Deployments → Rollback

---

## Custom Domain

1. Railway Dashboard → Settings → Domains
2. Ajouter votre domaine
3. Configurer DNS:
   - Type: CNAME
   - Name: api (ou @)
   - Value: your-app.railway.app

---

## Coûts

Railway offre:
- $5 de crédit gratuit/mois
- Pay-as-you-go après

Estimation:
- Backend Node.js: ~$5-10/mois
- PostgreSQL: ~$5/mois
- Total: ~$10-15/mois

---

## Support

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

---

**✅ Votre backend est maintenant déployé sur Railway avec:**
- PostgreSQL database
- Prisma ORM
- 13 system rooms pré-créées
- WebSocket support
- Auto-scaling
- HTTPS automatique
