-- HeartMatch Dating App Database Schema
-- PostgreSQL

-- Create database
CREATE DATABASE dating_app;

-- Connect to database
\c dating_app;

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    "telegramUsername" TEXT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    bio TEXT,
    photos TEXT[] NOT NULL DEFAULT '{}',
    "profilePhotoIndex" INTEGER NOT NULL DEFAULT 0,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location JSONB,
    preferences JSONB,
    "relationshipType" TEXT NOT NULL DEFAULT 'serious',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Likes table
CREATE TABLE likes (
    id TEXT PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "likes_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT "likes_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT "likes_senderId_receiverId_key" UNIQUE ("senderId", "receiverId")
);

-- Matches table
CREATE TABLE matches (
    id TEXT PRIMARY KEY,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT "matches_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT "matches_user1Id_user2Id_key" UNIQUE ("user1Id", "user2Id")
);

-- Messages table
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    content TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    CONSTRAINT "messages_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_likes_senderId ON likes("senderId");
CREATE INDEX idx_likes_receiverId ON likes("receiverId");
CREATE INDEX idx_matches_user1Id ON matches("user1Id");
CREATE INDEX idx_matches_user2Id ON matches("user2Id");
CREATE INDEX idx_messages_matchId ON messages("matchId");

-- AI profiles
CREATE TABLE ai_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  "relationshipType" TEXT NOT NULL,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  "photoUrl" TEXT,
  city TEXT,
  country TEXT,
  "aiPrompt" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Dating challenges
CREATE TABLE dating_challenges (
  id TEXT PRIMARY KEY,
  "gameType" TEXT,
  trigger TEXT,
  "challengeText" TEXT NOT NULL,
  difficulty TEXT,
  "userId" TEXT,
  "targetId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Games
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  "gameType" TEXT NOT NULL,
  mode TEXT NOT NULL,
  "player1Id" TEXT NOT NULL,
  "player2Id" TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  state JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_moves (
  id TEXT PRIMARY KEY,
  "gameId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  move JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_results (
  id TEXT PRIMARY KEY,
  "gameId" TEXT UNIQUE NOT NULL,
  "winnerId" TEXT,
  "loserId" TEXT,
  "gameType" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Chat rooms
CREATE TABLE chat_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  "ownerId" TEXT,
  "isVerifiedOnly" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE room_members (
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "joinedAt" TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY ("roomId", "userId")
);

CREATE TABLE room_messages (
  id TEXT PRIMARY KEY,
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_messages_senderId ON messages("senderId");
CREATE INDEX idx_notifications_userId ON notifications("userId");
CREATE INDEX idx_users_isOnline ON users("isOnline");

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
