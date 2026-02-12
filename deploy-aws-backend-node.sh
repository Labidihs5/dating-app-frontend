#!/bin/bash

echo "🚀 Déploiement du Backend Node.js sur AWS Elastic Beanstalk"
echo "============================================================"

cd backend

# Vérifier si EB CLI est installé
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI n'est pas installé. Installation..."
    pip install awsebcli
fi

# Créer .ebignore si n'existe pas
if [ ! -f .ebignore ]; then
    echo "📝 Création de .ebignore..."
    cat > .ebignore << EOF
node_modules/
.env
.git/
uploads/
*.log
.vercel/
EOF
fi

# Vérifier si EB est initialisé
if [ ! -d .elasticbeanstalk ]; then
    echo "🔧 Initialisation d'Elastic Beanstalk..."
    eb init heartmatch-backend-node --platform node.js --region eu-west-1
else
    echo "✅ Elastic Beanstalk déjà initialisé"
fi

# Demander si créer un nouvel environnement
read -p "Créer un nouvel environnement ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️ Création de l'environnement..."
    eb create heartmatch-backend-node-env --instance-type t3.micro
    
    echo "⚙️ Configuration des variables d'environnement..."
    read -p "Entrez l'endpoint RDS (ex: xxx.rds.amazonaws.com): " RDS_ENDPOINT
    read -sp "Entrez le mot de passe RDS: " RDS_PASSWORD
    echo
    read -p "Entrez le JWT_SECRET: " JWT_SECRET
    
    eb setenv \
      DATABASE_URL="postgresql://postgres:${RDS_PASSWORD}@${RDS_ENDPOINT}:5432/heartmatch" \
      NODE_ENV=production \
      PORT=8080 \
      JWT_SECRET="${JWT_SECRET}" \
      UPLOAD_PATH="/tmp/uploads" \
      MAX_FILE_SIZE=5242880
    
    echo "🔄 Exécution des migrations Prisma..."
    eb ssh --command "cd /var/app/current && npx prisma migrate deploy && npx prisma generate"
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
