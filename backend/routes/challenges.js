const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/challenges - Create a dating challenge
router.post('/', async (req, res) => {
  try {
    const { game_type, trigger, challenge_text, difficulty, user_id, target_id } = req.body || {};

    const challenge = await prisma.datingChallenge.create({
      data: {
        gameType: game_type || null,
        trigger: trigger || null,
        challengeText: challenge_text || 'Share three values that matter most to you in a relationship.',
        difficulty: difficulty || 'medium',
        userId: user_id || null,
        targetId: target_id || null
      }
    });

    res.json({ challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
