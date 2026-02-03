const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/notifications/:userId - Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/:userId/unread - Get unread count
router.get('/:userId/unread', async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { 
        userId: req.params.userId,
        isRead: false
      }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications - Create notification
router.post('/', async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;
    const notification = await prisma.notification.create({
      data: { userId, type, title, message, data }
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/user/:userId/read-all - Mark all as read
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.params.userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date() }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
