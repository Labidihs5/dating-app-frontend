# 🚀 Guide de Déploiement Manuel - HeartMatch sur AWS

## ⚠️ Configuration AWS Requise

Vos credentials AWS actuels ne sont pas valides. Suivez ces étapes :

### 1. Obtenir vos Credentials AWS

1. Connectez-vous à la console AWS : https://console.aws.amazon.com
2. Cliquez sur votre nom en haut à droite → Security Credentials
3. Sous "Access keys", cliquez sur "Create access key"
4. Notez votre **Access Key ID** et **Secret Access Key**

### 2. Configurer AWS CLI

```bash
aws configure
```

Entrez :
- **AWS Access Key ID** : [Votre Access Key]
- **AWS Secret Access Key** : [Votre Secret Key]
- **Default region name** : eu-west-1
- **Default output format** : json

### 3. Vérifier la Configuration

```bash
aws sts get-caller-identity
```

Si cela fonctionne, vous êtes prêt !

---

## 📊 ÉTAPE 1 : Créer la Base de Données RDS

### Via AWS Console (Recommandé)

1. Allez sur https://console.aws.amazon.com/rds
2. Cliquez sur **"Create database"**
3. Configurez :
   - **Engine** : PostgreSQL
   - **Version** : 15.x ou plus récent
   - **Template** : Free tier
   - **DB instance identifier** : `heartmatch-db`
   - **Master username** : `postgres`
   - **Master password** : `HeartMatch2024!` (ou votre choix)
   - **DB instance class** : db.t3.micro
   - **Storage** : 20 GB
   - **Public access** : Yes
   - **Database name** : `heartmatch`
4. Cliquez sur **"Create database"**
5. Attendez 5-10 minutes que la base soit disponible
6. Notez l'**Endpoint** (ex: heartmatch-db.xxxxx.eu-west-1.rds.amazonaws.com)

### Via AWS CLI

```bash
aws rds create-db-instance \
  --db-instance-identifier heartmatch-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password HeartMatch2024! \
  --allocated-storage 20 \
  --publicly-accessible \
  --backup-retention-period 7 \
  --db-name heartmatch \
  --region eu-west-1
```

### Configurer le Security Group

1. Allez dans RDS → Databases → heartmatch-db
2. Cliquez sur le Security Group
3. Ajoutez une règle entrante :
   - **Type** : PostgreSQL
   - **Port** : 5432
   - **Source** : 0.0.0.0/0 (pour développement)

---

## 🔧 ÉTAPE 2 : Déployer le Backend Node.js

### 2.1 Préparer le Backend

```bash
cd backend

# Créer .ebignore
echo node_modules/ > .ebignore
echo .env >> .ebignore
echo .git/ >> .ebignore
echo uploads/ >> .ebignore
echo *.log >> .ebignore
```

### 2.2 Initialiser Elastic Beanstalk

```bash
# Ajouter eb au PATH (Windows)
set PATH=%PATH%;C:\Users\alabidi\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts

# Initialiser EB
eb init

# Répondre :
# - Application name: heartmatch-backend-node
# - Platform: Node.js
# - Platform version: Node.js 18
# - Region: eu-west-1
# - SSH: Yes (recommandé)
```

### 2.3 Créer l'Environnement

```bash
eb create heartmatch-backend-node-env --instance-type t3.micro
```

Attendez 5-10 minutes.

### 2.4 Configurer les Variables d'Environnement

Remplacez `[RDS_ENDPOINT]` par votre endpoint RDS :

```bash
eb setenv DATABASE_URL="postgresql://postgres:HeartMatch2024!@[RDS_ENDPOINT]:5432/heartmatch" NODE_ENV=production PORT=8080 JWT_SECRET="votre-secret-jwt-super-securise-123456" UPLOAD_PATH="/tmp/uploads" MAX_FILE_SIZE=5242880
```

### 2.5 Déployer

```bash
eb deploy
```

### 2.6 Exécuter les Migrations Prisma

```bash
eb ssh
cd /var/app/current
npx prisma migrate deploy
npx prisma generate
exit
```

### 2.7 Récupérer l'URL

```bash
eb status
```

Notez l'URL (CNAME) : `http://heartmatch-backend-node-env.xxxxx.eu-west-1.elasticbeanstalk.com`

---

## 🐍 ÉTAPE 3 : Déployer le Backend Python

### 3.1 Préparer le Backend

```bash
cd ../backend-python

# Créer .ebignore
echo __pycache__/ > .ebignore
echo *.pyc >> .ebignore
echo .env >> .ebignore
echo .git/ >> .ebignore
echo venv/ >> .ebignore
echo *.log >> .ebignore

# Vérifier Procfile
type Procfile
# Doit contenir: web: uvicorn app.main:app --host 0.0.0.0 --port 8080
```

### 3.2 Initialiser Elastic Beanstalk

```bash
eb init

# Répondre :
# - Application name: heartmatch-backend-python
# - Platform: Python
# - Platform version: Python 3.9
# - Region: eu-west-1
# - SSH: Yes
```

