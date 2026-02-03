# 🔧 Guide Complet - Correction du Swipe Tactile

## 📋 Problème Identifié

Le composant `SwipeCard.tsx` original utilisait uniquement les événements **mouse** (`onMouseDown`, `onMouseMove`, `onMouseUp`), ce qui ne fonctionne **PAS sur les appareils tactiles** (smartphones, tablettes).

### Événements Manquants:
- ❌ `onTouchStart` - Début du toucher
- ❌ `onTouchMove` - Mouvement du doigt
- ❌ `onTouchEnd` - Fin du toucher
- ❌ `onTouchCancel` - Annulation du toucher

---

## ✅ Solutions Implémentées

### 1️⃣ **SwipeCard.tsx Corrigé** (Version basique)

**Changements clés:**
- Ajout d'une fonction `getPosition()` qui détecte automatiquement les événements **mouse** OU **touch**
- Ajout des gestionnaires d'événements tactiles: `onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`
- Amélioration de la détection du seuil (30% de la largeur)
- Ajout de `console.log()` pour déboguer

**Utilisation:**
```tsx
// Utilisez l'ancien SwipeCard.tsx - il fonctionne maintenant sur tactile
<SwipeCard
  profile={currentProfile}
  onSwipeLeft={() => console.log('Left')}
  onSwipeRight={() => console.log('Right')}
  onSuperLike={() => console.log('Super Like')}
/>
```

---

### 2️⃣ **useSwipeGesture.ts Hook** (Réutilisable et robuste)

Un hook personnalisé moderne qui gère:
- ✅ Événements mouse ET tactiles
- ✅ Détection de vélocité (vitesse du swipe)
- ✅ Calcul de rotation progressive (max ±15°)
- ✅ Calcul d'opacité (fade out pendant swipe)
- ✅ Calcul d'échelle (scale pendant swipe)
- ✅ Logs détaillés pour déboguer

**Utilisation:**
```tsx
const { state, handlers } = useSwipeGesture({
  threshold: 50, // pixels avant de déclencher
  velocityThreshold: 0.3, // vélocité minimale
  onSwipeLeft: () => console.log('Left swipe'),
  onSwipeRight: () => console.log('Right swipe'),
});

// Puis utiliser les handlers:
<div
  onTouchStart={(e) => handlers.handleStart(e, rect)}
  onTouchMove={(e) => handlers.handleMove(e, rect)}
  onTouchEnd={(e) => handlers.handleEnd(e, rect)}
>
  {/* contenu */}
</div>
```

---

### 3️⃣ **SwipeCardV2.tsx** (Version premium avec feedback visuel)

Une version améliorée qui inclut:
- ✅ Indicateurs visuels "Like!" et "Nope!" pendant le swipe
- ✅ Utilise le hook `useSwipeGesture`
- ✅ Meilleure animation avec cubic-bezier
- ✅ Support complet tactile + mouse
- ✅ Instructions mobiles visibles
- ✅ Logs de débogue intégrés

**Utilisation:**
```tsx
// Remplacez SwipeCard par SwipeCardV2
<SwipeCardV2
  profile={currentProfile}
  onSwipeLeft={handleSwipeLeft}
  onSwipeRight={handleSwipeRight}
  onSuperLike={handleSuperLike}
  isLoading={isLoading}
/>
```

---

## 🚀 Comment Utiliser

### **Option 1: Utiliser la version corrigée (SwipeCard.tsx)**

Le fichier `/components/cards/SwipeCard.tsx` a été corrigé et inclut maintenant:
- Support tactile automatique
- Détection intelligente mouse/touch
- Meilleure rotation et animation

✅ **Aucun changement requis** - utilisez-le tel quel dans `page.tsx`

---

### **Option 2: Utiliser SwipeCardV2 (Recommandé pour mobile)**

SwipeCardV2 offre une meilleure UX avec indicateurs visuels:

```tsx
// Dans /app/page.tsx
import { SwipeCardV2 } from '@/components/cards/SwipeCardV2';

// Remplacer:
// <SwipeCard ... />
// par:
<SwipeCardV2
  profile={currentProfile}
  onSwipeLeft={handleSwipeLeft}
  onSwipeRight={handleSwipeRight}
  onSuperLike={handleSuperLike}
  isLoading={isLoading}
/>
```

---

### **Option 3: Utiliser useSwipeGesture Hook**

Pour une intégration personnalisée:

```tsx
'use client';

import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useRef } from 'react';

export function MyCustomComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { state, handlers } = useSwipeGesture({
    threshold: 50,
    velocityThreshold: 0.3,
    onSwipeLeft: () => console.log('Left!'),
    onSwipeRight: () => console.log('Right!'),
  });

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    handlers.handleStart(e, containerRef.current.getBoundingClientRect());
  };

  // Répétez pour handleMove et handleEnd...

  return (
    <div
      ref={containerRef}
      onTouchStart={handleStart}
      onMouseDown={handleStart}
      // ... autres handlers
      style={{
        transform: `translateX(${state.dragX}px) rotate(${state.rotation}deg) scale(${state.scale})`,
        opacity: state.opacity,
      }}
    >
      Contenu ici
    </div>
  );
}
```

