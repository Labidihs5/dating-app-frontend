#!/bin/bash

echo "🚀 Déploiement Complet de HeartMatch sur AWS"
echo "============================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_step() {
    echo -e "${GREEN}[ÉTAPE $1]${NC} $2"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

# Vérifier les prérequis
print_step "0" "Vérification des prérequis..."

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI n'est pas installé"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    print_error "Python 3 n'est pas installé"
    exit 1
fi

echo "✅ Tous les prérequis sont installés"
echo ""

# Collecter les informations
print_step "1" "Collecte des informations de déploiement"
echo ""

read -p "Région AWS (ex: eu-west-1): " AWS_REGION
read -p "Endpoint RDS PostgreSQL (ex: xxx.rds.amazonaws.com): " RDS_ENDPOINT
read -sp "Mot de passe RDS: " RDS_PASSWORD
echo ""
read -p "JWT Secret (pour backend Node.js): " JWT_SECRET
read -p "Secret Key (pour backend Python): " SECRET_KEY

echo ""
echo "📋 Récapitulatif:"
echo "  - Région: $AWS_REGION"
echo "  - RDS Endpoint: $RDS_ENDPOINT"
echo "  - JWT Secret: [MASQUÉ]"
echo "  - Secret Key: [MASQUÉ]"
echo ""

read -p "Continuer avec ces paramètres ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Déploiement annulé"
    exit 1
fi

# Installer EB CLI si nécessaire
if ! command -v eb &> /dev/null; then
    print_step "2" "Installation d'Elastic Beanstalk CLI..."
    pip install awsebcli
fi

# Déployer le Backend Node.js
print_step "3" "Déploiement du Backend Node.js..."
echo ""

cd backend

# Créer .ebignore
cat > .ebignore << EOF
node_modules/
.env
.git/
uploads/
*.log
.vercel/
EOF

# Initialiser EB
if [ ! -d .elasticbeanstalk ]; then
    eb init heartmatch-backend-node --platform node.js --region $AWS_REGION
fi

# Créer et déployer
eb create heartmatch-backend-node-env --instance-type t3.micro || eb use heartmatch-backend-node-env

# Configurer les variables d'environnement
eb setenv \
  DATABASE_URL="postgresql://postgres:${RDS_PASSWORD}@${RDS_ENDPOINT}:5432/heartmatch" \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET="${JWT_SECRET}" \
  UPLOAD_PATH="/tmp/uploads" \
  MAX_FILE_SIZE=5242880

# Déployer
eb deploy

# Récupérer l'URL
BACKEND_NODE_URL=$(eb status | grep "CNAME" | awk '{print $2}')
BACKEND_NODE_URL="http://${BACKEND_NODE_URL}"

echo "✅ Backend Node.js déployé: $BACKEND_NODE_URL"

cd ..

# Déployer le Backend Python
print_step "4" "Déploiement du Backend Python..."
echo ""

cd backend-python

# Créer .ebignore
cat > .ebignore << EOF
__pycache__/
*.pyc
.env
.git/
venv/
*.log
EOF

# Créer Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port 8080" > Procfile

# Initialiser EB
if [ ! -d .elasticbeanstalk ]; then
    eb init heartmatch-backend-python --platform python-3.9 --region $AWS_REGION
fi

# Créer et déployer
eb create heartmatch-backend-python-env --instance-type t3.micro || eb use heartmatch-backend-python-env

# Configurer les variables d'environnement
eb setenv \
  DATABASE_URL="postgresql://postgres:${RDS_PASSWORD}@${RDS_ENDPOINT}:5432/heartmatch" \
  SECRET_KEY="${SECRET_KEY}" \
  BACKEND_NODE_URL="${BACKEND_NODE_URL}" \
  ALLOWED_ORIGINS="*"

# Déployer
eb deploy

# Récupérer l'URL
BACKEND_PYTHON_URL=$(eb status | grep "CNAME" | awk '{print $2}')
BACKEND_PYTHON_URL="http://${BACKEND_PYTHON_URL}"

echo "✅ Backend Python déployé: $BACKEND_PYTHON_URL"

cd ..

# Préparer le Frontend
print_step "5" "Préparation du Frontend..."
echo ""

# Créer .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=${BACKEND_NODE_URL}/api
NEXT_PUBLIC_PYTHON_API_URL=${BACKEND_PYTHON_URL}
EOF

# Build
npm install
npm run build

echo "✅ Frontend buildé avec succès"

# Exécuter les migrations Prisma
print_step "6" "Exécution des migrations Prisma..."
echo ""

cd backend
eb ssh --command "cd /var/app/current && npx prisma migrate deploy && npx prisma generate"
cd ..

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "======================="
echo ""
echo "📋 URLs de vos services:"
echo "  Backend Node.js: $BACKEND_NODE_URL"
echo "  Backend Python:  $BACKEND_PYTHON_URL"
echo ""
echo "📝 Prochaines étapes pour le Frontend:"
echo "  1. Allez sur https://console.aws.amazon.com/amplify"
echo "  2. Créez une nouvelle app"
echo "  3. Uploadez le dossier .next/ ou connectez votre repo Git"
echo "  4. Configurez les variables d'environnement:"
echo "     NEXT_PUBLIC_API_URL=${BACKEND_NODE_URL}/api"
echo "     NEXT_PUBLIC_PYTHON_API_URL=${BACKEND_PYTHON_URL}"
echo ""
echo "📊 Commandes utiles:"
echo "  Backend Node.js:"
echo "    cd backend && eb status"
echo "    cd backend && eb logs"
echo "  Backend Python:"
echo "    cd backend-python && eb status"
echo "    cd backend-python && eb logs"
echo ""
echo "💰 Estimation des coûts: ~$50-100/mois (après Free Tier)"
echo ""
echo "🔒 N'oubliez pas de:"
echo "  - Configurer les Security Groups"
echo "  - Activer les backups RDS"
echo "  - Configurer CloudWatch Alarms"
echo "  - Ajouter un domaine personnalisé (optionnel)"
echo ""
