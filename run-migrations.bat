@echo off
echo ==========================================
echo 🔄 Execution des migrations Prisma
echo ==========================================
echo.

cd backend

echo 📊 Generation du client Prisma...
railway run npx prisma generate

echo.
echo 🗄️ Execution des migrations...
railway run npx prisma migrate deploy

echo.
echo ✅ Migrations terminees !
echo.
echo 🔄 Redemarrage du service...
railway up

pause
