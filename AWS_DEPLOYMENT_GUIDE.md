# Guide de Déploiement AWS - HeartMatch

Ce guide explique comment déployer l'application complète sur AWS avec :
- **Frontend** : Next.js sur AWS Amplify
- **Backend Node.js** : Express sur AWS Elastic Beanstalk
- **Backend Python** : FastAPI sur AWS Elastic Beanstalk
- **Base de données** : PostgreSQL sur AWS RDS

## 📋 Prérequis

1. Compte AWS actif
2. AWS CLI installé et configuré
3. Node.js 18+ installé
4. Python 3.9+ installé
5. Git installé

## 🗄️ Étape 1 : Déployer la Base de Données (RDS PostgreSQL)

### 1.1 Créer une instance RDS PostgreSQL

```bash
# Via AWS Console
1. Aller sur RDS → Create database
2. Choisir PostgreSQL (version 15+)
3. Template: Free tier (ou Production selon besoins)
4. DB instance identifier: heartmatch-db
5. Master username: postgres
6. Master password: [VOTRE_MOT_DE_PASSE_SECURISE]
7. DB instance class: db.t3.micro (Free tier)
8. Storage: 20 GB
9. VPC: Default VPC
10. Public access: Yes (pour développement)
11. Security group: Créer nouveau "heartmatch-db-sg"
12. Database name: heartmatch
13. Créer la base de données
```

### 1.2 Configurer le Security Group

```bash
# Ajouter une règle entrante
Type: PostgreSQL
Protocol: TCP
Port: 5432
Source: 0.0.0.0/0 (pour développement) ou votre IP
```

### 1.3 Noter les informations de connexion

```
Endpoint: heartmatch-db.xxxxxxxxx.region.rds.amazonaws.com
Port: 5432
Database: heartmatch
Username: postgres
Password: [VOTRE_MOT_DE_PASSE]
```

## 🔧 Étape 2 : Déployer le Backend Node.js (Elastic Beanstalk)

### 2.1 Préparer l'application

```bash
cd backend

# Créer .ebignore
echo "node_modules/
.env
.git/
uploads/
*.log" > .ebignore
```

### 2.2 Initialiser Elastic Beanstalk

```bash
# Installer EB CLI
pip install awsebcli

# Initialiser EB
eb init

# Répondre aux questions :
# - Region: choisir votre région (ex: eu-west-1)
# - Application name: heartmatch-backend-node
# - Platform: Node.js
# - Platform version: Node.js 18
# - SSH: Yes (recommandé)
```

### 2.3 Créer l'environnement

```bash
# Créer l'environnement
eb create heartmatch-backend-node-env

# Attendre la création (5-10 minutes)
```

### 2.4 Configurer les variables d'environnement

```bash
# Via AWS Console ou CLI
eb setenv \
  DATABASE_URL="postgresql://postgres:[PASSWORD]@[RDS_ENDPOINT]:5432/heartmatch" \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET="votre-secret-jwt-super-securise" \
  UPLOAD_PATH="/tmp/uploads" \
  MAX_FILE_SIZE=5242880
```

### 2.5 Déployer

```bash
# Déployer l'application
eb deploy

# Vérifier le statut
eb status

# Ouvrir dans le navigateur
eb open
```

### 2.6 Exécuter les migrations Prisma

```bash
# Se connecter via SSH
eb ssh

# Exécuter les migrations
cd /var/app/current
npx prisma migrate deploy
npx prisma generate

# Quitter
exit
```

## 🐍 Étape 3 : Déployer le Backend Python (Elastic Beanstalk)

### 3.1 Préparer l'application

```bash
cd backend-python

# Créer .ebignore
echo "__pycache__/
*.pyc
.env
.git/
venv/
*.log" > .ebignore
```

### 3.2 Créer Procfile

Déjà créé dans le projet, vérifier :

```
web: uvicorn app.main:app --host 0.0.0.0 --port 8080
```

### 3.3 Initialiser Elastic Beanstalk

```bash
# Initialiser EB
eb init

# Répondre aux questions :
# - Region: même région que le backend Node.js
# - Application name: heartmatch-backend-python
# - Platform: Python
# - Platform version: Python 3.9
# - SSH: Yes
```

### 3.4 Créer l'environnement

```bash
# Créer l'environnement
eb create heartmatch-backend-python-env

# Attendre la création
```

### 3.5 Configurer les variables d'environnement

```bash
eb setenv \
  DATABASE_URL="postgresql://postgres:[PASSWORD]@[RDS_ENDPOINT]:5432/heartmatch" \
  SECRET_KEY="votre-secret-key-super-securise" \
  BACKEND_NODE_URL="http://heartmatch-backend-node-env.xxxxxxxxx.region.elasticbeanstalk.com" \
  ALLOWED_ORIGINS="*"
```

### 3.6 Déployer

```bash
# Déployer
eb deploy

# Vérifier
eb status
eb open
```

## 🎨 Étape 4 : Déployer le Frontend (AWS Amplify)

### 4.1 Via AWS Console

```bash
1. Aller sur AWS Amplify Console
2. Cliquer "New app" → "Host web app"
3. Choisir "Deploy without Git provider"
4. App name: heartmatch-frontend
5. Environment name: production
```

### 4.2 Configurer les variables d'environnement

Dans Amplify Console → Environment variables :

```
NEXT_PUBLIC_API_URL=http://heartmatch-backend-node-env.xxxxxxxxx.elasticbeanstalk.com/api
NEXT_PUBLIC_PYTHON_API_URL=http://heartmatch-backend-python-env.xxxxxxxxx.elasticbeanstalk.com
```

