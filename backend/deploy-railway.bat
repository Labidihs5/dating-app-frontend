@echo off
echo 🚀 Deploying Backend to Railway...

REM 1. Install Railway CLI if not installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Railway CLI...
    npm install -g @railway/cli
)

REM 2. Login to Railway
echo 🔐 Login to Railway...
railway login

REM 3. Link to project
echo 🔗 Linking to Railway project...
railway link

REM 4. Add PostgreSQL
echo 🗄️  Adding PostgreSQL database...
railway add --database postgres

REM 5. Generate Prisma Client
echo ⚙️  Generating Prisma Client...
npx prisma generate

REM 6. Push schema
echo 📊 Pushing database schema...
railway run npx prisma db push

REM 7. Seed rooms
echo 🌱 Seeding system rooms...
railway run npx ts-node src/rooms/rooms.seeder.ts

REM 8. Deploy
echo 🚀 Deploying...
railway up

echo ✅ Deployment complete!
echo 🌐 Your backend is now live on Railway
pause
