const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/messages/:matchId - Get conversation
router.get('/:matchId', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const messages = await prisma.message.findMany({
      where: { matchId: req.params.matchId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
    
    // Auto-mark messages as delivered for the recipient
    if (userId) {
      const undeliveredIds = messages
        .filter(msg => msg.senderId !== userId && !msg.isDelivered)
        .map(msg => msg.id);
      
      if (undeliveredIds.length > 0) {
        await prisma.message.updateMany({
          where: { id: { in: undeliveredIds } },
          data: { 
            isDelivered: true,
            deliveredAt: new Date()
          }
        });
      }
    }
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/messages/:matchId/send - Send message
router.post('/:matchId/send', async (req, res) => {
  try {
    const { content, senderId } = req.body;
    
    console.log('Sending message:', { matchId: req.params.matchId, senderId, content });
    
    const message = await prisma.message.create({
      data: {
        matchId: req.params.matchId,
        senderId,
        content,
        isDelivered: true,
        deliveredAt: new Date()
      },
      include: { sender: true }
    });
    
    // Get match to find recipient
    const match = await prisma.match.findUnique({
      where: { id: req.params.matchId },
      include: { user1: true, user2: true }
    });
    
    if (match) {
      const recipientId = match.user1Id === senderId ? match.user2Id : match.user1Id;
      const sender = match.user1Id === senderId ? match.user1 : match.user2;
      
      // Create notification for recipient
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'message',
          title: `💬 ${sender.name}`,
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          data: { matchId: req.params.matchId, messageId: message.id, senderId }
        }
      });
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/messages/:messageId/read - Mark message as read
router.post('/:messageId/read', async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: req.params.messageId },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    });
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/messages/read - Mark messages as read
router.post('/read', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    await prisma.message.updateMany({
      where: { id: { in: messageIds } },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;