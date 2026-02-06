const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/rooms - List rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/create
router.post('/create', async (req, res) => {
  try {
    const { name, type, owner_id, is_verified_only } = req.body || {};
    if (!name || !type) {
      return res.status(400).json({ error: 'name and type are required' });
    }

    const room = await prisma.chatRoom.create({
      data: {
        name,
        type,
        ownerId: owner_id || null,
        isVerifiedOnly: !!is_verified_only
      }
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  try {
    const { room_id, user_id } = req.body || {};
    if (!room_id || !user_id) {
      return res.status(400).json({ error: 'room_id and user_id are required' });
    }

    const member = await prisma.roomMember.upsert({
      where: { roomId_userId: { roomId: room_id, userId: user_id } },
      update: {},
      create: {
        roomId: room_id,
        userId: user_id
      }
    });

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/message
router.post('/message', async (req, res) => {
  try {
    const { room_id, user_id, content } = req.body || {};
    if (!room_id || !user_id || !content) {
      return res.status(400).json({ error: 'room_id, user_id, content are required' });
    }

    const msg = await prisma.roomMessage.create({
      data: {
        roomId: room_id,
        userId: user_id,
        content
      }
    });

    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms/messages?room_id=...
router.get('/messages', async (req, res) => {
  try {
    const roomId = req.query.room_id;
    if (!roomId) {
      return res.status(400).json({ error: 'room_id is required' });
    }

    const msgs = await prisma.roomMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      take: 200
    });
    res.json(msgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
