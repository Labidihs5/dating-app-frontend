@echo off
echo ==========================================
echo 🚀 Deploiement COMPLET sur Railway
echo ==========================================
echo.

REM Verifier Railway CLI
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI non installe
    echo 📦 Installation...
    npm i -g @railway/cli
)

echo ✅ Railway CLI detecte
echo.
echo 🔐 Connexion a Railway...
railway login

echo.
echo ==========================================
echo 📦 ETAPE 1: DEPLOIEMENT BACKEND
echo ==========================================
echo.

cd backend

echo 📁 Initialisation du projet backend...
railway init

echo.
echo 🗄️ Ajout de PostgreSQL...
railway add --database postgres

echo.
echo ⚙️ Configuration des variables backend...
set /p jwt_secret="JWT_SECRET (laissez vide pour auto): "
if "%jwt_secret%"=="" set jwt_secret=super-secret-jwt-key-change-this

railway variables set JWT_SECRET="%jwt_secret%"
railway variables set NODE_ENV="production"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set UPLOAD_PATH="./uploads"

echo.
echo 🚀 Deploiement backend...
railway up

echo.
echo 🌐 Generation du domaine backend...
railway domain

echo.
echo ✅ Backend deploye !
echo.
set /p backend_url="Entrez l'URL Railway du backend (ex: https://xxx.up.railway.app): "

cd ..

echo.
echo ==========================================
echo 🎨 ETAPE 2: DEPLOIEMENT FRONTEND
echo ==========================================
echo.

echo 📁 Initialisation du projet frontend...
railway init

echo.
echo ⚙️ Configuration de l'URL API...
railway variables set NEXT_PUBLIC_API_URL="%backend_url%/api"

echo.
echo 🚀 Deploiement frontend...
railway up

echo.
echo 🌐 Generation du domaine frontend...
railway domain

echo.
echo ==========================================
echo ✅ DEPLOIEMENT TERMINE !
echo ==========================================
echo.
echo 📊 Vos services:
echo   Backend:  %backend_url%
echo   Frontend: (voir ci-dessus)
echo.
echo 📋 Commandes utiles:
echo   railway logs          - Voir les logs
echo   railway open          - Ouvrir dashboard
echo   railway up            - Redeployer
echo.
pause
