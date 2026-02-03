@echo off
echo 🚀 Starting HeartMatch Dating App...

echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

echo.
echo 🗄️  Setting up database...
call npx prisma generate
call npx prisma db push

echo.
echo 🔥 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo 📱 Starting frontend...
cd ..
start "Frontend Dev" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend: http://localhost:3001
echo.
pause