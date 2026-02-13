@echo off
echo 📊 Mise à jour de la base de données locale...

echo 1️⃣ Génération du client Prisma...
call npx prisma generate

echo 2️⃣ Push du schéma vers la DB...
call npx prisma db push

echo 3️⃣ Seed des rooms système...
call npx ts-node src/rooms/rooms.seeder.ts

echo ✅ Base de données mise à jour!
pause
