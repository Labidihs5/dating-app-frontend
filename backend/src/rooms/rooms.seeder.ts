const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SYSTEM_ROOMS = [
  // RESPECT
  { name: '💬 Discussion Générale', description: 'Un espace convivial pour discuter librement dans le respect mutuel.', category: 'RESPECT', type: 'PUBLIC', ageRestriction: 0 },
  { name: '💞 Relations Sérieuses', description: 'Salle dédiée aux personnes recherchant une relation stable et engagée.', category: 'RESPECT', type: 'PUBLIC', ageRestriction: 0 },
  { name: '🌍 Voyage & Culture', description: 'Partagez vos expériences de voyage et découvrez des cultures du monde.', category: 'RESPECT', type: 'PUBLIC', ageRestriction: 0 },
  { name: '🎮 Gaming & Fun', description: 'Pour les passionnés de jeux et de moments fun.', category: 'RESPECT', type: 'PUBLIC', ageRestriction: 0 },
  { name: '🏙 Tunis Connect', description: 'Espace de rencontre pour les membres situés à Tunis.', category: 'CITY', type: 'PUBLIC', ageRestriction: 0 },
  
  // SERIOUS
  { name: '📖 Conversations Profondes', description: 'Discussions matures sur la vie, les valeurs et les projets futurs.', category: 'SERIOUS', type: 'PUBLIC', ageRestriction: 0 },
  { name: '💼 Carrière & Ambition', description: 'Échange autour des objectifs professionnels et ambitions personnelles.', category: 'SERIOUS', type: 'PUBLIC', ageRestriction: 0 },
  
  // ADULT
  { name: '🔥 Discussion Adulte 18+', description: 'Espace réservé aux adultes pour discuter de sujets matures dans le respect des règles.', category: 'ADULT', type: 'PUBLIC', ageRestriction: 18 },
  { name: '🌙 Night Talks 18+', description: 'Conversations tardives pour adultes responsables.', category: 'ADULT', type: 'PUBLIC', ageRestriction: 18 },
  { name: '💘 Flirt Mature', description: 'Salle pour adultes souhaitant échanger dans une ambiance légère et respectueuse.', category: 'ADULT', type: 'PUBLIC', ageRestriction: 18 },
  
  // FUN
  { name: '🎉 Fun & Chill', description: 'Ambiance détendue pour discuter et faire de nouvelles rencontres.', category: 'FUN', type: 'PUBLIC', ageRestriction: 0 },
  { name: '😂 Humour & Memes', description: 'Partage de bonne humeur et discussions légères.', category: 'FUN', type: 'PUBLIC', ageRestriction: 0 },
  
  // CITY
  { name: '🌍 International', description: 'Salle ouverte aux membres du monde entier.', category: 'CITY', type: 'PUBLIC', ageRestriction: 0 },
];

async function seedSystemRooms() {
  console.log('🌱 Seeding system rooms...');

  for (const room of SYSTEM_ROOMS) {
    const existing = await prisma.room.findFirst({
      where: { name: room.name, isSystemRoom: true },
    });

    if (!existing) {
      await prisma.room.create({
        data: {
          ...room,
          isSystemRoom: true,
        },
      });
      console.log(`✅ Created: ${room.name}`);
    } else {
      console.log(`⏭️  Skipped: ${room.name} (already exists)`);
    }
  }

  console.log('✅ System rooms seeded successfully');
}

module.exports = { seedSystemRooms };

// Run if executed directly
if (require.main === module) {
  seedSystemRooms()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
