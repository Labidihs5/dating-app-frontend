# HeartMatch - Quick Start Guide

## ⚡ 30 Second Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd dating-app && npm install

# 2. Create env file
cp .env.example .env.local

# 3. Start development
npm run dev

# 4. Open browser
open http://localhost:3000
```

---

## 📋 Quick Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run format       # Format code

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 🗂️ File Locations Quick Guide

### Pages
- **Home/Swipe**: `/app/page.tsx`
- **Profile**: `/app/profile/page.tsx`
- **Likes**: `/app/likes/page.tsx`
- **Matches**: `/app/matches/page.tsx`
- **Chat**: `/app/chat/page.tsx`
- **Gold**: `/app/gold/page.tsx`
- **Settings**: `/app/settings/page.tsx`

### Components
- **Navigation**: `/components/layout/Navbar.tsx`
- **Profile Card**: `/components/cards/ProfileCard.tsx`
- **Swipe Card**: `/components/cards/SwipeCard.tsx`

### Logic
- **API Services**: `/lib/api-services.ts`
- **Type Definitions**: `/lib/types.ts`
- **Animations**: `/lib/animations.ts`
- **Custom Hooks**: `/hooks/*`

---

## 🎨 Customization Quick Tips

### Change Colors
Edit `/app/globals.css`:
```css
:root {
  --primary: oklch(0.55 0.25 320);  /* Change this */
}
```

### Change Fonts
Edit `/app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'
const font = YourFont({ subsets: ['latin'] })
```

### Add Pages
1. Create `/app/your-page/page.tsx`
2. Add to Navbar in `/components/layout/Navbar.tsx`
3. Export component with `'use client'` at top

### Change Theme Colors
Update all 5 primary colors in globals.css:
- `--primary` - Main brand color
- `--secondary` - Secondary actions
- `--accent` - Highlights
- `--success` - Positive actions
- `--destructive` - Negative actions

---

## 🔗 Environment Variables

**Development** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=test_token
```

**Production** (Deploy platform)
- Set same variables in deployment settings
- Never commit `.env.local`

---

## 📱 Testing Pages Locally

### Test Discovery Page
```
http://localhost:3000
```

### Test Profile Creation
```
http://localhost:3000/profile
```

### Test Other Pages
```
http://localhost:3000/likes
http://localhost:3000/matches
http://localhost:3000/chat
http://localhost:3000/gold
http://localhost:3000/settings
```

---

## 🔌 Connecting to Backend

### 1. Update API URL
```env
NEXT_PUBLIC_API_URL=http://your-backend.com/api
```

### 2. Replace Mock Data
Each page uses mock data. Replace calls like:
```typescript
// Before
const profiles = mockProfiles;

// After
const { data: profiles } = await discoveryAPI.getProfiles();
```

### 3. Test API Connection
```typescript
// In browser console
import { discoveryAPI } from '@/lib/api-services'
await discoveryAPI.getProfiles()
```

---

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

---

## 🐛 Debugging Tips

### Check Console
```bash
# Browser DevTools
F12 → Console tab
```

### Log Data
```typescript
console.log("[v0]", data)  // v0 displays in logs
```

### Test API Calls
```typescript
// Use browser console
fetch('http://localhost:3001/api/test')
  .then(r => r.json())
  .then(console.log)
```

### Enable React DevTools
```bash
npm install react-dev-tools
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete overview |
| `INSTALLATION.md` | Setup guide |
| `FEATURES.md` | Feature details |
| `PROJECT_SUMMARY.md` | Project status |
| `QUICK_START.md` | This file |

---

## 🎯 Common Tasks

### Add New Feature
1. Create component in `/components`
2. Add page in `/app` if needed
3. Add navigation link
4. Update types in `/lib/types.ts`

### Add New Page
1. Create folder `/app/feature-name`
2. Create `page.tsx` with layout
3. Import `Navbar` and `PageContainer`
4. Add route to Navbar

### Customize Styling
1. Edit classes in components
2. Or update `/app/globals.css`
3. Use Tailwind classes (no custom CSS needed)

### Add API Integration
1. Add method to `/lib/api-services.ts`
2. Replace mock data in page
3. Handle loading/error states
4. Test with backend

---

## 🔐 Security Checklist

- [ ] No secrets in code
- [ ] Use `.env` for sensitive data
- [ ] HTTPS only in production
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use parameterized queries (backend)
- [ ] Test for XSS vulnerabilities
- [ ] Test CORS headers

---

## 📊 Performance Tips

### Optimize Images
```typescript
// Use next/image
import Image from 'next/image'
<Image src={url} alt="desc" width={400} height={600} />
```

### Lazy Load Components
```typescript
// Use dynamic imports
import dynamic from 'next/dynamic'
const Component = dynamic(() => import('@/components/Heavy'))
```

### Monitor Bundle Size
```bash
npm install -D webpack-bundle-analyzer
```

---

## 🆘 Common Issues

### Issue: Port 3000 already in use
```bash
# Change port
npm run dev -- -p 3001
```

### Issue: Module not found
```bash
# Reinstall node_modules
rm -rf node_modules && npm install
```

### Issue: Styles not loading
```bash
# Restart dev server
# Clear browser cache
# Hard refresh (Ctrl+Shift+R)
```

### Issue: API not responding
```bash
# Check backend is running
# Verify API_URL in .env.local
# Check CORS headers
```

---

## 📞 Support Resources

- **GitHub Issues**: Report bugs
- **Discussions**: Ask questions
- **Documentation**: Check FEATURES.md
- **Email**: support@heartmatch.app

---

## 🎓 Learning Resources

### Next.js
- https://nextjs.org/docs
- App Router guide
- API Routes

### Tailwind CSS
- https://tailwindcss.com/docs
- Component library
- Responsive design

### React
- https://react.dev
- Hooks documentation
- Best practices

### TypeScript
- https://www.typescriptlang.org/docs
- Type system
- Best practices

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## ✨ What's Included

✅ 7 complete pages
✅ Premium design system
✅ Responsive layout
✅ Animation utilities
✅ TypeScript types
✅ API service layer
✅ Test configuration
✅ Complete documentation
✅ Deployment ready
✅ Telegram bot ready

---

## 🚀 Next Steps

1. **Customize branding** - Update colors and fonts
2. **Set up backend** - Connect to your Node.js server
3. **Test features** - Try all 7 pages locally
4. **Deploy** - Push to Vercel or your server
5. **Launch bot** - Configure Telegram bot
6. **Go live** - Celebrate! 🎉

---

**Start coding now: `npm run dev`** 🚀

---

*Last updated: February 1, 2026*
