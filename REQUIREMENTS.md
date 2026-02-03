# HeartMatch - Installation & Configuration Requirements

## System Requirements

### Windows (Local Development)
- **OS**: Windows 10 / 11 (64-bit)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for npm packages

### Mac/Linux
- **OS**: macOS 10.15+ or Ubuntu 18.04+
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for npm packages

---

## Software Prerequisites

### 1. Node.js & npm
- **Version**: Node.js 18.x or higher
- **npm**: 9.x or higher

**Installation:**
```bash
# Windows: Download from https://nodejs.org/
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

**Verify Installation:**
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

### 2. Git (Optional but Recommended)
- **Version**: 2.30+
- **Download**: https://git-scm.com/

### 3. VS Code (Recommended)
- **Download**: https://code.visualstudio.com/

---

## Project Dependencies

### Core Framework
- **Next.js**: ^14.0.0 (React framework)
- **React**: ^19.0.0 (UI library)
- **TypeScript**: ^5.0 (Type safety)

### UI Components
- **Tailwind CSS**: ^4.0 (Styling)
- **shadcn/ui**: Latest (Component library)
- **lucide-react**: ^0.263+ (Icons)

### Location & Geolocation
- **Haversine Formula**: For distance calculation

### Storage
- **localStorage**: Built-in browser storage

### State Management
- **React Hooks**: useState, useContext, useRef

---

## Installation Steps (Windows Local)

### Step 1: Clone or Download Project
```bash
# Option A: Clone (if using Git)
git clone <your-repo-url>
cd dating-final

# Option B: Download & Extract ZIP
# Extract the downloaded ZIP file
# Navigate to the project folder
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Verify Installation
```bash
npm list react
npm list next
npm list tailwindcss
```

Expected output: All packages listed with ✓

### Step 4: Configuration
Create `.env.local` file in project root:
```env
# No API keys required for local development
# Default configuration uses localStorage
NEXT_PUBLIC_APP_NAME=HeartMatch
NEXT_PUBLIC_APP_ENV=development
```

---

## Running Locally (Windows)

### Option 1: Using npm (Recommended)
```bash
# Development mode with hot-reload
npm run dev

# Production build & test
npm run build
npm run start
```

### Option 2: Using Batch Script
Create `start-dev.bat` in project root:
```batch
@echo off
title HeartMatch - Development Server
npm run dev
pause
```

Run: Double-click `start-dev.bat`

### Option 3: Using PowerShell
```powershell
npm run dev
```

---

## Access the Application

### Local Development
- **URL**: http://localhost:3000
- **Auto-reload**: Yes (changes reflect immediately)
- **Mobile Testing**: Use Chrome DevTools (F12) → Device Emulation

### Mobile Device Testing
```bash
# Get your local IP
ipconfig

# On mobile: http://<YOUR-IP>:3000
# Example: http://192.168.1.100:3000
```

---

## Telegram Bot Deployment

### Prerequisites
- **Telegram Bot Token**: Get from @BotFather
- **Telegram Mini App URL**: Your deployed app URL (Vercel/Heroku)

### Setup Mini App

#### 1. Create Telegram Bot
```bash
# Message @BotFather on Telegram
/newbot
# Follow instructions to get BOT_TOKEN
```

#### 2. Deploy Application
```bash
# Option A: Vercel (Recommended)
npm install -g vercel
vercel login
vercel

# Option B: Heroku
npm install -g heroku
heroku login
heroku create heartmatch-app
git push heroku main

# Option C: Custom Server
# Deploy to your own server/VPS
```

#### 3. Configure Bot Commands
```bash
# Message @BotFather
/mybots
# Select your bot
# → botname
# → Edit Commands
# Add commands:
# start - Launch HeartMatch
# profile - View profile
# matches - View matches
# chat - Messages
# settings - Settings
```

#### 4. Set Mini App URL
```bash
# Message @BotFather
/mybots
# Select your bot
# → App commands
# Set URL: https://yourapp.vercel.app
```

---

## Production Deployment

### Vercel (Recommended - 1 Click)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables (Production)
Create `.env.production` on Vercel dashboard:
```
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://yourapp.vercel.app
```

### Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. Update Telegram bot URL

---

## Troubleshooting

### Issue: npm command not found
**Solution**: Reinstall Node.js from https://nodejs.org/

### Issue: Port 3000 already in use
```bash
# Windows: Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux: Kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: Modules not found
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Issue: Tailwind CSS not loading
```bash
# Rebuild styles
npm run build

# Clear Next.js cache
rm -r .next
npm run dev
```

---

## Verification Checklist

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] App opens at http://localhost:3000
- [ ] Profile creation works
- [ ] Swipe functionality works
- [ ] localStorage persists data
- [ ] Responsive on mobile

---

## File Structure

```
dating-final/
├── app/
│   ├── page.tsx                 # Home/Discover page
│   ├── profile/
│   │   └── page.tsx             # Profile creation
│   ├── matches/
│   ├── chat/
│   ├── likes/
│   ├── gold/
│   ├── settings/
│   └── layout.tsx
├── components/
│   ├── cards/
│   │   ├── SwipeCard.tsx
│   │   └── ProfileCard.tsx
│   ├── location/
│   │   ├── LocationSetup.tsx
│   │   ├── DistanceSlider.tsx
│   │   └── DistanceBadge.tsx
│   ├── layout/
│   └── ui/
├── hooks/
│   ├── useProfileAuth.ts
│   ├── useLocation.ts
│   ├── useSwipeGesture.ts
│   ├── useDistanceFilter.ts
│   └── useSwipeLimit.ts
├── lib/
│   ├── api-services.ts
│   ├── types.ts
│   ├── utils.ts
│   └── animations.ts
├── public/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── globals.css
└── .env.local
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Telegram Bot API**: https://core.telegram.org/bots

---

## Next Steps

1. Install all requirements
2. Follow installation steps
3. Run locally with `npm run dev`
4. Test all features
5. Deploy to Vercel
6. Configure Telegram bot
7. Launch!

**Happy Coding! 🚀**