### 3.3 Créer l'Environnement

```bash
eb create heartmatch-backend-python-env --instance-type t3.micro
```

### 3.4 Configurer les Variables d'Environnement

Remplacez `[RDS_ENDPOINT]` et `[BACKEND_NODE_URL]` :

```bash
eb setenv DATABASE_URL="postgresql://postgres:HeartMatch2024!@[RDS_ENDPOINT]:5432/heartmatch" SECRET_KEY="votre-secret-key-python-123456" BACKEND_NODE_URL="[BACKEND_NODE_URL]" ALLOWED_ORIGINS="*"
```

### 3.5 Déployer

```bash
eb deploy
```

### 3.6 Récupérer l'URL

```bash
eb status
```

Notez l'URL : `http://heartmatch-backend-python-env.xxxxx.eu-west-1.elasticbeanstalk.com`

---

## 🎨 ÉTAPE 4 : Déployer le Frontend sur Amplify

### 4.1 Préparer le Frontend

```bash
cd ../..

# Créer .env.production
echo NEXT_PUBLIC_API_URL=[BACKEND_NODE_URL]/api > .env.production
echo NEXT_PUBLIC_PYTHON_API_URL=[BACKEND_PYTHON_URL] >> .env.production

# Build
npm install
npm run build
```

### 4.2 Déployer sur Amplify (Via Console)

1. Allez sur https://console.aws.amazon.com/amplify
2. Cliquez sur **"New app"** → **"Host web app"**
3. Choisissez **"Deploy without Git provider"**
4. **App name** : heartmatch-frontend
5. **Environment name** : production
6. Uploadez le dossier `.next` ou connectez votre repo GitHub
7. Configurez les variables d'environnement :
   ```
   NEXT_PUBLIC_API_URL=[BACKEND_NODE_URL]/api
   NEXT_PUBLIC_PYTHON_API_URL=[BACKEND_PYTHON_URL]
   ```
8. Cliquez sur **"Save and deploy"**

### 4.3 Alternative : Via Git

```bash
# Pousser sur GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin [VOTRE_REPO_GITHUB]
git push -u origin main

# Dans Amplify Console
# 1. Choisir GitHub
# 2. Autoriser AWS Amplify
# 3. Sélectionner le repository
# 4. Configurer les build settings (auto-détecté)
# 5. Ajouter les variables d'environnement
# 6. Déployer
```

---

## ✅ ÉTAPE 5 : Vérification

### Tester les Endpoints

```bash
# Backend Node.js
curl http://[BACKEND_NODE_URL]/api/health

# Backend Python
curl http://[BACKEND_PYTHON_URL]/health

# Frontend
# Ouvrir dans le navigateur
https://[APP_ID].amplifyapp.com
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

---

## 📋 Récapitulatif des URLs

Notez vos URLs ici :

- **RDS Endpoint** : _________________________________
- **Backend Node.js** : _________________________________
- **Backend Python** : _________________________________
- **Frontend Amplify** : _________________________________

---

## 🔧 Commandes Utiles

### Backend Node.js
```bash
cd backend
eb status          # Voir le statut
eb logs            # Voir les logs
eb deploy          # Redéployer
eb ssh             # Se connecter en SSH
eb restart         # Redémarrer
```

### Backend Python
```bash
cd backend-python
eb status
eb logs
eb deploy
eb ssh
eb restart
```

### Frontend
```bash
# Via Amplify Console
# ou
amplify status
amplify publish
```

---

## 🐛 Dépannage

### Erreur : eb command not found

```bash
# Windows
set PATH=%PATH%;C:\Users\alabidi\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts

# Ou réinstaller
pip install --upgrade awsebcli
```

### Erreur : Invalid credentials

```bash
aws configure
# Entrez vos nouvelles credentials
```

### Erreur : Cannot connect to database

1. Vérifier le Security Group RDS (autoriser port 5432)
2. Vérifier DATABASE_URL dans les variables d'environnement
3. Tester la connexion : `psql -h [RDS_ENDPOINT] -U postgres -d heartmatch`

### Erreur : CORS

1. Vérifier les origines dans `backend/server.js`
2. Vérifier `ALLOWED_ORIGINS` dans le backend Python
3. Redéployer après modification

---

## 💰 Coûts Estimés

### Free Tier (12 premiers mois)
- RDS db.t3.micro : $0 (750h/mois)
- EC2 t3.micro × 2 : $0 (750h/mois)
- Amplify : $0 (1000 build minutes)
- **Total : $0/mois**

### Après Free Tier
- RDS : ~$15/mois
- EC2 × 2 : ~$15/mois
- Amplify : ~$10/mois
- **Total : ~$50-60/mois**

---

## 🎉 Félicitations !

Une fois toutes les étapes terminées, votre application HeartMatch sera en production sur AWS !

**Pour toute question, consultez :**
- AWS_DEPLOYMENT_GUIDE.md (guide complet)
- AWS_COMMANDS_CHEATSHEET.md (commandes utiles)
- Documentation AWS : https://docs.aws.amazon.com
