# 🚀 Déploiement Railway - HeartMatch Backend

## Étape 1 : Préparer Railway

1. **Créer un compte** sur [railway.app](https://railway.app)
2. **Installer Railway CLI** :
```bash
npm i -g @railway/cli
```

3. **Login** :
```bash
railway login
```

## Étape 2 : Créer le projet

```bash
cd backend
railway init
```

Choisir : "Create new project"

## Étape 3 : Ajouter PostgreSQL

```bash
railway add --database postgres
```

Railway va automatiquement créer une base de données et générer `DATABASE_URL`.

## Étape 4 : Configurer les variables d'environnement

```bash
railway variables set JWT_SECRET="votre-secret-jwt-super-securise-ici"
railway variables set NODE_ENV="production"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set UPLOAD_PATH="./uploads"
```

**Note** : `DATABASE_URL` et `PORT` sont automatiquement configurés par Railway.

## Étape 5 : Déployer

```bash
railway up
```

Ou via GitHub :
1. Push votre code sur GitHub
2. Dans Railway Dashboard : "New Project" → "Deploy from GitHub"
3. Sélectionner votre repo
4. Railway détecte automatiquement Node.js

## Étape 6 : Vérifier le déploiement

```bash
# Voir les logs
railway logs

# Ouvrir le dashboard
railway open

# Obtenir l'URL publique
railway domain
```

## Étape 7 : Générer un domaine public

Dans Railway Dashboard :
1. Aller dans "Settings"
2. Cliquer sur "Generate Domain"
3. Copier l'URL (ex: `https://votre-app.up.railway.app`)

## Étape 8 : Configurer le Frontend

Dans votre frontend, créer `.env.local` :
```env
NEXT_PUBLIC_API_URL=https://votre-app.up.railway.app/api
```

## Étape 9 : Déployer le Frontend sur Vercel

```bash
cd ../dating-app-frontend
vercel
```

Ajouter la variable d'environnement dans Vercel Dashboard :
- `NEXT_PUBLIC_API_URL` = URL Railway

## 🔧 Commandes utiles

```bash
# Redéployer
railway up

# Voir les variables
railway variables

# Exécuter une commande
railway run npm run migrate

# Voir les logs en temps réel
railway logs -f

# Ouvrir Prisma Studio (en local connecté à Railway DB)
railway run npx prisma studio
```

## 📊 Monitoring

Railway Dashboard affiche :
- CPU/RAM usage
- Logs en temps réel
- Métriques de déploiement
- Variables d'environnement

## 🔐 Sécurité

✅ Variables d'environnement sécurisées
✅ HTTPS automatique
✅ Base de données PostgreSQL isolée
✅ Backups automatiques

## 💰 Coûts

- **Hobby Plan** : $5/mois (500h d'exécution)
- **Pro Plan** : $20/mois (usage illimité)

## ⚠️ Important

- Les fichiers `uploads/` ne persistent pas sur Railway (utiliser S3/Cloudinary en production)
- Les migrations Prisma s'exécutent automatiquement au déploiement
- Railway redémarre automatiquement en cas d'erreur

## 🆘 Troubleshooting

**Erreur de migration** :
```bash
railway run npx prisma migrate reset
railway run npx prisma migrate deploy
```

**Voir la base de données** :
```bash
railway run npx prisma studio
```

**Logs détaillés** :
```bash
railway logs --tail 100
```

---

✅ **Votre backend est maintenant déployé sur Railway !**
