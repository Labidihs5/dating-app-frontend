const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/interactions/like - Like a profile
router.post('/like', async (req, res) => {
  try {
    const { senderId, targetProfileId, isSuper = false } = req.body;
    
    console.log('[Like] Request:', { senderId, targetProfileId, isSuper });
    
    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId,
        receiverId: targetProfileId
      }
    });
    
    if (existingLike) {
      console.log('[Like] Already exists');
      return res.json({ like: existingLike, match: null, isMatch: false });
    }
    
    // Create like
    const like = await prisma.like.create({
      data: {
        senderId,
        receiverId: targetProfileId,
        isSuper
      }
    });
    
    console.log('[Like] Created:', like);
    
    // Check if it's a match (mutual like)
    const mutualLike = await prisma.like.findFirst({
      where: {
        senderId: targetProfileId,
        receiverId: senderId
      }
    });
    
    console.log('[Like] Mutual like check:', mutualLike);
    
    let match = null;
    if (mutualLike) {
      // Check if match already exists
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { user1Id: senderId, user2Id: targetProfileId },
            { user1Id: targetProfileId, user2Id: senderId }
          ]
        }
      });
      
      if (!existingMatch) {
        // Create match
        match = await prisma.match.create({
          data: {
            user1Id: senderId,
            user2Id: targetProfileId
          }
        });
        console.log('[Like] Match created:', match);
        
        // Create notifications for both users
        const [user1, user2] = await Promise.all([
          prisma.user.findUnique({ where: { id: senderId } }),
          prisma.user.findUnique({ where: { id: targetProfileId } })
        ]);
        
        await Promise.all([
          prisma.notification.create({
            data: {
              userId: senderId,
              type: 'match',
              title: '🎉 New Match!',
              message: `You matched with ${user2?.name}!`,
              data: { matchId: match.id, userId: targetProfileId }
            }
          }),
          prisma.notification.create({
            data: {
              userId: targetProfileId,
              type: 'match',
              title: '🎉 New Match!',
              message: `You matched with ${user1?.name}!`,
              data: { matchId: match.id, userId: senderId }
            }
          })
        ]);
      } else {
        match = existingMatch;
        console.log('[Like] Match already exists:', match);
      }
    } else {
      // Create like notification for receiver
      const sender = await prisma.user.findUnique({ where: { id: senderId } });
      await prisma.notification.create({
        data: {
          userId: targetProfileId,
          type: 'like',
          title: isSuper ? '⭐ Super Like!' : '❤️ New Like!',
          message: `${sender?.name} ${isSuper ? 'super ' : ''}liked you!`,
          data: { likeId: like.id, userId: senderId }
        }
      });
    }
    
    res.json({ like, match, isMatch: !!match });
  } catch (error) {
    console.error('[Like] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/interactions/pass - Pass on a profile
router.post('/pass', async (req, res) => {
  try {
    const { senderId, targetProfileId } = req.body;
    
    // For now, just log the pass (could store in separate table)
    console.log(`User ${senderId} passed on ${targetProfileId}`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/interactions/super-like - Super like a profile
router.post('/super-like', async (req, res) => {
  try {
    const { senderId, targetProfileId } = req.body;
    
    const like = await prisma.like.create({
      data: {
        senderId,
        receiverId: targetProfileId,
        isSuper: true
      }
    });
    
    res.json({ like, isSuper: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;