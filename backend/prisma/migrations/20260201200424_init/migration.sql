-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telegramUsername" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;
