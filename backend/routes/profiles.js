const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/profiles - Get profiles for discovery
router.get('/', async (req, res) => {
  try {
    const { userId, ageMin, ageMax, gender, maxDistance } = req.query;
    
    console.log('[Profiles] Query params:', { userId, ageMin, ageMax, gender, maxDistance });
    
    // Get user's matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });
    
    // Get user's likes (sent)
    const likes = await prisma.like.findMany({
      where: { senderId: userId }
    });
    
    // Extract matched user IDs
    const matchedUserIds = matches.map(match => 
      match.user1Id === userId ? match.user2Id : match.user1Id
    );
    
    // Extract liked user IDs
    const likedUserIds = likes.map(like => like.receiverId);
    
    // Combine both lists
    const excludedUserIds = [...matchedUserIds, ...likedUserIds];
    
    console.log('[Profiles] Excluded user IDs:', excludedUserIds);
    
    const whereClause = {};
    const andConditions = [];
    
    if (userId) {
      andConditions.push({ id: { not: userId } });
      // Exclude matched and liked users
      if (excludedUserIds.length > 0) {
        andConditions.push({ id: { notIn: excludedUserIds } });
      }
    }
    if (ageMin) {
      andConditions.push({ age: { gte: parseInt(ageMin) } });
    }
    if (ageMax) {
      andConditions.push({ age: { lte: parseInt(ageMax) } });
    }
    if (gender && gender !== 'all') {
      andConditions.push({ gender: gender });
    }
    
    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }
    
    console.log('[Profiles] Where clause:', JSON.stringify(whereClause));
    
    const profiles = await prisma.user.findMany({
      where: whereClause,
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('[Profiles] Found profiles:', profiles.length);
    res.json(profiles);
  } catch (error) {
    console.error('[Profiles] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/profiles/nearby - Get nearby profiles
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, userId } = req.query;
    
    // For now, return all profiles (distance calculation would need PostGIS)
    const profiles = await prisma.user.findMany({
      where: {
        id: { not: userId }
      },
      take: 20
    });
    
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;