#!/bin/bash

echo "🎨 Déploiement du Frontend sur AWS Amplify"
echo "==========================================="

# Vérifier si AWS CLI est installé
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI n'est pas installé."
    echo "Installez-le depuis: https://aws.amazon.com/cli/"
    exit 1
fi

# Vérifier si Amplify CLI est installé
if ! command -v amplify &> /dev/null; then
    echo "📦 Installation d'Amplify CLI..."
    npm install -g @aws-amplify/cli
fi

echo "⚙️ Configuration des variables d'environnement..."
read -p "Entrez l'URL du backend Node.js (ex: http://xxx.elasticbeanstalk.com): " BACKEND_NODE_URL
read -p "Entrez l'URL du backend Python (ex: http://xxx.elasticbeanstalk.com): " BACKEND_PYTHON_URL

# Créer .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=${BACKEND_NODE_URL}/api
NEXT_PUBLIC_PYTHON_API_URL=${BACKEND_PYTHON_URL}
EOF

echo "📝 Fichier .env.production créé"

# Build l'application
echo "🔨 Build de l'application Next.js..."
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "✅ Build réussi !"
echo ""
echo "📋 Prochaines étapes pour déployer sur Amplify:"
echo ""
echo "Option 1 - Via AWS Console (Recommandé):"
echo "  1. Allez sur https://console.aws.amazon.com/amplify"
echo "  2. Cliquez 'New app' → 'Host web app'"
echo "  3. Choisissez 'Deploy without Git' ou connectez votre repo GitHub"
echo "  4. Configurez les variables d'environnement:"
echo "     NEXT_PUBLIC_API_URL=${BACKEND_NODE_URL}/api"
echo "     NEXT_PUBLIC_PYTHON_API_URL=${BACKEND_PYTHON_URL}"
echo "  5. Déployez !"
echo ""
echo "Option 2 - Via Git (si vous avez un repo):"
echo "  1. Poussez votre code sur GitHub"
echo "  2. Connectez le repo dans Amplify Console"
echo "  3. Amplify détectera automatiquement Next.js"
echo ""
echo "Option 3 - Via Amplify CLI:"
echo "  amplify init"
echo "  amplify add hosting"
echo "  amplify publish"
echo ""
echo "📦 Votre build est prêt dans le dossier .next/"
echo ""
echo "🎉 Configuration terminée !"
