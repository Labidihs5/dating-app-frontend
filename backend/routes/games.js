const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/games/create
router.post('/create', async (req, res) => {
  try {
    const { game_type, mode, player1_id, player2_id } = req.body || {};
    if (!game_type || !mode || !player1_id) {
      return res.status(400).json({ error: 'game_type, mode, player1_id are required' });
    }
    const game = await prisma.game.create({
      data: {
        gameType: game_type,
        mode,
        player1Id: player1_id,
        player2Id: player2_id || null,
        status: 'active',
        state: {}
      }
    });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/games/move
router.post('/move', async (req, res) => {
  try {
    const { game_id, player_id, move, state } = req.body || {};
    if (!game_id || !player_id || !move) {
      return res.status(400).json({ error: 'game_id, player_id, move are required' });
    }

    const game = await prisma.game.findUnique({ where: { id: game_id } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await prisma.gameMove.create({
      data: {
        gameId: game_id,
        playerId: player_id,
        move
      }
    });

    const updated = await prisma.game.update({
      where: { id: game_id },
      data: {
        state: state || game.state,
        updatedAt: new Date()
      }
    });

    res.json({ ok: true, game: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/games/state?game_id=...
router.get('/state', async (req, res) => {
  try {
    const gameId = req.query.game_id;
    if (!gameId) {
      return res.status(400).json({ error: 'game_id is required' });
    }
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/games/challenge_generate
router.post('/challenge_generate', async (req, res) => {
  try {
    const { game_type, trigger, user_id, target_id } = req.body || {};
    const challenge = await prisma.datingChallenge.create({
      data: {
        gameType: game_type || null,
        trigger: trigger || null,
        challengeText: 'Share 3 things you love about weekend mornings.',
        difficulty: 'easy',
        userId: user_id || null,
        targetId: target_id || null
      }
    });
    res.json({ challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/games/chess/matchmake
router.post('/chess/matchmake', async (req, res) => {
  try {
    const { user_id, fen } = req.body || {};
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const waiting = await prisma.game.findFirst({
      where: {
        gameType: 'chess',
        status: 'waiting',
        player1Id: { not: user_id }
      },
      orderBy: { createdAt: 'asc' }
    });

    if (waiting) {
      const updated = await prisma.game.update({
        where: { id: waiting.id },
        data: {
          player2Id: user_id,
          status: 'active'
        }
      });
      return res.json({
        game_id: updated.id,
        color: 'black',
        fen: updated.state?.fen || fen,
        status: updated.status
      });
    }

    const created = await prisma.game.create({
      data: {
        gameType: 'chess',
        mode: 'pvp',
        player1Id: user_id,
        status: 'waiting',
        state: { fen }
      }
    });

    return res.json({
      game_id: created.id,
      color: 'white',
      fen,
      status: created.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/games/chess/move
router.post('/chess/move', async (req, res) => {
  try {
    const { game_id, user_id, uci, fen } = req.body || {};
    if (!game_id || !user_id || !uci || !fen) {
      return res.status(400).json({ error: 'game_id, user_id, uci, fen are required' });
    }

    const game = await prisma.game.findUnique({ where: { id: game_id } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await prisma.gameMove.create({
      data: {
        gameId: game_id,
        playerId: user_id,
        move: { uci, fen }
      }
    });

    await prisma.game.update({
      where: { id: game_id },
      data: { state: { fen }, updatedAt: new Date() }
    });

    res.json({ fen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
