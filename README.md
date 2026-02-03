# HeartMatch - Premium Telegram Dating Mini App

A modern, premium dating application frontend built with React, Next.js 16, and Tailwind CSS. Designed as a Telegram mini-app with full support for swiping, messaging, and premium features.

## 🎯 Features

### Core Features
- **Swipe Discovery**: Smooth card-based swiping with drag interactions
- **Profile Creation**: Multi-step form for setting up user profiles
- **Likes System**: View who likes you (FREE: blurred, GOLD: visible)
- **Matches**: Real-time match notifications with confetti animations
- **Messaging**: Instant messaging between matched users
- **Premium Gold**: Subscription system with multiple plans

### Premium Features (GOLD)
- ✨ Unlimited swipes (vs 20/day FREE)
- 💬 Unlimited messaging
- 👀 See who likes you
- ✓✓ Read receipts
- 🚀 Unlimited Super Likes
- 📈 Priority boost
- 🎁 Exclusive filters

### Technical Features
- 📱 Responsive mobile & desktop design
- 🎨 Premium dark/light theme support
- ⚡ Smooth animations and micro-interactions
- 🔐 Privacy and security controls
- 🔔 Notification preferences
- 📊 User analytics ready

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Home/Discover (Swipe)
│   ├── profile/page.tsx         # Create/Edit Profile
│   ├── likes/page.tsx           # Who Liked Me
│   ├── matches/page.tsx         # Matches List
│   ├── chat/page.tsx            # Messaging
│   ├── chat/loading.tsx         # Chat Loading
│   ├── gold/page.tsx            # Premium Subscription
│   ├── settings/page.tsx        # Settings & Preferences
│   ├── layout.tsx               # Root Layout
│   └── globals.css              # Global Styles & Theme
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Bottom/Side Navigation
│   │   └── PageContainer.tsx    # Main Page Wrapper
│   ├── cards/
│   │   ├── ProfileCard.tsx      # Profile Card Display
│   │   └── SwipeCard.tsx        # Interactive Swipe Card
│   └── ui/                      # shadcn/ui Components
│
├── hooks/
│   ├── useUserPreferences.ts    # User Preferences State
│   ├── useSwipeLimit.ts         # Swipe Limit Management
│   └── use-mobile.tsx           # Responsive Design Hook
│
├── lib/
│   ├── utils.ts                 # Utility Functions
│   ├── animations.ts            # Animation Utilities
│   └── api-services.ts          # Backend API Layer
│
└── public/                      # Static Assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dating-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette (Premium)
- **Primary**: Deep Purple (`oklch(0.55 0.25 320)`)
- **Secondary**: Soft Purple (`oklch(0.45 0.22 280)`)
- **Accent**: Warm Orange (`oklch(0.65 0.28 15)`)
- **Success**: Fresh Green (`oklch(0.68 0.2 142)`)
- **Background**: Clean White/Dark (`oklch(0.98 0 0)` / `oklch(0.12 0 0)`)

### Typography
- **Font**: Geist (sans-serif)
- **Monospace**: Geist Mono
- **Font Sizes**: Semantic scale with responsive adjustments

## 📱 Pages & Components

### 1. Home / Swipe (`/`)
- Card-based profile discovery
- Swipe left/right/super-like
- Free tier: 20 swipes/day
- Ad-based swipe replenishment (max 4 ads)

### 2. Profile (`/profile`)
- 3-step profile creation
- Photo upload (1-5 photos)
- Bio and preferences
- Relationship type selection

### 3. Likes (`/likes`)
- View incoming likes
- Free: Blurred profiles
- Gold: Clear profiles + like back
- Filter and sort options

### 4. Matches (`/matches`)
- All active matches
- Last message preview
- New match badges
- Unmatch functionality

### 5. Chat (`/chat`)
- Real-time messaging interface
- Message read status (Gold)
- Free: Limited messaging
- Gold: Unlimited + features

### 6. Gold (`/gold`)
- Subscription plans (1M, 3M, 6M, 1Y)
- Feature comparison table
- Pricing with discounts
- Payment simulation

