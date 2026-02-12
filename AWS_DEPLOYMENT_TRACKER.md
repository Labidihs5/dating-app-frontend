# 📊 Suivi du Déploiement AWS - HeartMatch

## 🗄️ Base de Données (RDS PostgreSQL)

- **Endpoint**: _____________________________________
- **Port**: 5432
- **Database**: heartmatch
- **Username**: postgres
- **Password**: [CONFIDENTIEL]
- **Connection String**: 
  ```
  postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/heartmatch
  ```

## 🔧 Backend Node.js (Elastic Beanstalk)

- **Application Name**: heartmatch-backend-node
- **Environment Name**: heartmatch-backend-node-env
- **URL**: _____________________________________
- **Region**: _____________________________________
- **Instance Type**: t3.micro
- **Platform**: Node.js 18

### Variables d'Environnement
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[RDS_ENDPOINT]:5432/heartmatch
NODE_ENV=production
PORT=8080
JWT_SECRET=[CONFIDENTIEL]
UPLOAD_PATH=/tmp/uploads
MAX_FILE_SIZE=5242880
```

### Commandes Utiles
```bash
cd backend
eb status
eb logs
eb deploy
eb ssh
```

## 🐍 Backend Python (Elastic Beanstalk)

- **Application Name**: heartmatch-backend-python
- **Environment Name**: heartmatch-backend-python-env
- **URL**: _____________________________________
- **Region**: _____________________________________
- **Instance Type**: t3.micro
- **Platform**: Python 3.9

### Variables d'Environnement
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[RDS_ENDPOINT]:5432/heartmatch
SECRET_KEY=[CONFIDENTIEL]
BACKEND_NODE_URL=[URL_BACKEND_NODE]
ALLOWED_ORIGINS=*
```

### Commandes Utiles
```bash
cd backend-python
eb status
eb logs
eb deploy
eb ssh
```

## 🎨 Frontend (AWS Amplify)

- **Application Name**: heartmatch-frontend
- **Environment**: production
- **URL**: _____________________________________
- **Region**: _____________________________________

### Variables d'Environnement
```
NEXT_PUBLIC_API_URL=[BACKEND_NODE_URL]/api
NEXT_PUBLIC_PYTHON_API_URL=[BACKEND_PYTHON_URL]
```

### Commandes Utiles
```bash
# Via Amplify Console
# ou
amplify status
amplify publish
```

## 🔐 Security Groups

### RDS Security Group
- **Name**: heartmatch-db-sg
- **Inbound Rules**:
  - Type: PostgreSQL
  - Port: 5432
  - Source: Backend Node.js SG, Backend Python SG

### Backend Node.js Security Group
- **Name**: heartmatch-backend-node-sg
- **Inbound Rules**:
  - Type: HTTP
  - Port: 80
  - Source: 0.0.0.0/0

### Backend Python Security Group
- **Name**: heartmatch-backend-python-sg
- **Inbound Rules**:
  - Type: HTTP
  - Port: 80
  - Source: 0.0.0.0/0

## 📊 Monitoring

### CloudWatch Log Groups
- `/aws/elasticbeanstalk/heartmatch-backend-node-env/var/log/nodejs/nodejs.log`
- `/aws/elasticbeanstalk/heartmatch-backend-python-env/var/log/web.stdout.log`
- `/aws/amplify/heartmatch-frontend`

### CloudWatch Alarms
- [ ] CPU Utilization > 80% (Backend Node.js)
- [ ] CPU Utilization > 80% (Backend Python)
- [ ] Database Connections > 90% (RDS)
- [ ] HTTP 5xx Errors > 10 (Backends)

## 💰 Coûts Mensuels Estimés

### Free Tier (12 premiers mois)
- RDS db.t3.micro: $0 (750h/mois gratuit)
- EC2 t3.micro × 2: $0 (750h/mois gratuit)
- Amplify: $0 (1000 build minutes gratuit)
- Data Transfer: $0 (15 GB gratuit)
- **Total: $0/mois**

### Après Free Tier
- RDS db.t3.micro: ~$15/mois
- EC2 t3.micro × 2: ~$15/mois
- Amplify: ~$10/mois
- Data Transfer: ~$10/mois
- **Total: ~$50-60/mois**

## 🔄 Backups

### RDS Automated Backups
- **Retention Period**: 7 jours
- **Backup Window**: 03:00-04:00 UTC
- **Maintenance Window**: Dimanche 04:00-05:00 UTC

## 🌐 Domaine Personnalisé (Optionnel)

- **Domain**: _____________________________________
- **Registrar**: Route 53
- **SSL Certificate**: AWS Certificate Manager (auto)

### DNS Records
- `www.heartmatch.app` → Amplify (Frontend)
- `api.heartmatch.app` → Backend Node.js
- `ai.heartmatch.app` → Backend Python

## ✅ Checklist de Déploiement

- [ ] RDS PostgreSQL créé et accessible
- [ ] Backend Node.js déployé sur EB
- [ ] Migrations Prisma exécutées
- [ ] Backend Python déployé sur EB
- [ ] Frontend déployé sur Amplify
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Security Groups configurés
- [ ] CloudWatch Logs activés
- [ ] CloudWatch Alarms configurés
- [ ] Backups RDS configurés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL/TLS activé
- [ ] Tests de bout en bout effectués

## 📝 Notes de Déploiement

### Date de Déploiement Initial
_____________________________________

### Dernière Mise à Jour
_____________________________________

### Problèmes Rencontrés
_____________________________________
_____________________________________
_____________________________________

### Solutions Appliquées
_____________________________________
_____________________________________
_____________________________________

## 🆘 Contacts d'Urgence

- **AWS Support**: https://console.aws.amazon.com/support
- **Documentation**: https://docs.aws.amazon.com
- **Status AWS**: https://status.aws.amazon.com

## 🔧 Maintenance Planifiée

- **Prochaine Maintenance**: _____________________________________
- **Type**: _____________________________________
- **Durée Estimée**: _____________________________________

---

**Dernière mise à jour**: _____________________________________
**Mis à jour par**: _____________________________________
