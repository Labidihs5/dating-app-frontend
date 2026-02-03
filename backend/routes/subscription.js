const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/subscription/status - Check subscription status
router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // For now, return mock subscription status
    // In production, integrate with payment provider
    const subscription = {
      isActive: false,
      plan: null,
      expiresAt: null,
      features: {
        unlimitedSwipes: false,
        unlimitedMessages: false,
        seeWhoLikesYou: false,
        readReceipts: false,
        superLikes: 1, // Free users get 1 per day
        priorityBoost: false
      }
    };
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/subscription/checkout - Create checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    // Mock checkout URL - integrate with Stripe/payment provider
    const checkoutUrl = `https://checkout.example.com/session?plan=${plan}&user=${userId}`;
    
    res.json({ 
      checkoutUrl,
      sessionId: `mock_session_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/subscription/cancel - Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Mock cancellation - integrate with payment provider
    res.json({ 
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;