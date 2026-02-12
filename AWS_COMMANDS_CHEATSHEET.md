# 🎯 Commandes AWS Essentielles - HeartMatch

## 🚀 Déploiement Initial

### Tout Déployer en Une Commande

**Windows:**
```bash
deploy-aws-all.bat
```

**Linux/Mac:**
```bash
chmod +x deploy-aws-all.sh
./deploy-aws-all.sh
```

### Déploiement Individuel

**Backend Node.js:**
```bash
# Windows
deploy-aws-backend-node.bat

# Linux/Mac
./deploy-aws-backend-node.sh
```

**Backend Python:**
```bash
# Windows
deploy-aws-backend-python.bat

# Linux/Mac
./deploy-aws-backend-python.sh
```

**Frontend:**
```bash
# Windows
deploy-aws-frontend.bat

# Linux/Mac
./deploy-aws-frontend.sh
```

## 📊 Monitoring et Logs

### Backend Node.js
```bash
cd backend

# Voir le statut
eb status

# Voir les logs en temps réel
eb logs --stream

# Voir tous les logs
eb logs --all

# Télécharger les logs
eb logs --zip
```

### Backend Python
```bash
cd backend-python

# Voir le statut
eb status

# Voir les logs
eb logs --stream

# Voir tous les logs
eb logs --all
```

### Frontend (Amplify)
```bash
# Via AWS Console
https://console.aws.amazon.com/amplify

# Ou via CLI
amplify console
```

## 🔄 Mise à Jour et Redéploiement

### Backend Node.js
```bash
cd backend

# Après modification du code
git add .
git commit -m "Update backend"

# Déployer
eb deploy

# Déployer avec un message
eb deploy -m "Fix: correction du bug XYZ"
```

### Backend Python
```bash
cd backend-python

# Après modification du code
git add .
git commit -m "Update backend"

# Déployer
eb deploy
```

### Frontend
```bash
# Build local
npm run build

# Via Amplify Console (auto-deploy si Git connecté)
git push origin main

# Ou via CLI
amplify publish
```

## 🗄️ Base de Données

### Se Connecter à RDS
```bash
# Via psql
psql -h [RDS_ENDPOINT] -U postgres -d heartmatch

# Exemple
psql -h heartmatch-db.xxxxx.eu-west-1.rds.amazonaws.com -U postgres -d heartmatch
```

### Exécuter les Migrations Prisma
```bash
cd backend

# Via SSH sur l'instance EB
eb ssh

# Une fois connecté
cd /var/app/current
npx prisma migrate deploy
npx prisma generate
exit
```

### Backup Manuel
```bash
# Créer un snapshot
aws rds create-db-snapshot \
  --db-instance-identifier heartmatch-db \
  --db-snapshot-identifier heartmatch-backup-$(date +%Y%m%d)

# Lister les snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier heartmatch-db
```

## 🔧 Configuration

### Voir les Variables d'Environnement
```bash
cd backend
eb printenv

cd ../backend-python
eb printenv
```

### Modifier les Variables d'Environnement
```bash
cd backend

# Modifier une variable
eb setenv JWT_SECRET="nouveau-secret"

# Modifier plusieurs variables
eb setenv \
  JWT_SECRET="nouveau-secret" \
  NODE_ENV=production \
  PORT=8080
```

### Ouvrir la Console de Configuration
```bash
cd backend
eb config
```

## 🔍 Debugging

### Se Connecter en SSH
```bash
cd backend
eb ssh

# Ou spécifier l'environnement
eb ssh heartmatch-backend-node-env
```

### Vérifier les Processus
```bash
# Une fois connecté en SSH
ps aux | grep node
ps aux | grep python

# Vérifier les logs système
sudo tail -f /var/log/eb-engine.log
sudo tail -f /var/log/nodejs/nodejs.log
```

### Tester les Endpoints
```bash
# Backend Node.js
curl http://[URL]/api/health

# Backend Python
curl http://[URL]/health

# Avec détails
curl -v http://[URL]/api/health
```

## 🔄 Redémarrage

