const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login - Login with Telegram
router.post('/login', async (req, res) => {
  try {
    const { telegramId, firstName, lastName, username } = req.body;
    
    let user = await prisma.user.findFirst({
      where: { 
        OR: [
          { id: telegramId.toString() },
          { name: `${firstName} ${lastName}`.trim() }
        ]
      }
    });
    
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          id: telegramId.toString(),
          name: `${firstName} ${lastName}`.trim(),
          age: 18, // Default, will be updated in profile
          gender: 'other', // Default
          bio: '', // Will be filled in profile
          photos: [],
          relationshipType: 'serious'
        }
      });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

// DELETE /api/auth/delete-account - Delete account
router.delete('/delete-account', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await prisma.user.delete({
      where: { id: userId }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;