# 🚀 Déploiement Frontend - Vercel

## Prérequis

✅ Backend déployé sur Railway
✅ URL Railway copiée (ex: `https://heartmatch.up.railway.app`)

## Option 1 : Via Vercel CLI (Rapide)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Déployer
cd dating-app-frontend
vercel

# 4. Suivre les instructions
# - Setup and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? heartmatch (ou autre)
# - Directory? ./
# - Override settings? No

# 5. Ajouter la variable d'environnement
vercel env add NEXT_PUBLIC_API_URL

# Entrer: https://votre-url-railway.up.railway.app/api

# 6. Redéployer avec la variable
vercel --prod
```

## Option 2 : Via GitHub (Recommandé)

### 1. Push sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/heartmatch.git
git push -u origin main
```

### 2. Connecter à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. "Add New Project"
3. "Import Git Repository"
4. Sélectionner votre repo `heartmatch`
5. Framework Preset: **Next.js** (auto-détecté)
6. Root Directory: `./` ou `dating-app-frontend` si mono-repo

### 3. Configurer les variables

Dans "Environment Variables" :
- **Key** : `NEXT_PUBLIC_API_URL`
- **Value** : `https://votre-url-railway.up.railway.app/api`
- **Environments** : Production, Preview, Development

### 4. Déployer

Cliquer sur "Deploy" → Vercel build et déploie automatiquement !

## Option 3 : Manuel (Avancé)

```bash
# Build local
npm run build

# Tester en production
npm run start

# Déployer
vercel --prod
```

## Après le déploiement

### Votre app est live ! 🎉

- **Frontend** : `https://heartmatch.vercel.app`
- **Backend** : `https://heartmatch.up.railway.app`

### Configurer le domaine personnalisé (Optionnel)

1. Dans Vercel Dashboard → Settings → Domains
2. Ajouter votre domaine (ex: `heartmatch.app`)
3. Configurer les DNS selon les instructions

## 🔄 Déploiement Continu

Avec GitHub connecté :
- Chaque `git push` sur `main` → Déploiement automatique en production
- Chaque PR → Preview deployment automatique

## 📊 Monitoring

Vercel Dashboard affiche :
- Analytics (visiteurs, pages vues)
- Performance (Core Web Vitals)
- Logs en temps réel
- Build history

## ⚙️ Configuration Avancée

### Variables d'environnement multiples

```bash
# Production
vercel env add NEXT_PUBLIC_API_URL production

# Preview (branches)
vercel env add NEXT_PUBLIC_API_URL preview

# Development
vercel env add NEXT_PUBLIC_API_URL development
```

### Domaines par environnement

- Production : `heartmatch.app`
- Preview : `preview-heartmatch.vercel.app`
- Development : `dev-heartmatch.vercel.app`

## 🆘 Troubleshooting

### Build échoue

```bash
# Vérifier en local
npm run build

# Voir les logs Vercel
vercel logs
```

### API ne répond pas

Vérifier que `NEXT_PUBLIC_API_URL` :
- Est bien configuré dans Vercel
- Pointe vers Railway avec `/api` à la fin
- Railway backend est bien déployé

### CORS errors

Dans le backend (`server.js`), vérifier :
```javascript
app.use(cors({
  origin: ['https://heartmatch.vercel.app', 'http://localhost:3000']
}));
```

## 💰 Coûts

- **Hobby Plan** : Gratuit (100GB bandwidth)
- **Pro Plan** : $20/mois (1TB bandwidth)

## ✅ Checklist Finale

- [ ] Backend Railway déployé
- [ ] Variables d'environnement configurées
- [ ] Frontend Vercel déployé
- [ ] API URL correcte dans Vercel
- [ ] Test de l'app en production
- [ ] CORS configuré
- [ ] Domaine personnalisé (optionnel)

---

🎉 **Votre app HeartMatch est maintenant en ligne !**
