const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { sendNotificationEmail } = require('../services/notificationService');

// GET /api/likes - Get incoming likes
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const likes = await prisma.like.findMany({
      where: { receiverId: userId },
      include: { sender: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/likes/:id/respond - Accept or reject like
router.post('/:id/respond', async (req, res) => {
  try {
    const { accept, userId } = req.body;
    
    const like = await prisma.like.findUnique({
      where: { id: req.params.id }
    });
    
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }
    
    if (accept) {
      // Create reciprocal like
      const reciprocalLike = await prisma.like.create({
        data: {
          senderId: userId,
          receiverId: like.senderId
        }
      });
      
      // Create match
      const match = await prisma.match.create({
        data: {
          user1Id: like.senderId,
          user2Id: userId
        }
      });

      await Promise.all([
        sendNotificationEmail(like.senderId, 'match', { matchUserId: userId }),
        sendNotificationEmail(userId, 'match', { matchUserId: like.senderId })
      ]);
      
      res.json({ match, reciprocalLike });
    } else {
      // Just acknowledge the rejection
      res.json({ success: true, accepted: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
