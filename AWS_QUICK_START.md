# 🚀 Déploiement Rapide sur AWS

## Démarrage en 5 Minutes

### Prérequis
- Compte AWS actif
- AWS CLI installé et configuré (`aws configure`)
- Node.js 18+ et Python 3.9+ installés

### Option 1 : Déploiement Automatique (Recommandé)

#### Windows
```bash
deploy-aws-all.bat
```

#### Linux/Mac
```bash
chmod +x deploy-aws-all.sh
./deploy-aws-all.sh
```

Le script vous demandera :
1. Région AWS (ex: `eu-west-1`)
2. Endpoint RDS (ex: `xxx.rds.amazonaws.com`)
3. Mot de passe RDS
4. JWT Secret
5. Secret Key Python

### Option 2 : Déploiement Manuel

#### 1. Créer la Base de Données RDS

```bash
# Via AWS Console
1. RDS → Create database
2. PostgreSQL 15+
3. Free tier template
4. DB name: heartmatch
5. Username: postgres
6. Password: [VOTRE_MOT_DE_PASSE]
7. Public access: Yes
8. Create database
```

#### 2. Déployer Backend Node.js

```bash
# Windows
deploy-aws-backend-node.bat

# Linux/Mac
chmod +x deploy-aws-backend-node.sh
./deploy-aws-backend-node.sh
```

#### 3. Déployer Backend Python

```bash
# Windows
deploy-aws-backend-python.bat

# Linux/Mac
chmod +x deploy-aws-backend-python.sh
./deploy-aws-backend-python.sh
```

#### 4. Déployer Frontend

```bash
# Windows
deploy-aws-frontend.bat

# Linux/Mac
chmod +x deploy-aws-frontend.sh
./deploy-aws-frontend.sh
```

Puis suivez les instructions pour déployer sur Amplify Console.

## 📋 Checklist Post-Déploiement

- [ ] RDS accessible depuis les backends
- [ ] Backend Node.js répond sur `/api/health`
- [ ] Backend Python répond sur `/health`
- [ ] Migrations Prisma exécutées
- [ ] Frontend déployé sur Amplify
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement

## 🔧 Commandes Utiles

### Backend Node.js
```bash
cd backend
eb status          # Voir le statut
eb logs            # Voir les logs
eb deploy          # Redéployer
eb ssh             # Se connecter en SSH
```

### Backend Python
```bash
cd backend-python
eb status
eb logs
eb deploy
eb ssh
```

### Frontend
```bash
# Via Amplify Console
# ou
amplify status
amplify publish
```

## 🐛 Dépannage Rapide

### Backend ne démarre pas
```bash
cd backend
eb logs --all
```

### Erreur de connexion à la base de données
1. Vérifier le Security Group RDS (autoriser port 5432)
2. Vérifier DATABASE_URL dans les variables d'environnement
3. Tester la connexion : `psql $DATABASE_URL`

### Erreurs CORS
1. Vérifier les origines autorisées dans `server.js` (Node.js)
2. Vérifier `ALLOWED_ORIGINS` dans le backend Python
3. Redéployer après modification

## 💰 Coûts Estimés

### Free Tier (12 premiers mois)
- RDS db.t3.micro : Gratuit (750h/mois)
- EC2 t3.micro × 2 : Gratuit (750h/mois)
- Amplify : Gratuit (1000 build minutes)
- **Total : $0/mois**

### Après Free Tier
- RDS : ~$15/mois
- EC2 × 2 : ~$15/mois
- Amplify : ~$10/mois
- Data Transfer : ~$10/mois
- **Total : ~$50-60/mois**

## 📚 Documentation Complète

Pour plus de détails, consultez `AWS_DEPLOYMENT_GUIDE.md`

## 🆘 Support

- Documentation AWS : https://docs.aws.amazon.com
- Elastic Beanstalk : https://docs.aws.amazon.com/elasticbeanstalk
- Amplify : https://docs.amplify.aws
- RDS : https://docs.aws.amazon.com/rds

## ✅ Vérification du Déploiement

Testez vos URLs :

```bash
# Backend Node.js
curl http://[votre-url].elasticbeanstalk.com/api/health

# Backend Python
curl http://[votre-url].elasticbeanstalk.com/health

# Frontend
# Ouvrir dans le navigateur
https://[app-id].amplifyapp.com
```

## 🎉 Félicitations !

Votre application HeartMatch est maintenant en production sur AWS !
