@echo off
echo ==========================================
echo 🚀 Deploiement Backend sur Railway
echo ==========================================
echo.

cd backend

REM Verifier Railway CLI
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI non installe
    echo 📦 Installation...
    npm i -g @railway/cli
)

echo 🔐 Connexion a Railway...
railway login

echo.
echo 📁 Initialisation du projet...
railway init

echo.
echo ⚙️ Configuration des variables...
echo.
echo IMPORTANT: Vous devez ajouter DATABASE_URL manuellement dans Railway Dashboard
echo.

set /p jwt_secret="JWT_SECRET (laissez vide pour auto): "
if "%jwt_secret%"=="" set jwt_secret=super-secret-jwt-key-change-this-in-production

railway variables set JWT_SECRET="%jwt_secret%"
railway variables set NODE_ENV="production"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set UPLOAD_PATH="./uploads"

echo.
echo 🚀 Deploiement...
railway up

echo.
echo 🌐 Generation du domaine...
railway domain

echo.
echo ==========================================
echo ✅ Backend deploye !
echo ==========================================
echo.
echo ⚠️ IMPORTANT: Ajoutez DATABASE_URL dans Railway Dashboard:
echo   1. railway open
echo   2. Variables
echo   3. Add Variable: DATABASE_URL = votre-url-postgresql
echo   4. Redeploy
echo.
echo 📊 Commandes utiles:
echo   railway open          - Dashboard
echo   railway logs          - Voir les logs
echo   railway up            - Redeployer
echo.
pause
