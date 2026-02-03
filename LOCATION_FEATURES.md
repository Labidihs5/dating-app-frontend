# Location & Distance Features Documentation

## Overview
Complete implementation of location-based matching and distance filtering for the HeartMatch dating app. Features include GPS location tracking, city/country selection, distance-based filtering, and privacy controls.

---

## 🎯 Core Features

### 1. **Location Setup on Profile Creation**
- **Step 4 of Profile Creation**: Users choose one of three location options during profile setup
- **Three Options**:
  1. **📍 Share Exact GPS Location**: Uses device GPS for precise coordinates
  2. **🌍 Choose City/Country**: Manual selection for approximate location
  3. **⏭ Skip for Now**: Add location later in settings

#### Files Involved:
- `/components/location/LocationSetup.tsx` - Main component
- `/app/profile/page.tsx` - Integration in profile form (Step 4)
- `/hooks/useLocation.ts` - Geolocation hook

#### Key Features:
- Real-time GPS detection with error handling
- Reverse geocoding using OpenStreetMap Nominatim API
- Privacy-first approach
- localStorage persistence
- Mobile-friendly UI

---

### 2. **Distance Slider for Search**
- **Location**: Discovery page (Swipe page) and Settings
- **Free vs Premium**:
  - **FREE**: Max 100 km distance, approximate distances
  - **GOLD**: Max 200 km distance, exact distances

#### Files Involved:
- `/components/location/DistanceSlider.tsx` - Interactive slider
- `/app/page.tsx` - Integration in swipe/discovery page
- `/app/settings/page.tsx` - Distance settings integration

#### Features:
- Real-time slider from 5-200km
- Visual feedback showing nearby profile count
- Quick presets (5km, 25km, 50km, 100km)
- Status indicators for FREE vs GOLD
- Responsive design

---

### 3. **Distance Display on Profile Cards**
- **Component**: `DistanceBadge` 
- **Displays**:
  - Exact distance (GOLD) or approximate (FREE)
  - Distance category color coding
  - "Close to You" indicators
  - "Top Match" badges for high compatibility

#### Distance Categories:
- 🟢 Very Close: < 5 km
- 🔵 Close: 5-25 km  
- 🟡 Nearby: 25-50 km
- 🔴 Moderate: 50-100 km
- ⚪ Far: > 100 km

#### Files Involved:
- `/components/location/DistanceBadge.tsx` - Badge component
- `/components/cards/ProfileCard.tsx` - Integration

---

### 4. **Distance Filtering System**
- **Algorithm**: Haversine formula for accurate distance calculation
- **Location**: Swipe/Discovery page with collapsible filter panel

#### Features:
- Filter profiles in real-time by distance radius
- Shows count of profiles within radius
- Persists user selection
- Mobile-optimized filter interface

#### Files Involved:
- `/hooks/useDistanceFilter.ts` - Filtering logic
- `/app/page.tsx` - Filter integration
- `/lib/api-services.ts` - Backend API calls

---

## 🔒 Privacy Features

### Location Privacy Settings
**Location**: Settings page → "Location & Discovery" section

#### Options:
1. **Location Sharing**:
   - Exact Location: Full GPS coordinates
   - Approximate (City): City-level only
   - Disabled: No location sharing

2. **Hide Exact Location Toggle**:
   - FREE: Always approximated
   - GOLD: Can choose exact or approximate

#### Implementation:
- `/app/settings/page.tsx` - Settings UI
- `/hooks/useLocation.ts` - Privacy management
- `/lib/api-services.ts` - API endpoints

---

## 📱 Responsive Design

### Mobile Optimization:
- Touch-friendly sliders
- Collapsible filter panels
- Bottom sheet for location picker
- Swipe-friendly distance badges

### Desktop Enhancement:
- Side panel filters
- Large preview cards
- Detailed location information
- Keyboard controls

---

## 🎨 UI Components

### New Components Created:
1. **`LocationSetup.tsx`**
   - 3-option location picker
   - GPS permission handling
   - Error messages
   - Loading states

2. **`DistanceSlider.tsx`**
   - Range input with custom styling
   - Profile count display
   - Premium feature indicators
   - Quick presets

3. **`DistanceBadge.tsx`**
   - Color-coded distance display
   - Category labels
   - Premium/Free indicators
   - Top match badges

---

## 🔧 Hooks & Utilities

### `useLocation.ts`
**Purpose**: Manage user location and distance calculations

**Methods**:
```typescript
interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  distanceTo: (lat: number, lon: number) => number;
}
```

**Features**:
- Geolocation API wrapper
- localStorage persistence
- Haversine distance formula
- Error handling

### `useDistanceFilter.ts`
**Purpose**: Filter and sort profiles by distance