---

## 🧪 Test et Déboguge

### Vérifier que le swipe fonctionne:

1. **Sur navigateur desktop:**
   - Ouvrir Chrome DevTools (F12)
   - Aller dans Device Emulation (Ctrl+Shift+M)
   - Choisir un appareil mobile (iPhone, Android)
   - Tester le swipe tactile

2. **Sur téléphone réel:**
   - Ouvrir l'app avec `npm run dev`
   - Accéder à `http://localhost:3000`
   - Tester les swipes left/right

3. **Ouvrir la Console:**
   - Vous verrez les logs `[v0] Swipe left detected` ou `[v0] Swipe right detected`
   - Cela confirme que le swipe a été détecté

### Exemple de logs attendus:
```
[v0] Swipe end - Distance: 150 Velocity: 0.45 DX: 150 DY: -10
[v0] Swipe right triggered
```

---

## 🔍 Paramètres Configurables

### Dans `useSwipeGesture`:

| Paramètre | Type | Par défaut | Description |
|-----------|------|-----------|-------------|
| `threshold` | number | 50 | Pixels à bouger avant de déclencher le swipe |
| `velocityThreshold` | number | 0.5 | Vélocité minimale (pixels/ms) |
| `onSwipeLeft` | function | - | Callback quand swipe gauche |
| `onSwipeRight` | function | - | Callback quand swipe droit |
| `onSwipeUp` | function | - | Callback quand swipe haut |
| `onSwipeDown` | function | - | Callback quand swipe bas |

### Optimiser pour vos besoins:

```tsx
// Plus sensible (moins de pixels requis):
const { state, handlers } = useSwipeGesture({
  threshold: 30, // Réduit de 50 à 30
  velocityThreshold: 0.2,
  onSwipeLeft,
  onSwipeRight,
});

// Moins sensible (plus de pixels requis):
const { state, handlers } = useSwipeGesture({
  threshold: 80, // Augmenté de 50 à 80
  velocityThreshold: 0.7,
  onSwipeLeft,
  onSwipeRight,
});
```

---

## 📱 Bonnes Pratiques Mobile

1. **Ajouter `touch-none`** pour éviter les comportements par défaut du navigateur
2. **Ajouter `select-none`** pour éviter la sélection de texte pendant le drag
3. **Utiliser `pointer-events`** pour éviter les conflits d'événements
4. **Tester sur vrai appareil** - l'émulation n'est pas 100% exacte

```tsx
<div
  className="touch-none select-none"
  style={{ pointerEvents: state.isDragging ? 'auto' : 'auto' }}
  onTouchStart={handleStart}
  // ... etc
/>
```

---

## 📚 Fichiers Modifiés

### ✅ Fichiers Correctifs:

1. **`/components/cards/SwipeCard.tsx`** (✅ Corrigé)
   - Ajout support tactile
   - Amélioration rotation
   - Logs intégrés

2. **`/hooks/useSwipeGesture.ts`** (✨ Nouveau)
   - Hook réutilisable
   - Calcul vélocité
   - Support multi-swipe

3. **`/components/cards/SwipeCardV2.tsx`** (✨ Nouveau)
   - Version premium avec feedback
   - Indicateurs "Like!" et "Nope!"
   - Instructions mobiles

---

## 🐛 Troubleshooting

### Q: Le swipe ne fonctionne toujours pas

**A:** Vérifiez:
1. Ouvrir DevTools Console et vérifier les logs `[v0] Swipe...`
2. Vérifier que `onTouchStart`, `onTouchMove`, `onTouchEnd` sont bindés
3. Vérifier que le conteneur a des dimensions correctes (aspect-ratio)
4. Sur mobile: actualiser la page (F5)

### Q: Le swipe se déclenche mais le profil ne change pas

**A:** 
1. Vérifier que les callbacks `onSwipeLeft` et `onSwipeRight` sont passés correctement
2. Vérifier que `setCurrentIndex` augmente correctement
3. Ajouter un `console.log` dans les callbacks

### Q: La carte bouge bizarrement

**A:**
1. Vérifier que `isDragging` est bien défini
2. Augmenter le `threshold` pour éviter les micro-mouvements
3. Vérifier que le `dragX` et `dragY` sont bien calculés

---

## ✨ Résumé

✅ **SwipeCard.tsx** - Fonctionne maintenant sur tactile  
✅ **useSwipeGesture.ts** - Hook professionnel et réutilisable  
✅ **SwipeCardV2.tsx** - Version premium avec meilleure UX  

Choisissez l'approche qui convient le mieux à vos besoins!
