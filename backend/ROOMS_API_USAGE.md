# Rooms System - API Usage Examples

## Authentication
All requests require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Get All Rooms
```bash
curl -X GET http://localhost:3001/v1/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "💬 Discussion Générale",
    "description": "Un espace convivial...",
    "type": "PUBLIC",
    "category": "RESPECT",
    "ageRestriction": 0,
    "members": [...],
    "_count": { "members": 45, "messages": 1203 }
  }
]
```

---

## 2. Create Room (GOLD only)
```bash
curl -X POST http://localhost:3001/v1/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Private Room",
    "description": "Exclusive room for friends",
    "type": "PRIVATE",
    "category": "FUN",
    "ageRestriction": 21
  }'
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My Private Room",
  "ownerId": "user-id",
  "members": [{ "userId": "user-id", "role": "OWNER" }]
}
```

---

## 3. Get Room Details
```bash
curl -X GET http://localhost:3001/v1/rooms/{roomId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 4. Join Room
```bash
curl -X POST http://localhost:3001/v1/rooms/{roomId}/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": "member-id",
  "roomId": "room-id",
  "userId": "user-id",
  "role": "MEMBER",
  "joinedAt": "2024-01-15T10:30:00Z"
}
```

---

## 5. Leave Room
```bash
curl -X POST http://localhost:3001/v1/rooms/{roomId}/leave \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 6. Get Room Members
```bash
curl -X GET http://localhost:3001/v1/rooms/{roomId}/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. Get Messages
```bash
curl -X GET "http://localhost:3001/v1/rooms/{roomId}/messages?limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": "msg-id",
    "content": "Hello everyone!",
    "createdAt": "2024-01-15T10:35:00Z",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "photos": ["photo-url"]
    }
  }
]
```

---

## 8. Send Message
```bash
curl -X POST http://localhost:3001/v1/rooms/{roomId}/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello everyone!"
  }'
```

---

## 9. Invite User (Owner/Moderator only)
```bash
curl -X POST http://localhost:3001/v1/rooms/{roomId}/invite \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invitedUserId": "target-user-id"
  }'
```

---

## 10. Kick User (Owner/Moderator only)
```bash
curl -X POST http://localhost:3001/v1/rooms/{roomId}/kick \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "target-user-id"
  }'
```

---

## WebSocket Events

### Connect
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001/rooms', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

### Join Room
```javascript
socket.emit('room:join', {
  roomId: 'room-id',
  userId: 'user-id'
});

socket.on('room:member:joined', (data) => {
  console.log('New member:', data);
});
```

### Send Message
```javascript
socket.emit('room:message:send', {
  roomId: 'room-id',
  userId: 'user-id',
  content: 'Hello!'
});

socket.on('room:message:new', (message) => {
  console.log('New message:', message);
});
```

### Typing Indicator
```javascript
socket.emit('room:typing', {
  roomId: 'room-id',
  userId: 'user-id',
  isTyping: true
});

socket.on('room:typing', (data) => {
  console.log(`${data.userId} is typing...`);
});
```

### Leave Room
```javascript
socket.emit('room:leave', {
  roomId: 'room-id',
  userId: 'user-id'
});
```

---

## Error Responses

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Only GOLD users can create rooms"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Room not found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Already a member"
}
```

---

## Seed System Rooms

Run the seeder:
```bash
cd backend
npx ts-node src/rooms/rooms.seeder.ts
```

Or add to package.json:
```json
{
  "scripts": {
    "seed:rooms": "ts-node src/rooms/rooms.seeder.ts"
  }
}
```

Then run:
```bash
npm run seed:rooms
```