**Methods**:
```typescript
interface UseDistanceFilterReturn {
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  filteredProfiles: ProfileWithDistance[];
  totalProfiles: number;
  filterProfiles: (profiles: Array, distance: number) => Array;
}
```

---

## 🌐 API Integration

### Location Services (`/lib/api-services.ts`)

#### Endpoints:
```typescript
// Update user location
locationAPI.updateLocation(userId, locationData)

// Get user location
locationAPI.getLocation(userId)

// Toggle location privacy
locationAPI.toggleHideExactLocation(userId, hide)

// Search profiles by distance
locationAPI.searchByDistance(lat, lon, maxDistance, filters)

// Geocode city/country to coordinates
locationAPI.geocodeCity(city, country?)
```

---

## 🗂️ Type Definitions

### Updated in `/lib/types.ts`:

```typescript
interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  accuracy?: number;
  hideExactLocation?: boolean;
  lastUpdated?: Date;
}

interface DistanceInfo {
  distance: number;
  isExact: boolean;
  displayDistance: string;
  distanceCategory: 'very_close' | 'close' | 'nearby' | 'moderate' | 'far';
}
```

---

## 🎯 FREE vs GOLD Comparison

| Feature | FREE | GOLD |
|---------|------|------|
| **Location Setup** | ✅ | ✅ |
| **Distance Slider Max** | 100 km | 200 km |
| **Distance Display** | Approximate | Exact |
| **Search Radius** | Limited | Unlimited |
| **Privacy Controls** | Basic | Advanced |
| **"Nearby" Badge** | ❌ | ✅ |
| **Exact Location Display** | Hidden | Visible |

---

## 📡 Backend Integration Checklist

When implementing backend:

- [ ] Create `Location` table/model
  - `id`, `userId`, `latitude`, `longitude`, `address`, `city`, `country`, `accuracy`, `hideExactLocation`, `lastUpdated`

- [ ] Create location endpoints:
  - `PUT /users/:id/location` - Update location
  - `GET /users/:id/location` - Get location
  - `PUT /users/:id/location/privacy` - Toggle privacy
  - `GET /profiles/nearby` - Search by distance

- [ ] Implement distance calculation:
  - Haversine formula in backend
  - Cache results for performance
  - Index on lat/lon for queries

- [ ] Add privacy rules:
  - Hide exact location for FREE users
  - Apply hideExactLocation toggle
  - Validate distance limits per subscription

- [ ] Geocoding service:
  - Integrate OpenStreetMap Nominatim or Google Maps API
  - Cache geocoding results
  - Handle rate limiting

---

## 🧪 Testing Scenarios

### Scenario 1: GPS Location Setup
- User selects "Share GPS Location"
- Device permission granted/denied
- Location successfully retrieved
- Coordinates stored in localStorage

### Scenario 2: Manual Location
- User selects "Choose City"
- Enters "Paris, France"
- Location confirmed
- Stored as approximate location

### Scenario 3: Distance Filtering
- User opens filter
- Adjusts slider to 25 km
- Profiles filtered in real-time
- "5 profiles nearby" updates

### Scenario 4: Premium Distance
- FREE user: max 100 km, approximate distances
- Upgrade to GOLD: max 200 km, exact distances
- Switch back to FREE: distances approximate again

### Scenario 5: Privacy Toggle
- User enables "Hide Exact Location"
- Distance shown as "~25 km" instead of "24.3 km"
- Other users see approximate location only

---

## 🚀 Performance Optimization

### Frontend:
- Memoize distance calculations
- Debounce slider changes
- Lazy load location components
- Cache location data locally

### Backend (When Implemented):
- Geospatial indexes (GiST, BRIN)
- Distance query optimization
- Caching frequently accessed locations
- Batch geocoding requests

---

## 🛠️ Troubleshooting

### GPS Not Working
- Check browser permissions
- Ensure HTTPS connection (required for geolocation)
- Verify device has GPS enabled
- Check Nominatim API availability

### Slider Not Updating
- Ensure maxDistance state is connected
- Check onChange callback
- Verify filtered profiles array is updating
- Look for debouncing issues

### Distance Mismatch
- Verify coordinates are correct
- Check Haversine formula calculation
- Compare with mapping service (Google Maps, etc.)
- Account for Earth radius in km (6371 km)

---

## 📚 External Resources

- **Haversine Formula**: https://en.wikipedia.org/wiki/Haversine_formula
- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **OpenStreetMap Nominatim**: https://nominatim.org/
- **Tailwind CSS Sliders**: https://tailwindcss.com/docs/customize-forms

---

## 🔄 Future Enhancements

- [ ] Real-time location updates (background)
- [ ] Location history & timeline view
- [ ] Geofencing for meeting spots
- [ ] Public transit time calculations
- [ ] Weather integration at user location
- [ ] Location-based events/meetups
- [ ] Privacy-preserving heatmaps
- [ ] Offline location caching
