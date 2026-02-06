-- AI profiles
CREATE TABLE "ai_profiles" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "gender" TEXT NOT NULL,
  "relationshipType" TEXT NOT NULL,
  "bio" TEXT,
  "interests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "photoUrl" TEXT,
  "city" TEXT,
  "country" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_profiles_pkey" PRIMARY KEY ("id")
);

-- Dating challenges
CREATE TABLE "dating_challenges" (
  "id" TEXT NOT NULL,
  "gameType" TEXT,
  "trigger" TEXT,
  "challengeText" TEXT NOT NULL,
  "difficulty" TEXT,
  "userId" TEXT,
  "targetId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dating_challenges_pkey" PRIMARY KEY ("id")
);

-- Games
CREATE TABLE "games" (
  "id" TEXT NOT NULL,
  "gameType" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "player1Id" TEXT NOT NULL,
  "player2Id" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "state" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "game_moves" (
  "id" TEXT NOT NULL,
  "gameId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "move" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "game_moves_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "game_results" (
  "id" TEXT NOT NULL,
  "gameId" TEXT NOT NULL,
  "winnerId" TEXT,
  "loserId" TEXT,
  "gameType" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "game_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "game_results_gameId_key" ON "game_results"("gameId");

-- Chat rooms
CREATE TABLE "chat_rooms" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "ownerId" TEXT,
  "isVerifiedOnly" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "room_members" (
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "room_members_pkey" PRIMARY KEY ("roomId","userId")
);

CREATE TABLE "room_messages" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "room_messages_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "game_moves" ADD CONSTRAINT "game_moves_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "room_messages" ADD CONSTRAINT "room_messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
