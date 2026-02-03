# Location & Swipe Features Integration Guide

## 🚀 Quick Start

This guide explains how all the location and swipe features work together in the HeartMatch dating app.

---

## 📋 Complete Feature List

### ✅ Implemented Features

#### Location Features:
- [x] GPS location capture during profile creation
- [x] City/Country manual selection
- [x] Distance slider for search filtering (5-200km)
- [x] Distance badge display on profile cards
- [x] Location privacy settings
- [x] FREE vs GOLD distance limits
- [x] Haversine distance calculation
- [x] localStorage persistence
- [x] OpenStreetMap reverse geocoding
- [x] Responsive mobile design

#### Swipe Features:
- [x] Desktop mouse drag & drop
- [x] Right swipe = Like
- [x] Left swipe = Dislike
- [x] Super Like button
- [x] Swipe animations (rotation, scale)
- [x] Distance filtering on discovery
- [x] Daily swipe limits (FREE)
- [x] Button action handlers
- [x] Threshold-based direction detection
- [x] Profile card animations

---

## 🎯 User Journey

### Step 1: Profile Creation
```
User Opens App
  ↓
Profile Creation Form (4 Steps)
  Step 1: Basic Info (Name, Age, Gender, Bio)
  Step 2: Relationship Type & Photos
  Step 3: Preferences (Age, Gender, Interests)
  Step 4: Location Setup ⭐ NEW
    • GPS Permission → Exact Location
    • Manual Entry → City/Country
    • Skip → Add Later
  Step 5: Review & Confirm
  ↓
Profile Created!
```

**File**: `/app/profile/page.tsx`

### Step 2: Swipe/Discovery
```
User Navigates to Discover Page
  ↓
Distance Filter Panel (Optional) ⭐ NEW
  • Slider: 5-200km
  • Shows: Profile count nearby
  • FREE: Max 100km, approximate
  • GOLD: Max 200km, exact
  ↓
Profile Cards Stack
  • Card 1: Emma, 26, 3km away
  • Card 2: Sophie, 24, 5km away
  • Card 3: Laura, 28, 8km away
  ↓
User Swipes
  • Drag Right / Click Like → LIKE ❤️
  • Drag Left / Click Pass → DISLIKE ✕
  • Click Super Like → ⚡ (Premium)
  ↓
Swipe Recorded
  • FREE: -1 swipe (Max 20/day)
  • GOLD: Unlimited
  ↓
Next Profile Loads
  ↓
Repeat
```

**Files**: 
- `/app/page.tsx` - Main swipe page
- `/components/cards/SwipeCard.tsx` - Card swipe component
- `/components/location/DistanceSlider.tsx` - Filter slider

### Step 3: Location Settings
```
User Opens Settings
  ↓
Location & Discovery Section ⭐ NEW
  • Location Sharing
    - Exact Location
    - Approximate (City)
    - Disabled
  • Hide Exact Location Toggle
  ↓
Changes Apply Immediately
```

**File**: `/app/settings/page.tsx`

---

## 🔄 Data Flow

### Location Data Flow:
```
GPS Location
   ↓
useLocation Hook
   ↓
Reverse Geocoding (Nominatim)
   ↓
LocationData Object
{
  latitude: 48.8566,
  longitude: 2.3522,
  address: "Paris, France",
  city: "Paris",
  country: "France"
}
   ↓
localStorage ("userLocation")
   ↓
API: locationAPI.updateLocation()
```

### Swipe & Distance Flow:
```
User Swipes Card
   ↓
SwipeCard Component
   ├─ Mouse/Touch Events
   ├─ Calculate dragX
   └─ Detect Direction
   ↓
Threshold Check (30% width)
   ├─ dragX > threshold → LIKE
   └─ dragX < -threshold → DISLIKE
   ↓
Handler Called
   ├─ Check swipe limit (FREE)
   ├─ Decrement counter
   └─ Move to next profile
   ↓
Distance Filter Applied
   ├─ Filter by maxDistance
   └─ Show nearby count
   ↓
API: discoveryAPI.like() / discoveryAPI.pass()
```

---

## 🧩 Component Architecture

### Location Components:
```
components/location/
├── LocationSetup.tsx
│   └─ GPS + Manual setup UI
├── DistanceSlider.tsx
│   └─ Distance filter control
└── DistanceBadge.tsx
    └─ Distance display on cards
```