### 7. Settings (`/settings`)
- Notification preferences
- Privacy controls
- Theme/Language settings
- Account management

## 🔌 API Integration

### API Service Layer (`/lib/api-services.ts`)

The frontend includes a complete API service layer ready for backend integration:

```typescript
// Example: Getting profiles
const profiles = await discoveryAPI.getProfiles(filters);

// Example: Liking a profile
await discoveryAPI.like(profileId);

// Example: Sending a message
await messagesAPI.sendMessage(matchId, content);

// Example: Managing subscription
const status = await subscriptionAPI.getStatus();
```

### Expected Backend Endpoints

Replace `API_BASE_URL` with your backend URL. Endpoints expected:

**Users**
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/photos` - Upload photos

**Discovery**
- `GET /api/profiles` - Get profiles for swiping
- `POST /api/interactions/like` - Like a profile
- `POST /api/interactions/pass` - Pass a profile
- `POST /api/interactions/super-like` - Super like

**Matches & Messages**
- `GET /api/matches` - Get user's matches
- `GET /api/matches/:id` - Get match details
- `DELETE /api/matches/:id` - Unmatch
- `GET /api/messages/:matchId` - Get conversation
- `POST /api/messages/:matchId/send` - Send message

**Likes**
- `GET /api/likes` - Get incoming likes
- `POST /api/likes/:id/respond` - Accept/reject like

**Subscription**
- `GET /api/subscription/status` - Check subscription
- `POST /api/subscription/checkout` - Create checkout
- `POST /api/subscription/cancel` - Cancel subscription

**Auth**
- `POST /api/auth/login` - Login with Telegram
- `POST /api/auth/logout` - Logout
- `DELETE /api/auth/delete-account` - Delete account

**Telegram**
- `POST /api/telegram/init` - Initialize mini-app
- `POST /api/telegram/notify/match` - Send match notification
- `POST /api/telegram/notify/message` - Send message notification

## 🎬 Animations & Interactions

### Smooth Animations
- Card swipe with rotation and scale
- Fade-in/fade-out transitions
- Confetti effect on new matches
- Button hover and click effects
- Modal entrance animations

### Haptic Feedback (Mobile)
- Vibration on swipes
- Vibration on successful actions
- Customizable durations

## 🛠 Development

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Language**: TypeScript

### Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

## 📱 Telegram Mini App Integration

### Initialization
```typescript
import { telegramAPI } from '@/lib/api-services';

// Initialize with Telegram data
const result = await telegramAPI.initializeMiniApp(initData);
```

### Notifications
```typescript
// Notify on new match
await telegramAPI.notifyMatch(matchId);

// Notify on new message
await telegramAPI.notifyMessage(matchId);
```

## 🔐 Security & Privacy

- No sensitive data in localStorage
- HTTPS only for API calls
- CORS protection
- Input validation and sanitization
- Privacy-focused design
- GDPR-ready settings

## 📊 Performance

- Optimized images with Next.js Image component
- Code splitting per page
- CSS-in-JS for minimal bundle
- Lazy loading of components
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

- 📧 Email: support@heartmatch.app
- 💬 Chat: In-app support
- 📚 Docs: Full API documentation available

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect your repository to Vercel
vercel

# Deploy
vercel --prod
```

### Deploy to Other Platforms

Set the build command:
```bash
npm run build
```

Start command:
```bash
npm run start
```

## 🔄 Next Steps - Backend Integration

1. Set up Node.js/Express backend with Prisma ORM
2. Implement database schema (Users, Profiles, Matches, Messages, etc.)
3. Create API endpoints matching the service layer
4. Implement Telegram Bot integration
5. Set up payment processing (Stripe)
6. Deploy backend and connect frontend

## 📝 Notes

- Replace mock data with real API calls
- Configure Stripe/payment gateway
- Set up email service for notifications
- Implement real-time messaging with WebSocket
- Add image compression and CDN
- Set up analytics and monitoring

---

**Made with ❤️ for meaningful connections**
