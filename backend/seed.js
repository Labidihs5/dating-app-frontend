const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = [
    {
      id: '1',
      name: 'Sarah',
      age: 25,
      gender: 'female',
      bio: 'Love traveling and photography 📸',
      photos: [],
      relationshipType: 'serious'
    },
    {
      id: '2',
      name: 'Emma',
      age: 23,
      gender: 'female',
      bio: 'Coffee lover ☕ | Bookworm 📚',
      photos: [],
      relationshipType: 'casual'
    },
    {
      id: '3',
      name: 'Sophie',
      age: 27,
      gender: 'female',
      bio: 'Fitness enthusiast 💪 | Dog mom 🐕',
      photos: [],
      relationshipType: 'serious'
    },
    {
      id: '4',
      name: 'Alex',
      age: 28,
      gender: 'male',
      bio: 'Software engineer | Gamer 🎮',
      photos: [],
      relationshipType: 'casual'
    },
    {
      id: '5',
      name: 'Mike',
      age: 26,
      gender: 'male',
      bio: 'Music producer 🎵 | Foodie',
      photos: [],
      relationshipType: 'serious'
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user
    });
    console.log(`✅ Created user: ${user.name}`);
  }

  console.log('✅ Database seeded!');
}

seedDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
