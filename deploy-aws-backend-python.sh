#!/bin/bash

echo "🐍 Déploiement du Backend Python sur AWS Elastic Beanstalk"
echo "==========================================================="

cd backend-python

# Vérifier si EB CLI est installé
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI n'est pas installé. Installation..."
    pip install awsebcli
fi

# Créer .ebignore si n'existe pas
if [ ! -f .ebignore ]; then
    echo "📝 Création de .ebignore..."
    cat > .ebignore << EOF
__pycache__/
*.pyc
.env
.git/
venv/
*.log
.pytest_cache/
EOF
fi

# Créer Procfile si n'existe pas
if [ ! -f Procfile ]; then
    echo "📝 Création de Procfile..."
    echo "web: uvicorn app.main:app --host 0.0.0.0 --port 8080" > Procfile
fi

# Vérifier si EB est initialisé
if [ ! -d .elasticbeanstalk ]; then
    echo "🔧 Initialisation d'Elastic Beanstalk..."
    eb init heartmatch-backend-python --platform python-3.9 --region eu-west-1
else
    echo "✅ Elastic Beanstalk déjà initialisé"
fi

# Demander si créer un nouvel environnement
read -p "Créer un nouvel environnement ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️ Création de l'environnement..."
    eb create heartmatch-backend-python-env --instance-type t3.micro
    
    echo "⚙️ Configuration des variables d'environnement..."
    read -p "Entrez l'endpoint RDS (ex: xxx.rds.amazonaws.com): " RDS_ENDPOINT
    read -sp "Entrez le mot de passe RDS: " RDS_PASSWORD
    echo
    read -p "Entrez le SECRET_KEY: " SECRET_KEY
    read -p "Entrez l'URL du backend Node.js: " BACKEND_NODE_URL
    
    eb setenv \
      DATABASE_URL="postgresql://postgres:${RDS_PASSWORD}@${RDS_ENDPOINT}:5432/heartmatch" \
      SECRET_KEY="${SECRET_KEY}" \
      BACKEND_NODE_URL="${BACKEND_NODE_URL}" \
      ALLOWED_ORIGINS="*"
fi

# Déployer
echo "📦 Déploiement de l'application..."
eb deploy

# Vérifier le statut
echo "✅ Vérification du statut..."
eb status

# Afficher l'URL
echo ""
echo "🎉 Déploiement terminé !"
echo "URL de l'application:"
eb status | grep "CNAME"

echo ""
echo "📊 Pour voir les logs: eb logs"
echo "🔄 Pour redéployer: eb deploy"
echo "🗑️ Pour supprimer: eb terminate"
