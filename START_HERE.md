# 🎯 START HERE - HeartMatch Setup

Welcome! Follow these simple steps to get **HeartMatch** running on your machine.

---

## ⚡ 3 Steps to Launch

### Step 1: Install Dependencies
```bash
npm install
```
**Takes**: ~2 minutes

### Step 2: Start Development Server
```bash
npm run dev
```
**Takes**: ~10 seconds

### Step 3: Open in Browser
```
http://localhost:3000
```

**You're done! 🎉**

---

## 🗓️ What You Need

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn (comes with Node.js)
- A code editor (VS Code recommended)
- A browser (any modern browser)

---

## 📱 Try It Out

### Explore the App
1. **Swipe** - Discover profiles
2. **Profile** - Create your profile
3. **Likes** - See who likes you
4. **Matches** - View your matches
5. **Chat** - Send messages
6. **Gold** - Try premium features
7. **Settings** - Customize preferences

### Test Interactions
- 👆 Drag cards to swipe
- 💬 Type messages
- 🎯 Click all buttons
- 🌙 Toggle dark mode

---

## 📚 Documentation

### Quick Reference
| Want to... | Read this |
|-----------|-----------|
| Run it fast | [QUICK_START.md](./QUICK_START.md) |
| Deploy it | [INSTALLATION.md](./INSTALLATION.md) |
| Understand it | [STRUCTURE.md](./STRUCTURE.md) |
| Learn features | [FEATURES.md](./FEATURES.md) |
| Find anything | [DOCS_INDEX.md](./DOCS_INDEX.md) |

### Main Guides
- **[README.md](./README.md)** - Complete overview
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build

# Quality
npm run lint            # Check code
npm test               # Run tests
```

---

## 🎨 Customization Quick Tips

### Change App Title
Edit `/app/layout.tsx`:
```typescript
title: 'Your App Name'
```

### Change Colors
Edit `/app/globals.css`:
```css
--primary: oklch(0.55 0.25 320);  /* Change colors here */
```

### Add New Page
1. Create folder: `/app/your-page`
2. Create file: `/app/your-page/page.tsx`
3. Add to Navbar (in `/components/layout/Navbar.tsx`)

---

## 🔌 Connect to Backend

When you have a backend running:

1. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-backend.com/api
```

2. Replace mock data in pages
3. Test API connections
4. Deploy!

---

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Traditional Hosting
```bash
npm run build
# Deploy the .next folder
npm start
```

### Option 3: Docker
```bash
docker build -t heartmatch .
docker run -p 3000:3000 heartmatch
```

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Need to reset?
```bash
npm run build
npm run start
```

---

## 📂 Project Layout

```
📦 HeartMatch/
├── 📂 app/              # Pages (7 different pages)
├── 📂 components/       # Reusable components
├── 📂 hooks/            # Custom React hooks
├── 📂 lib/              # Utilities & services
├── 📄 package.json      # Dependencies
├── 📄 README.md         # Full documentation
└── 📄 START_HERE.md     # This file
```

---

## ✨ Key Features

- ✅ **Swipe Discovery** - Find matches by swiping
- ✅ **Profile Creation** - 3-step profile setup
- ✅ **Messaging** - Chat with matches
- ✅ **Premium** - Gold subscription system
- ✅ **Responsive** - Works on mobile & desktop
- ✅ **Dark Mode** - Light and dark themes
- ✅ **Animated** - Smooth, modern animations

---

## 🎯 Next Steps

### After It's Running

1. **Explore the code**
   - Check `/app` for pages
   - Check `/components` for UI components
   - Check `/lib` for utilities

2. **Customize it**
   - Change colors in `globals.css`
   - Update app name in `layout.tsx`
   - Modify content in pages

3. **Connect backend**
   - Update API URL in `.env.local`
   - Replace mock data
   - Test API calls

4. **Deploy it**
   - Run `npm run build`
   - Deploy to Vercel, Docker, or your host

---

## 📞 Need Help?

### Check These First
1. [QUICK_START.md](./QUICK_START.md) - Common tasks
2. [README.md](./README.md) - Full documentation
3. [DOCS_INDEX.md](./DOCS_INDEX.md) - Find anything

### Common Issues
- **Port conflict**: Try `npm run dev -- -p 3001`
- **Module not found**: Run `npm install` again
- **Styles not loading**: Clear cache and hard refresh
- **API not working**: Check `.env.local`

---

## 🎓 Learning

### Want to Learn?
1. Explore the code
2. Read the documentation
3. Try modifying components
4. Deploy your changes

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## 💡 Pro Tips

1. **Use dark mode** in VS Code for comfortable coding
2. **React DevTools** browser extension helps debugging
3. **Check console** for helpful error messages
4. **Use TypeScript** for better error catching
5. **Comment your code** for team clarity

---

## 🎉 You're Ready!

### 3 Commands to Success

```bash
# 1. Install
npm install

# 2. Run
npm run dev

# 3. Build
npm run build
```

That's it! You now have a professional dating app frontend.

---

## 📋 Checklist

- [ ] Node.js installed
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:3000
- [ ] Explored all 7 pages
- [ ] Read QUICK_START.md
- [ ] Ready to customize!

---

## 🚀 Ready?

### Start Now
```bash
npm run dev
```

### Then Read
[QUICK_START.md](./QUICK_START.md) - Full quick reference

### Questions?
See [DOCS_INDEX.md](./DOCS_INDEX.md) - Find what you need

---

## 🌟 Final Note

This is a **production-ready** frontend. Everything works out of the box. Just connect it to your backend and you're ready to launch! 🚀

---

**Happy coding! ❤️**

---

*HeartMatch Frontend v1.0.0*  
*Production Ready • Fully Documented • Easy to Customize*
