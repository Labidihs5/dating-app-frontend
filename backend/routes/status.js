const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/status/online - Set user online
router.post('/online', async (req, res) => {
  try {
    const { userId } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true, lastSeen: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/status/offline - Set user offline
router.post('/offline', async (req, res) => {
  try {
    const { userId } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: false, lastSeen: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/status/:userId - Get user status
router.get('/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { isOnline: true, lastSeen: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
