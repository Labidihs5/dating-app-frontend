@echo off
echo 🚀 Starting backend with ngrok tunnel...

cd backend
start "Backend" npm run dev

timeout /t 3

echo 📡 Creating ngrok tunnel...
start "Ngrok" ngrok http 3001

timeout /t 3

echo ✅ Backend started!
echo 📝 Get ngrok URL from ngrok dashboard and update .env.local
echo    Example: NEXT_PUBLIC_API_URL=https://abc123.ngrok.io/api

pause