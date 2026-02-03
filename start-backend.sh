#!/bin/bash

echo "🚀 Starting backend with ngrok tunnel..."

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start ngrok tunnel
echo "📡 Creating ngrok tunnel..."
ngrok http 3001 --log=stdout &
NGROK_PID=$!

# Wait for ngrok to start
sleep 2

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io')

if [ ! -z "$NGROK_URL" ]; then
    echo "✅ Backend accessible at: $NGROK_URL"
    echo "📝 Update .env.local with: NEXT_PUBLIC_API_URL=$NGROK_URL/api"
else
    echo "❌ Failed to get ngrok URL"
fi

# Keep running
wait