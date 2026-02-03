@echo off
echo ==========================================
echo 🚀 Deploiement Frontend sur Railway
echo ==========================================
echo.

railway login

echo.
echo 📁 Initialisation...
railway init

echo.
echo ⚙️ Configuration variable...
railway variables set NEXT_PUBLIC_API_URL="https://lovematchback-production.up.railway.app/api"

echo.
echo 🚀 Deploiement...
railway up

echo.
echo 🌐 Generation du domaine...
railway domain

echo.
echo ✅ Frontend deploye !
pause