### Swipe Components:
```
components/cards/
├── SwipeCard.tsx
│   └─ Drag/swipe detection
└── ProfileCard.tsx
    └─ Card display + DistanceBadge
```

### Pages:
```
app/
├── profile/page.tsx
│   └─ Includes LocationSetup (Step 4)
├── page.tsx (Swipe)
│   └─ Includes DistanceSlider, SwipeCard
└── settings/page.tsx
    └─ Location privacy controls
```

---

## 🎨 Styling & Theme

### Color System:
```css
--primary: #8B4BD9 (Purple)    /* Primary actions */
--accent: #FF6B35 (Orange)     /* Likes, highlights */
--secondary: #7845D7 (Purple)  /* Secondary actions */
--success: #10B981 (Green)     /* Close profiles */
--destructive: #EF4444 (Red)   /* Dislikes */
```

### Distance Colors:
- 🟢 < 5km (success): Green
- 🔵 5-25km (primary): Purple  
- 🟡 25-50km (secondary): Dark Purple
- 🔴 50-100km (warning): Orange
- ⚪ > 100km (muted): Gray

---

## 🔐 Privacy & Security

### Free vs Gold:
```
FREE User:
├─ Distance: Approximate (±5km)
├─ Max Radius: 100km
├─ Location: City-level
└─ Max Swipes: 20/day

GOLD User:
├─ Distance: Exact
├─ Max Radius: 200km
├─ Location: Precise (if shared)
└─ Max Swipes: Unlimited
```

### Privacy Controls:
```
Location Sharing Options:
├─ Exact: Full GPS coordinates
├─ Approximate: City/Country only
└─ Disabled: No location info

Hide Exact Location:
├─ FREE: Always approximated
└─ GOLD: User choice
```

---

## 📱 Responsive Breakpoints

### Mobile (<640px):
- Full-width cards
- Bottom sheet filters
- Touch-friendly buttons (48px min)
- Stacked layout

### Tablet (640px-1024px):
- Wider cards
- Side panel filters
- Optimized spacing

### Desktop (>1024px):
- Max-width containers
- Side-by-side layouts
- Keyboard shortcuts available

---

## 🔌 Backend Integration Checklist

### When Implementing Backend:

#### 1. Location Endpoints:
```
PUT /users/:userId/location
  ├─ Request: { latitude, longitude, city, country, hideExactLocation }
  └─ Response: { success, location }

GET /users/:userId/location
  ├─ Request: (none)
  └─ Response: { location: LocationData }

PUT /users/:userId/location/privacy
  ├─ Request: { hideExactLocation: boolean }
  └─ Response: { success }

GET /profiles/nearby
  ├─ Query: { latitude, longitude, maxDistance, filters }
  └─ Response: { profiles: Profile[], count: number }
```

#### 2. Interaction Endpoints:
```
POST /interactions/like
  ├─ Request: { targetProfileId }
  └─ Response: { success, isMatch: boolean, match?: Match }

POST /interactions/pass
  ├─ Request: { targetProfileId }
  └─ Response: { success }

POST /interactions/super-like
  ├─ Request: { targetProfileId }
  └─ Response: { success, isMatch: boolean, match?: Match }
```

#### 3. Database Models:
```typescript
// Location Table
{
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  accuracy?: number;
  hideExactLocation: boolean;
  lastUpdated: Date;
}

// Interaction Table
{
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'pass' | 'super_like';
  createdAt: Date;
}
```

---

## 🧪 Testing Scenarios

### Test Case 1: Profile Creation with Location
```
1. Navigate to /profile
2. Fill Step 1: Basic Info
3. Fill Step 2: Relationship Type & Photos
4. Fill Step 3: Preferences
5. Step 4: Select "Share GPS Location"
6. Grant permission
7. Verify location populated
8. Step 5: Review & Create
9. Verify profile created with location
```

### Test Case 2: Swipe with Distance Filter
```
1. Navigate to / (Swipe page)
2. Click "Filter" button
3. Adjust distance slider to 25km
4. Verify profiles update
5. Check profile count changes
6. Drag card right (Like)
7. Verify next profile loads
8. Drag card left (Dislike)
9. Verify counter updates (FREE)
```