### 4.3 Déployer manuellement

```bash
# Depuis le dossier racine
npm run build

# Créer un zip du dossier .next et autres fichiers nécessaires
# Uploader via Amplify Console
```

### 4.4 Alternative : Déploiement via Git

```bash
# Pousser sur GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin [VOTRE_REPO_GITHUB]
git push -u origin main

# Dans Amplify Console
1. Choisir "GitHub"
2. Autoriser AWS Amplify
3. Sélectionner le repository
4. Configurer les build settings (auto-détecté)
5. Déployer
```

## 🔐 Étape 5 : Configuration de Sécurité

### 5.1 Configurer CORS sur les backends

Backend Node.js - `server.js` :
```javascript
const allowedOrigins = [
  'https://[VOTRE_DOMAINE_AMPLIFY].amplifyapp.com',
  'http://localhost:3000'
];
```

Backend Python - `app/core/config.py` :
```python
origins = [
    "https://[VOTRE_DOMAINE_AMPLIFY].amplifyapp.com",
    "http://localhost:3000"
]
```

### 5.2 Configurer les Security Groups

```bash
# Backend Node.js Security Group
- Autoriser HTTP (80) depuis Amplify
- Autoriser HTTPS (443) depuis Amplify
- Autoriser PostgreSQL (5432) vers RDS

# Backend Python Security Group
- Autoriser HTTP (80) depuis Amplify
- Autoriser HTTPS (443) depuis Amplify

# RDS Security Group
- Autoriser PostgreSQL (5432) depuis Backend Node.js SG
```

## 📊 Étape 6 : Monitoring et Logs

### 6.1 CloudWatch Logs

```bash
# Backend Node.js
eb logs

# Backend Python
eb logs

# Ou via AWS Console → CloudWatch → Log groups
```

### 6.2 Configurer les Alarmes

```bash
# Via AWS Console → CloudWatch → Alarms
1. CPU Utilization > 80%
2. Database Connections > 90%
3. HTTP 5xx Errors > 10
```

## 🌐 Étape 7 : Domaine Personnalisé (Optionnel)

### 7.1 Acheter un domaine (Route 53)

```bash
1. AWS Console → Route 53
2. Register domain: heartmatch.app
3. Attendre la validation (24-48h)
```

### 7.2 Configurer le domaine pour Amplify

```bash
1. Amplify Console → Domain management
2. Add domain
3. Sélectionner votre domaine Route 53
4. Configurer les sous-domaines :
   - www.heartmatch.app → Frontend
   - api.heartmatch.app → Backend Node.js
   - ai.heartmatch.app → Backend Python
```

### 7.3 Configurer SSL/TLS

AWS Amplify et Elastic Beanstalk gèrent automatiquement les certificats SSL via AWS Certificate Manager.

## 💰 Estimation des Coûts (Free Tier)

### Première année (Free Tier) :
- **RDS db.t3.micro** : Gratuit (750h/mois)
- **Elastic Beanstalk** : Gratuit (service)
- **EC2 t3.micro** : Gratuit (750h/mois × 2 instances)
- **Amplify** : Gratuit (1000 build minutes/mois)
- **Data Transfer** : 15 GB gratuit/mois

### Après Free Tier (~$50-100/mois) :
- RDS db.t3.micro : ~$15/mois
- EC2 t3.micro × 2 : ~$15/mois
- Amplify : ~$10/mois
- Data Transfer : ~$10/mois
- Total : ~$50-60/mois

## 🚀 Scripts de Déploiement Rapide

Voir les fichiers créés :
- `deploy-aws-backend-node.sh`
- `deploy-aws-backend-python.sh`
- `deploy-aws-frontend.sh`
- `deploy-aws-all.sh`

## 🔧 Commandes Utiles

```bash
# Backend Node.js
eb status                    # Voir le statut
eb logs                      # Voir les logs
eb deploy                    # Déployer
eb ssh                       # Se connecter en SSH
eb terminate                 # Supprimer l'environnement

# Backend Python
cd backend-python
eb status
eb logs
eb deploy

# Frontend
# Via Amplify Console ou Git push

# Base de données
psql -h [RDS_ENDPOINT] -U postgres -d heartmatch
```

## 🐛 Dépannage

### Problème : Backend ne démarre pas
```bash
# Vérifier les logs
eb logs

# Vérifier les variables d'environnement
eb printenv

# Redémarrer
eb restart
```

### Problème : Connexion à la base de données échoue
```bash
# Vérifier le Security Group RDS
# Vérifier DATABASE_URL
# Tester la connexion depuis EC2
eb ssh
psql $DATABASE_URL
```

### Problème : CORS errors
```bash
# Vérifier les origines autorisées dans les backends
# Redéployer après modification
```

## 📝 Checklist de Déploiement

- [ ] RDS PostgreSQL créé et accessible
- [ ] Backend Node.js déployé sur EB
- [ ] Migrations Prisma exécutées
- [ ] Backend Python déployé sur EB
- [ ] Frontend déployé sur Amplify
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Security Groups configurés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring CloudWatch activé
- [ ] Backups RDS configurés

## 🎉 Félicitations !

Votre application HeartMatch est maintenant déployée sur AWS !

**URLs de production :**
- Frontend : `https://[app-id].amplifyapp.com`
- Backend Node.js : `http://[env-name].elasticbeanstalk.com`
- Backend Python : `http://[env-name].elasticbeanstalk.com`

---

**Support :** Pour toute question, consultez la documentation AWS ou contactez le support.
