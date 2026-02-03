# Swipe Mechanics - Like/Dislike Implementation Guide

## 🎯 Overview
Complete swipe card implementation with mouse/touch drag support, right-swipe (Like) and left-swipe (Dislike) mechanics, animations, and visual feedback.

---

## 🖐️ Current Implementation

### Swipe Card Component (`/components/cards/SwipeCard.tsx`)

**Current Features**:
- Desktop mouse drag & drop
- Transform-based animations
- Drag threshold detection (30% of card width)
- Real-time rotation during drag
- Three action buttons: Pass (X), Super Like (⚡), Like (❤️)

**File Structure**:
```typescript
export function SwipeCard({
  profile: Profile,
  onSwipeLeft: () => void,      // Dislike action
  onSwipeRight: () => void,     // Like action
  onSuperLike: () => void,      // Super like action
  isLoading?: boolean,
})
```

---

## 🎮 Swipe Gesture Support

### Current: Desktop Mouse Support
```javascript
handleMouseDown()      // Drag starts
handleMouseMove()      // Track cursor position
handleMouseUp()        // Detect swipe direction
  ↓ dragX > threshold (30%)
  ├── onSwipeRight()  (LIKE - Right swipe)
  └── dragX < -threshold
      └── onSwipeLeft()  (DISLIKE - Left swipe)
```

### Threshold Logic:
```javascript
const threshold = rect.width * 0.3;  // 30% of card width
if (dragX > threshold) {
  // Right swipe → LIKE
  onSwipeRight();
} else if (dragX < -threshold) {
  // Left swipe → DISLIKE
  onSwipeLeft();
}
```

---

## 📱 Touch Support (To Be Implemented)

### Add Touch Events:
```typescript
const handleTouchStart = (e: React.TouchEvent) => {
  setIsDragging(true);
  const touch = e.touches[0];
  setStartX(touch.clientX);
  setStartY(touch.clientY);
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const x = touch.clientX - startX;
  const y = touch.clientY - startY;
  
  setDragX(x);
  setDragY(y);
  setRotation((x / containerWidth) * 10);
};

const handleTouchEnd = (e: React.TouchEvent) => {
  setIsDragging(false);
  detectSwipeDirection(); // Same threshold logic
};
```

### Add to JSX:
```jsx
<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  // ... existing handlers
>
```

---

## 🎨 Animation States

### Card Transform States:
```css
/* Idle State */
transform: translateX(0) translateY(0) rotate(0deg) scale(1);

/* Dragging State */
transform: translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg) scale(0.95);

/* Like Direction (Right) */
transform: translateX(500px) rotate(20deg) scale(0.95);
opacity: 0.7;

/* Dislike Direction (Left) */
transform: translateX(-500px) rotate(-20deg) scale(0.95);
opacity: 0.7;
```

### Velocity-Based Exit Animation:
```javascript
// Calculate swipe velocity
const velocity = Math.abs(dragX) / dragDuration;

if (velocity > MIN_VELOCITY) {
  // Fast swipe - quick exit
  exitDuration = 300;
} else {
  // Slow swipe - longer animation
  exitDuration = 500;
}
```

---

## 🎯 Action Buttons

### Current Button Layout:
```
    [⚡ Super Like]
[X Pass]         [❤️ Like]
```

### Button Properties:
- **Pass (X)**: Destructive - Left aligned
  - Color: outline with hover destructive
  - Icon: X (lucide-react)
  - Size: 64px (w-16 h-16)

- **Super Like (⚡)**: Primary
  - Color: Primary with hover
  - Icon: Zap (lucide-react)
  - Size: 64px (w-16 h-16)

- **Like (❤️)**: Accent
  - Color: Accent with hover
  - Icon: Heart (lucide-react)
  - Size: 64px (w-16 h-16)

---

## 📊 Swipe Tracking State Management

### Current Page State (`/app/page.tsx`):
```typescript
const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
const [currentIndex, setCurrentIndex] = useState(0);
const [swipesLeft, setSwipesLeft] = useState(20);
const [isPremium, setIsPremium] = useState(false);
const [maxDistance, setMaxDistance] = useState(50);
```

### Swipe Handlers:
```typescript
const handleSwipeLeft = () => {
  // Dislike action
  if (!isPremium && swipesLeft <= 0) {
    setShowSwipeLimitModal(true);
    return;
  }
  
  if (!isPremium) {
    setSwipesLeft(swipesLeft - 1);  // Decrement free swipes
  }
  
  // Move to next profile
  if (currentIndex < filteredProfiles.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};

const handleSwipeRight = () => {
  // Like action
  if (!isPremium && swipesLeft <= 0) {
    setShowSwipeLimitModal(true);
    return;
  }
  
  if (!isPremium) {
    setSwipesLeft(swipesLeft - 1);
  }
  
  // Move to next profile
  if (currentIndex < filteredProfiles.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};

const handleSuperLike = () => {
  // Super like costs 2 swipes
  if (!isPremium && swipesLeft <= 2) {
    setShowSwipeLimitModal(true);
    return;
  }
  
  if (!isPremium) {
    setSwipesLeft(swipesLeft - 2);
  }
  
  // Move to next profile
  if (currentIndex < filteredProfiles.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};
```

---

## 📱 Profile Card Transformations

