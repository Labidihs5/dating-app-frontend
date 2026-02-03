#!/bin/bash

echo "🚀 Déploiement HeartMatch Backend sur Railway"
echo "=============================================="
echo ""

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI n'est pas installé"
    echo "📦 Installation..."
    npm i -g @railway/cli
fi

echo "✅ Railway CLI détecté"
echo ""

# Login
echo "🔐 Connexion à Railway..."
railway login

echo ""
echo "📁 Initialisation du projet..."
railway init

echo ""
echo "🗄️  Ajout de PostgreSQL..."
railway add --database postgres

echo ""
echo "⚙️  Configuration des variables d'environnement..."
echo "Entrez votre JWT_SECRET (ou appuyez sur Entrée pour générer automatiquement):"
read jwt_secret

if [ -z "$jwt_secret" ]; then
    jwt_secret=$(openssl rand -base64 32)
    echo "🔑 JWT_SECRET généré: $jwt_secret"
fi

railway variables set JWT_SECRET="$jwt_secret"
railway variables set NODE_ENV="production"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set UPLOAD_PATH="./uploads"

echo ""
echo "🚀 Déploiement en cours..."
railway up

echo ""
echo "🌐 Génération du domaine public..."
railway domain

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📊 Commandes utiles:"
echo "  - Voir les logs: railway logs"
echo "  - Ouvrir dashboard: railway open"
echo "  - Redéployer: railway up"
echo ""
echo "🔗 N'oubliez pas de copier l'URL Railway dans votre frontend (.env.local)"
echo "   NEXT_PUBLIC_API_URL=https://votre-app.up.railway.app/api"