### Redémarrer l'Application
```bash
cd backend
eb restart

cd ../backend-python
eb restart
```

### Redémarrer l'Instance EC2
```bash
# Via AWS Console
# EC2 → Instances → Sélectionner → Actions → Instance State → Reboot

# Ou via CLI
aws ec2 reboot-instances --instance-ids i-xxxxx
```

## 📈 Scaling

### Augmenter la Capacité
```bash
cd backend

# Modifier le type d'instance
eb scale 2

# Ou via configuration
eb config
# Modifier: MinSize, MaxSize
```

### Auto-Scaling
```bash
# Via fichier .ebextensions/autoscaling.config
option_settings:
  aws:autoscaling:asg:
    MinSize: 1
    MaxSize: 4
  aws:autoscaling:trigger:
    MeasureName: CPUUtilization
    Statistic: Average
    Unit: Percent
    UpperThreshold: 80
    LowerThreshold: 20
```

## 🗑️ Nettoyage et Suppression

### Supprimer un Environnement
```bash
cd backend
eb terminate heartmatch-backend-node-env

cd ../backend-python
eb terminate heartmatch-backend-python-env
```

### Supprimer l'Application Complète
```bash
# Backend Node.js
cd backend
eb terminate --all

# Backend Python
cd ../backend-python
eb terminate --all

# RDS (via Console ou CLI)
aws rds delete-db-instance \
  --db-instance-identifier heartmatch-db \
  --skip-final-snapshot

# Amplify (via Console)
# Amplify → App → Actions → Delete app
```

## 🔐 Sécurité

### Mettre à Jour les Security Groups
```bash
# Autoriser une nouvelle IP pour RDS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 1.2.3.4/32

# Révoquer un accès
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 1.2.3.4/32
```

### Rotation des Secrets
```bash
# Générer un nouveau JWT secret
openssl rand -base64 32

# Mettre à jour
cd backend
eb setenv JWT_SECRET="nouveau-secret-genere"
eb restart
```

## 📊 Coûts

### Voir les Coûts Actuels
```bash
# Via AWS Console
https://console.aws.amazon.com/billing

# Ou via CLI
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### Configurer des Alertes de Budget
```bash
# Via AWS Console
# Billing → Budgets → Create budget
# Définir un seuil (ex: $100/mois)
```

## 🆘 Urgence

### Application Down
```bash
# 1. Vérifier le statut
cd backend
eb status

# 2. Voir les logs
eb logs --all

# 3. Redémarrer
eb restart

# 4. Si ça ne fonctionne pas, redéployer
eb deploy

# 5. En dernier recours, recréer l'environnement
eb terminate
eb create
```

### Base de Données Inaccessible
```bash
# 1. Vérifier le statut RDS
aws rds describe-db-instances \
  --db-instance-identifier heartmatch-db

# 2. Vérifier les Security Groups
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx

# 3. Tester la connexion
psql -h [RDS_ENDPOINT] -U postgres -d heartmatch
```

## 📚 Ressources

- **Documentation EB**: https://docs.aws.amazon.com/elasticbeanstalk
- **Documentation Amplify**: https://docs.amplify.aws
- **Documentation RDS**: https://docs.aws.amazon.com/rds
- **AWS CLI Reference**: https://docs.aws.amazon.com/cli
- **Status AWS**: https://status.aws.amazon.com

## 💡 Astuces

### Alias Utiles (Linux/Mac)
```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
alias eb-status='cd backend && eb status && cd ../backend-python && eb status && cd ..'
alias eb-logs='cd backend && eb logs --stream'
alias eb-deploy-all='cd backend && eb deploy && cd ../backend-python && eb deploy && cd ..'
```

### Alias Utiles (Windows PowerShell)
```powershell
# Ajouter à $PROFILE
function eb-status {
    cd backend; eb status; cd ../backend-python; eb status; cd ..
}

function eb-deploy-all {
    cd backend; eb deploy; cd ../backend-python; eb deploy; cd ..
}
```

---

**Dernière mise à jour**: $(date)
