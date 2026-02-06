const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

async function updatePresence(userId, isOnline) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isOnline,
      lastSeen: new Date()
    }
  });
}

// POST /api/presence/online
router.post('/online', async (req, res) => {
  try {
    const userId = req.body.user_id || req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const user = await updatePresence(userId, true);
    res.json({ userId: user.id, isOnline: user.isOnline, lastSeen: user.lastSeen });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /api/presence/offline
router.post('/offline', async (req, res) => {
  try {
    const userId = req.body.user_id || req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const user = await updatePresence(userId, false);
    res.json({ userId: user.id, isOnline: user.isOnline, lastSeen: user.lastSeen });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
