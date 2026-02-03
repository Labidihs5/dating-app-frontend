@echo off
echo ==========================================
echo 🚀 Deploiement Backend (Sans DB)
echo ==========================================
echo.

cd backend

where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    npm i -g @railway/cli
)

railway login
railway init

echo.
echo ⚙️ Variables...
set /p jwt_secret="JWT_SECRET: "
if "%jwt_secret%"=="" set jwt_secret=change-this-secret

railway variables set JWT_SECRET="%jwt_secret%"
railway variables set NODE_ENV="production"

echo.
echo 🚀 Deploiement...
railway up

echo.
railway domain

echo.
echo ✅ Deploye !
echo Ajoutez DATABASE_URL manuellement dans Railway Dashboard
pause
