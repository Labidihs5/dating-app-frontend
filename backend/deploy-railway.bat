@echo off
echo ========================================
echo 🚀 Deploiement HeartMatch sur Railway
echo ========================================
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
echo 📁 Initialisation du projet...
railway init

echo.
echo 🗄️ Ajout de PostgreSQL...
railway add --database postgres

echo.
echo ⚙️ Configuration des variables...
set /p jwt_secret="Entrez votre JWT_SECRET (ou laissez vide pour auto-generer): "

if "%jwt_secret%"=="" (
    set jwt_secret=super-secret-jwt-key-change-this-in-production
    echo 🔑 JWT_SECRET par defaut utilise
)

railway variables set JWT_SECRET="%jwt_secret%"
railway variables set NODE_ENV="production"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set UPLOAD_PATH="./uploads"

echo.
echo 🚀 Deploiement en cours...
railway up

echo.
echo 🌐 Generation du domaine...
railway domain

echo.
echo ✅ Deploiement termine !
echo.
echo 📊 Commandes utiles:
echo   - Voir les logs: railway logs
echo   - Ouvrir dashboard: railway open
echo   - Redeployer: railway up
echo.
echo 🔗 Copiez l'URL Railway dans votre frontend (.env.local)
echo    NEXT_PUBLIC_API_URL=https://votre-app.up.railway.app/api
echo.
pause
