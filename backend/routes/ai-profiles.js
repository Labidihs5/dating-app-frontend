const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/ai-profiles - List AI profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await prisma.aiProfile.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai-profiles - Create AI profiles (single or bulk)
router.post('/', async (req, res) => {
  try {
    const { profiles, profile } = req.body || {};
    const items = Array.isArray(profiles) ? profiles : (profile ? [profile] : null);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'profiles is required' });
    }

    const created = await prisma.aiProfile.createMany({
      data: items.map(item => ({
        name: item.name,
        age: Number(item.age) || 25,
        gender: item.gender || 'female',
        relationshipType: item.relationshipType || 'serious',
        bio: item.bio || null,
        interests: item.interests || [],
        photoUrl: item.photoUrl || null,
        city: item.city || null,
        country: item.country || null,
        aiPrompt: item.aiPrompt || null
      })),
      skipDuplicates: true
    });

    res.json({ created: created.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
