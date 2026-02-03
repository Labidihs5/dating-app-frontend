# HeartMatch Installation & Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- npm 9+ or yarn 3+
- Git

### 2. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd dating-app

# Install dependencies
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_token
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t heartmatch .
docker run -p 3000:3000 heartmatch
```

### Option 3: Traditional Hosting

1. Build: `npm run build`
2. Upload `/out` or `.next` folders
3. Set environment variables
4. Start with: `npm start`

---

## 🔧 Backend Integration Checklist

### 1. Environment Variables
- [ ] Set `NEXT_PUBLIC_API_URL` to your backend
- [ ] Add Telegram bot token
- [ ] Add Stripe keys
- [ ] Configure analytics

### 2. API Endpoints
- [ ] Implement `/api/users/*` endpoints
- [ ] Create `/api/profiles` discovery
- [ ] Set up `/api/matches` management
- [ ] Implement `/api/messages` chat
- [ ] Build `/api/subscription` payments

### 3. Database
- [ ] Set up PostgreSQL/MongoDB
- [ ] Create Prisma schema
- [ ] Run migrations
- [ ] Seed test data

### 4. Authentication
- [ ] Implement Telegram OAuth
- [ ] Set up JWT tokens
- [ ] Create session management
- [ ] Add refresh token logic

### 5. Real-time Features
- [ ] Set up WebSocket (Socket.io or similar)
- [ ] Implement message updates
- [ ] Add notification system
- [ ] Test connection stability

### 6. Payments
- [ ] Integrate Stripe
- [ ] Implement webhook handlers
- [ ] Set up subscription logic
- [ ] Configure billing page

### 7. Testing
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test subscription features
- [ ] Check mobile responsiveness

---

## 📱 Telegram Mini App Setup

### 1. Create Telegram Bot
```bash
1. Chat with @BotFather on Telegram
2. Create new bot: /newbot
3. Copy bot token
4. Set bot name and description
```

### 2. Configure Mini App
```bash
1. Send: /setmenubutton
2. Set menu button to Web App
3. Provide Web App URL: https://your-domain.com
```

### 3. Test in Telegram
1. Find your bot on Telegram
2. Click the menu button
3. App opens in mini app view

---

## 🔐 Security Checklist

- [ ] Enable HTTPS (required for Telegram)
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Set up environment secrets
- [ ] Enable firewall rules
- [ ] Add brute force protection
- [ ] Implement CSRF tokens
- [ ] Use secure cookies
- [ ] Set up DDoS protection

---

## 📊 Monitoring & Analytics

### 1. Error Tracking
```bash
# Install Sentry
npm install @sentry/react @sentry/nextjs
```

### 2. Analytics
```bash
# Google Analytics
npm install react-ga4
```

### 3. Performance
- Use Vercel Analytics
- Monitor Core Web Vitals
- Check bundle size
- Optimize images

---

## 🐛 Troubleshooting

### Issue: API Connection Failed
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Verify NEXT_PUBLIC_API_URL in .env.local
```

### Issue: Telegram Mini App Not Loading
- Verify HTTPS is enabled
- Check bot menu button configuration
- Confirm Web App URL is accessible

### Issue: Images Not Loading
- Check public folder permissions
- Verify image paths are correct
- Ensure CORS headers are set

### Issue: Slow Performance
- Run `npm run build`
- Check bundle size: `npm install -D webpack-bundle-analyzer`
- Optimize images
- Enable caching

---

## 📚 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🔄 Database Setup (Backend)

### Using Prisma

```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Schema Example (prisma/schema.prisma)
```prisma
model User {
  id        String   @id @default(cuid())
  telegramId Int?    @unique
  name      String
  email     String   @unique
  age       Int
  photos    String[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Match {
  id     String @id @default(cuid())
  user1Id String
  user2Id String
  
  matchedAt DateTime @default(now())
}

model Message {
  id      String @id @default(cuid())
  matchId String
  fromUserId String
  content String
  isRead  Boolean @default(false)
  
  createdAt DateTime @default(now())
}
```

---

## 🎯 Next Steps After Installation

1. **Customize branding**
   - Update app name in metadata
   - Add your logo
   - Configure theme colors

2. **Add your backend**
   - Update API endpoints
   - Configure authentication
   - Test all features

3. **Launch Telegram bot**
   - Set up bot profile
   - Configure mini app
   - Test with real users

4. **Optimize performance**
   - Minify and compress assets
   - Set up CDN
   - Enable caching

5. **Monitor and maintain**
   - Set up error tracking
   - Monitor performance
   - Track user metrics
   - Plan scaling

---

## 📞 Support & Resources

- **Documentation**: See README.md
- **Issues**: GitHub issues
- **Discord**: Join community server
- **Email**: support@heartmatch.app

---

**Happy coding! 🚀**