### Test Case 3: Location Privacy
```
1. Navigate to /settings
2. Scroll to "Location & Discovery"
3. Change "Location Sharing" to "Approximate"
4. Toggle "Hide Exact Location"
5. Save settings
6. Navigate to /profile
7. Verify distance shown as "~25km" not "24.3km"
```

### Test Case 4: Premium Features
```
FREE User:
1. Navigate to /gold
2. See "Unlimited Swipes" feature
3. Swipe 20 times
4. Modal: "Daily Limit Reached"
5. Click "Upgrade to GOLD"

GOLD User:
1. Verify slider max 200km (not 100km)
2. Verify distances exact (not approximate)
3. Unlimited swipes
4. No daily limit modal
```

---

## 🐛 Common Issues & Solutions

### Issue: GPS Not Working
```
Cause: Browser permissions, HTTPS required, Geolocation disabled
Solution:
  • Check browser console for errors
  • Ensure HTTPS connection
  • Check device location services enabled
  • Verify Nominatim API accessible
```

### Issue: Swipe Not Registering
```
Cause: Threshold not met, handlers not connected, state not updating
Solution:
  • Verify dragX > threshold (30% of width)
  • Check onSwipeLeft/onSwipeRight connected
  • Verify currentIndex updating
  • Check browser console for errors
```

### Issue: Distance Always Shows "Approximate"
```
Cause: hideExactLocation flag true, user is FREE, API returning approximate
Solution:
  • Check hideExactLocation setting in settings
  • Verify user subscription status
  • Check API response format
  • Verify backend returning exact for GOLD
```

### Issue: Slider Not Filtering Profiles
```
Cause: Filter logic not applied, profiles state not updating
Solution:
  • Verify maxDistance state changes
  • Check filteredProfiles calculation
  • Verify SwipeCard receiving filtered profile
  • Check distance field in mock data
```

---

## 📊 Performance Tips

### Frontend Optimization:
```typescript
// Memoize expensive calculations
const filteredProfiles = useMemo(() => {
  return profiles.filter(p => p.distance <= maxDistance);
}, [profiles, maxDistance]);

// Debounce slider changes
const handleDistanceChange = useCallback(
  debounce((distance) => {
    setMaxDistance(distance);
  }, 300),
  []
);

// Lazy load location components
const LocationSetup = lazy(() => import('@/components/location/LocationSetup'));
```

### Backend Optimization:
```
• Geospatial indexes on lat/lon
• Cache geocoding results
• Pagination for large result sets
• Query optimization for distance calculations
• CDN for static distance data
```

---

## 🎓 Learning Resources

### Files to Study:
1. **Location Features**:
   - `/components/location/LocationSetup.tsx` - GPS setup
   - `/hooks/useLocation.ts` - Geolocation logic
   - `/LOCATION_FEATURES.md` - Detailed docs

2. **Swipe Mechanics**:
   - `/components/cards/SwipeCard.tsx` - Drag detection
   - `/app/page.tsx` - Swipe state management
   - `/SWIPE_MECHANICS.md` - Detailed docs

3. **Integration**:
   - `/lib/api-services.ts` - API layer
   - `/lib/types.ts` - Type definitions
   - `/hooks/useDistanceFilter.ts` - Filter logic

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify geolocation permissions
- [ ] Test swipe animations
- [ ] Verify distance calculations
- [ ] Check API endpoints ready
- [ ] Test free/gold switching
- [ ] Verify localStorage persistence
- [ ] Test offline fallbacks
- [ ] Performance audit (Lighthouse)
- [ ] Security audit (CORS, permissions)
- [ ] Analytics tracking setup

---

## 🚀 Next Steps

1. **Backend Development**:
   - Implement location endpoints
   - Create database models
   - Add geospatial queries

2. **Enhanced Features**:
   - Touch swipe support
   - Keyboard controls
   - Swipe analytics
   - Location history

3. **Optimization**:
   - Image lazy loading
   - Swipe animation tuning
   - API response caching
   - Database query optimization

4. **Testing**:
   - Unit tests for distance calculation
   - Integration tests for swipe flow
   - E2E tests for user journey
   - Performance testing

---

## 📞 Support

For issues or questions:
1. Check `/LOCATION_FEATURES.md` for location details
2. Check `/SWIPE_MECHANICS.md` for swipe details
3. Review console logs for errors
4. Check browser permissions
5. Verify API endpoints
