const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/matches - Get user's matches
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format matches to show the other user
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      const lastMessage = match.messages[0];
      
      return {
        id: match.id,
        user: {
          ...otherUser,
          isOnline: otherUser.isOnline,
          lastSeen: otherUser.lastSeen
        },
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null,
        createdAt: match.createdAt
      };
    });
    
    res.json(formattedMatches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/matches/:id - Get specific match
router.get('/:id', async (req, res) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            bio: true,
            photos: true,
            profilePhotoIndex: true,
            isOnline: true,
            lastSeen: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            bio: true,
            photos: true,
            profilePhotoIndex: true,
            isOnline: true,
            lastSeen: true
          }
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/matches/:id - Unmatch
router.delete('/:id', async (req, res) => {
  try {
    // Get match details before deleting
    const match = await prisma.match.findUnique({
      where: { id: req.params.id }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Delete the match
    await prisma.match.delete({
      where: { id: req.params.id }
    });
    
    // Delete both likes (user1 -> user2 and user2 -> user1)
    await prisma.like.deleteMany({
      where: {
        OR: [
          { senderId: match.user1Id, receiverId: match.user2Id },
          { senderId: match.user2Id, receiverId: match.user1Id }
        ]
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;