### During Drag (Active):
```
Left Swipe (Dislike):        Right Swipe (Like):
- dragX < 0                  - dragX > 0
- Rotate: -10 to 0°          - Rotate: 0 to +10°
- Scale: 0.95 → 0.9          - Scale: 0.95 → 0.9
- Opacity: 1 → 0.8           - Opacity: 1 → 0.8

Visual Feedback:
- Background dims slightly
- Text becomes less visible
- "DISLIKE" label appears    - "LIKE" label appears
```

---

## 🎬 Animation Sequences

### Sequence 1: Right Swipe (Like)
```
1. User drags right (dragX > 0)
   └─ Card rotates +10deg, scales 0.95
2. User releases (dragX > threshold)
   └─ Card animates: translateX(500px) rotate(20deg)
3. Card exits, onSwipeRight() triggered
   └─ Profile removed from stack
4. Next card animates in from bottom
   └─ New profile loads with fade-in
```

### Sequence 2: Left Swipe (Dislike)
```
1. User drags left (dragX < 0)
   └─ Card rotates -10deg, scales 0.95
2. User releases (dragX < -threshold)
   └─ Card animates: translateX(-500px) rotate(-20deg)
3. Card exits, onSwipeLeft() triggered
   └─ Profile removed from stack
4. Next card animates in from bottom
   └─ New profile loads with fade-in
```

### Sequence 3: Super Like
```
1. User clicks Super Like button
   └─ Card plays special animation
2. Particle effects appear (optional)
   └─ Confetti/stars
3. Card exits with special transform
   └─ Scale-up animation
4. Next card loads
```

---

## 🧠 State Flow

```
User Interaction
   ↓
handleMouseDown() / handleTouchStart()
   ↓
isDragging = true
   ↓
handleMouseMove() / handleTouchMove()
   ├─ Update dragX, dragY, rotation
   └─ Update visual feedback
   ↓
handleMouseUp() / handleTouchEnd()
   ├─ Calculate threshold
   ├─ Determine swipe direction
   └─ Call appropriate handler
   ↓
handleSwipeLeft() / handleSwipeRight()
   ├─ Check swipe limit (FREE)
   ├─ Decrement swipes counter (FREE)
   ├─ Trigger API call (backend)
   └─ Update currentIndex
   ↓
ProfileCard updates
   ↓
Repeat
```

---

## 🔄 Backend Integration Points

### When Backend is Ready:

1. **Record Like/Dislike**:
```typescript
const handleSwipeRight = async () => {
  // ... existing logic
  
  try {
    await discoveryAPI.like(currentProfile.id);
    // Check for match
    const response = await discoveryAPI.like(currentProfile.id);
    if (response.isMatch) {
      showMatchNotification(response.match);
    }
  } catch (error) {
    console.error('Error recording like:', error);
  }
};
```

2. **Track Swipes for Daily Limit**:
```typescript
const [swipeHistory, setSwipeHistory] = useState<{
  date: string;
  count: number;
}[]>([]);

const handleSwipeLeft = async () => {
  // ... existing logic
  
  // Record swipe
  const today = new Date().toDateString();
  const todaySwipes = swipeHistory.find(s => s.date === today);
  
  if (todaySwipes) {
    todaySwipes.count += 1;
  } else {
    setSwipeHistory([...swipeHistory, { date: today, count: 1 }]);
  }
};
```

3. **API Endpoints Needed**:
```
POST /interactions/like
POST /interactions/pass
POST /interactions/super-like
GET /interactions/daily-limit
```

---

## 🎨 Visual Feedback Enhancements

### Add Swipe Labels:
```jsx
{isDragging && dragX > threshold * 0.5 && (
  <div className="absolute inset-0 flex items-center justify-end p-4 pointer-events-none">
    <span className="text-4xl font-bold text-success opacity-75">LIKE</span>
  </div>
)}

{isDragging && dragX < -threshold * 0.5 && (
  <div className="absolute inset-0 flex items-center justify-start p-4 pointer-events-none">
    <span className="text-4xl font-bold text-destructive opacity-75">DISLIKE</span>
  </div>
)}
```

### Add Haptic Feedback (Mobile):
```typescript
const handleSwipeComplete = () => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(50);  // 50ms vibration
  }
};
```

---

## 🧪 Testing the Swipe System

### Manual Tests:
1. **Desktop Mouse Drag**:
   - Drag right → Card rotates, like triggered
   - Drag left → Card rotates opposite, dislike triggered
   - Drag partial → Card returns to center

2. **Mobile Touch**:
   - Swipe right finger → Like
   - Swipe left finger → Dislike
   - Quick swipe vs slow drag

3. **Button Clicks**:
   - Click Like button → Same as right swipe
   - Click Pass button → Same as left swipe
   - Click Super Like → Special animation

4. **Swipe Limit (FREE)**:
   - 20 swipes per day
   - After limit → Modal appears
   - Premium unlimited → No modal

---

## 📊 Metrics to Track

### Analytics to Implement:
```typescript
interface SwipeMetrics {
  userId: string;
  date: string;
  totalSwipes: number;
  likes: number;
  dislikes: number;
  superLikes: number;
  avgSwipeTime: number;
  topInterests: string[];
}
```

---

## 🚀 Future Enhancements

- [ ] Swipe velocity detection (fast vs slow)
- [ ] Animated card deck (stack cards)
- [ ] Undo last swipe (GOLD feature)
- [ ] Swipe history view
- [ ] Keyboard controls (← →)
- [ ] Gesture recognition (Android)
- [ ] Custom swipe animations
- [ ] Sound effects toggle
- [ ] Haptic feedback settings
- [ ] Swipe statistics dashboard
