const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings/:userId - Get user settings
router.get('/:userId', async (req, res) => {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.params.userId }
    });
    
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: req.params.userId,
          emailNotifications: true,
          matchNotifications: true,
          messageNotifications: true,
          pushNotifications: true,
          darkMode: false,
          profileVisibility: 'public',
          language: 'en',
          hideExactLocation: false,
          locationSharing: 'exact'
        }
      });
      return res.json(defaultSettings);
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/settings/:userId - Update user settings
router.put('/:userId', async (req, res) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.params.userId },
      update: req.body,
      create: {
        userId: req.params.userId,
        ...req.body
      }
    });
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;