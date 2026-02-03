# Migration vers PostgreSQL - Notes

## Changements effectués

### 1. Suppression des données mock
Tous les mock data ont été supprimés des fichiers suivants:
- `app/page.tsx` (Discover/Swipe)
- `app/matches/page.tsx` (Matches)
- `app/likes/page.tsx` (Likes)
- `app/chat/page.tsx` (Messages)

### 2. Intégration avec PostgreSQL via Prisma
Toutes les pages utilisent maintenant les vraies API calls vers le backend PostgreSQL:

#### API Endpoints utilisés:
- **Profiles**: `GET /api/profiles?userId={userId}` - Récupère les profils pour le swipe
- **Interactions**: 
  - `POST /api/interactions/like` - Like un profil
  - `POST /api/interactions/pass` - Pass un profil
  - `POST /api/interactions/super-like` - Super like un profil
- **Matches**: `GET /api/matches?userId={userId}` - Récupère les matches de l'utilisateur
- **Likes**: `GET /api/likes?userId={userId}` - Récupère les likes reçus
- **Messages**: 
  - `GET /api/messages/{matchId}` - Récupère la conversation
  - `POST /api/messages/{matchId}/send` - Envoie un message

### 3. Structure des données selon le schéma Prisma

#### User
```typescript
{
  id: string;              // Telegram User ID
  telegramUsername?: string;
  name: string;
  age: number;
  gender: string;
  bio?: string;
  photos: string[];        // Array de URLs
  location?: Json;
  preferences?: Json;
}
```

#### Like
```typescript
{
  id: string;
  senderId: string;
  receiverId: string;
  isSuper: boolean;
  createdAt: string;
  sender?: User;
}
```

#### Match
```typescript
{
  id: string;
  user: User;              // L'autre utilisateur du match
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  createdAt: string;
}
```

#### Message
```typescript
{
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
```

### 4. Composants mis à jour

#### ProfileCard & SwipeCard
- Utilise maintenant `photos: string[]` au lieu de `image: string`
- Affiche `photos[0]` comme image principale
- Suppression des champs mock (`compatibility`, `relationshipType`, etc.)

### 5. Authentification Telegram
Toutes les pages utilisent `getTelegramUser()` pour récupérer l'ID utilisateur Telegram et l'utiliser dans les requêtes API.

## Pour démarrer

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm start
```

Le backend démarre sur `http://localhost:3001`

### Frontend
```bash
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

### Variables d'environnement

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dating_app"
PORT=3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Points importants

1. **Pas de fallback mock**: L'application nécessite maintenant un backend fonctionnel
2. **Telegram requis**: L'authentification Telegram est obligatoire
3. **userId partout**: Toutes les requêtes API nécessitent le userId (Telegram ID)
4. **Relations Prisma**: Le backend retourne les données avec les relations (user, sender, etc.)

## Prochaines étapes

1. Implémenter la gestion des subscriptions (Gold)
2. Ajouter le système de notifications Telegram
3. Implémenter le système de localisation
4. Ajouter le WebSocket pour les messages en temps réel
5. Implémenter l'upload d'images
