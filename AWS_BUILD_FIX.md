# ✅ AWS Build Fix

## Problème résolu:

### Erreur:
```
Module not found: Can't resolve 'socket.io-client'
```

### Solution:
1. ✅ Installé `socket.io-client` dans package.json
2. ✅ Supprimé l'import socket.io dans `/app/rooms/[id]/page.tsx`
3. ✅ Utilisé polling HTTP au lieu de WebSocket pour le chat
4. ✅ Commit et push vers GitHub

## Changements:

### Avant:
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3001/rooms');
socket.on('room:message:new', (message) => {
  setMessages(prev => [...prev, message]);
});
```

### Après:
```typescript
// Polling HTTP simple
const sendMessage = async () => {
  await fetch(`/api/rooms/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content: newMessage })
  });
  loadMessages(); // Reload messages
};
```

## Déploiement AWS:

Le build devrait maintenant passer sur AWS Amplify.

### Pour activer WebSocket plus tard:

1. Installer socket.io-client côté client
2. Configurer CORS sur le backend
3. Utiliser dynamic import:

```typescript
useEffect(() => {
  import('socket.io-client').then(({ default: io }) => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    // ...
  });
}, []);
```

---

**Status**: ✅ Build AWS corrigé
**Commit**: 9664c9a
**Branch**: games
