#!/bin/bash

echo "🚀 Deploying Backend to Railway..."

# 1. Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# 2. Login to Railway
echo "🔐 Login to Railway..."
railway login

# 3. Link to project or create new
echo "🔗 Linking to Railway project..."
railway link

# 4. Add PostgreSQL database
echo "🗄️  Adding PostgreSQL database..."
railway add --database postgres

# 5. Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

# 6. Push database schema
echo "📊 Pushing database schema..."
railway run npx prisma db push

# 7. Seed system rooms
echo "🌱 Seeding system rooms..."
railway run npx ts-node src/rooms/rooms.seeder.ts

# 8. Deploy to Railway
echo "🚀 Deploying..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your backend is now live on Railway"
echo "📝 Don't forget to update your frontend API URL"
