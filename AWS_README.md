# 🚀 Déploiement AWS - HeartMatch Dating App

## 📋 Vue d'Ensemble

Ce projet contient tous les fichiers nécessaires pour déployer l'application HeartMatch complète sur AWS :

- **Frontend** : Next.js 16 sur AWS Amplify
- **Backend Node.js** : Express + Prisma sur Elastic Beanstalk
- **Backend Python** : FastAPI sur Elastic Beanstalk
- **Base de données** : PostgreSQL sur RDS

## 🎯 Démarrage Rapide

### Option 1 : Déploiement Automatique (Recommandé)

```bash
# Windows
deploy-aws-all.bat

# Linux/Mac
chmod +x deploy-aws-all.sh
./deploy-aws-all.sh
```

### Option 2 : Déploiement Manuel

Suivez le guide complet : [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

## 📁 Fichiers de Déploiement

### Scripts de Déploiement

| Fichier | Description | Plateforme |
|---------|-------------|------------|
| `deploy-aws-all.sh` | Déploie tout automatiquement | Linux/Mac |
| `deploy-aws-all.bat` | Déploie tout automatiquement | Windows |
| `deploy-aws-backend-node.sh` | Déploie backend Node.js | Linux/Mac |
| `deploy-aws-backend-node.bat` | Déploie backend Node.js | Windows |
| `deploy-aws-backend-python.sh` | Déploie backend Python | Linux/Mac |
| `deploy-aws-backend-python.bat` | Déploie backend Python | Windows |
| `deploy-aws-frontend.sh` | Prépare le frontend | Linux/Mac |
| `deploy-aws-frontend.bat` | Prépare le frontend | Windows |

### Documentation

| Fichier | Description |
|---------|-------------|
| `AWS_DEPLOYMENT_GUIDE.md` | Guide complet de déploiement |
| `AWS_QUICK_START.md` | Guide de démarrage rapide |
| `AWS_COMMANDS_CHEATSHEET.md` | Aide-mémoire des commandes |
| `AWS_DEPLOYMENT_TRACKER.md` | Suivi du déploiement |

### Configuration

| Fichier | Description |
|---------|-------------|
| `amplify.yml` | Configuration Amplify (Frontend) |
| `backend/.ebextensions/nodejs.config` | Configuration EB Node.js |
| `backend-python/.ebextensions/python.config` | Configuration EB Python |

## 🔧 Prérequis

### Logiciels Requis

- [x] Compte AWS actif
- [x] AWS CLI installé et configuré
- [x] Node.js 18+
- [x] Python 3.9+
- [x] Git

### Installation des Outils

```bash
# AWS CLI
# Windows: https://aws.amazon.com/cli/
# Linux/Mac: 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Elastic Beanstalk CLI
pip install awsebcli

# Amplify CLI (optionnel)
npm install -g @aws-amplify/cli

# Configuration AWS
aws configure
# Entrez: Access Key ID, Secret Access Key, Region (ex: eu-west-1)
```

## 📊 Architecture AWS

```
┌─────────────────────────────────────────────────────────┐
│                     AWS Cloud                            │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   Amplify    │      │     RDS      │                │
│  │  (Frontend)  │      │ (PostgreSQL) │                │
│  └──────┬───────┘      └──────▲───────┘                │
│         │                     │                         │
│         │                     │                         │
│  ┌──────▼───────┐      ┌─────┴────────┐               │
│  │ Elastic      │      │  Elastic     │               │
│  │ Beanstalk    │◄────►│  Beanstalk   │               │
│  │ (Node.js)    │      │  (Python)    │               │
│  └──────────────┘      └──────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 💰 Estimation des Coûts

### Free Tier (12 premiers mois)
- **RDS** db.t3.micro : Gratuit (750h/mois)
- **EC2** t3.micro × 2 : Gratuit (750h/mois)
- **Amplify** : Gratuit (1000 build minutes)
- **Total** : **$0/mois**

### Après Free Tier
- **RDS** : ~$15/mois
- **EC2** × 2 : ~$15/mois
- **Amplify** : ~$10/mois
- **Data Transfer** : ~$10/mois
- **Total** : **~$50-60/mois**

## 🚀 Étapes de Déploiement

### 1. Créer la Base de Données RDS

```bash
# Via AWS Console
1. RDS → Create database
2. PostgreSQL 15+
3. Free tier template
4. DB identifier: heartmatch-db
5. Username: postgres
6. Password: [VOTRE_MOT_DE_PASSE]
7. Public access: Yes
8. Create database
```

### 2. Déployer les Backends

```bash
# Backend Node.js
cd backend
eb init heartmatch-backend-node --platform node.js --region eu-west-1
eb create heartmatch-backend-node-env
eb setenv DATABASE_URL="postgresql://..." JWT_SECRET="..."
eb deploy

# Backend Python
cd ../backend-python
eb init heartmatch-backend-python --platform python-3.9 --region eu-west-1
eb create heartmatch-backend-python-env
eb setenv DATABASE_URL="postgresql://..." SECRET_KEY="..."
eb deploy
```

### 3. Déployer le Frontend

```bash
# Build
npm run build

# Via Amplify Console
1. https://console.aws.amazon.com/amplify
2. New app → Deploy without Git
3. Upload build ou connecter GitHub
4. Configure environment variables
5. Deploy
```

### 4. Exécuter les Migrations

```bash
cd backend
eb ssh
cd /var/app/current
npx prisma migrate deploy
npx prisma generate
exit
```

## ✅ Vérification

### Tester les Endpoints

```bash
# Backend Node.js
curl http://[URL].elasticbeanstalk.com/api/health

# Backend Python
curl http://[URL].elasticbeanstalk.com/health

# Frontend
# Ouvrir dans le navigateur
https://[app-id].amplifyapp.com
```

### Vérifier les Logs

```bash
# Backend Node.js
cd backend
eb logs

# Backend Python
cd backend-python
eb logs
```

## 🔧 Maintenance

### Mise à Jour du Code

```bash
# Modifier le code
git add .
git commit -m "Update"

# Déployer
cd backend
eb deploy

cd ../backend-python
eb deploy

# Frontend (si Git connecté)
git push origin main
```

### Monitoring

```bash
# Voir le statut
eb status

# Voir les logs en temps réel
eb logs --stream

# CloudWatch
https://console.aws.amazon.com/cloudwatch
```

## 🐛 Dépannage

### Problème : Backend ne démarre pas

```bash
cd backend
eb logs --all
# Vérifier les erreurs
eb restart
```

### Problème : Connexion DB échoue

```bash
# Vérifier le Security Group RDS
# Autoriser port 5432 depuis les backends
# Vérifier DATABASE_URL
eb printenv
```

### Problème : CORS errors

```bash
# Vérifier les origines autorisées
# backend/server.js et backend-python/app/core/config.py
# Redéployer après modification
```

## 📚 Documentation Complète

- [Guide de Déploiement Complet](./AWS_DEPLOYMENT_GUIDE.md)
- [Guide de Démarrage Rapide](./AWS_QUICK_START.md)
- [Aide-mémoire des Commandes](./AWS_COMMANDS_CHEATSHEET.md)
- [Suivi du Déploiement](./AWS_DEPLOYMENT_TRACKER.md)

## 🆘 Support

- **Documentation AWS** : https://docs.aws.amazon.com
- **Elastic Beanstalk** : https://docs.aws.amazon.com/elasticbeanstalk
- **Amplify** : https://docs.amplify.aws
- **RDS** : https://docs.aws.amazon.com/rds
- **Status AWS** : https://status.aws.amazon.com

## 📝 Checklist Post-Déploiement

- [ ] RDS PostgreSQL créé et accessible
- [ ] Backend Node.js déployé et fonctionnel
- [ ] Backend Python déployé et fonctionnel
- [ ] Frontend déployé sur Amplify
- [ ] Migrations Prisma exécutées
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Security Groups configurés
- [ ] CloudWatch Logs activés
- [ ] Backups RDS configurés
- [ ] Tests de bout en bout effectués

## 🎉 Félicitations !

Votre application HeartMatch est maintenant en production sur AWS !

**Prochaines étapes :**
1. Configurer un domaine personnalisé (optionnel)
2. Activer les alarmes CloudWatch
3. Configurer les backups automatiques
4. Optimiser les performances
5. Mettre en place le monitoring

---

**Besoin d'aide ?** Consultez la documentation complète ou contactez le support AWS.
