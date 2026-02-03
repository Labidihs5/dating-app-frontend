const express = require('express');
const router = express.Router();

// POST /api/telegram/init - Initialize mini-app
router.post('/init', async (req, res) => {
  try {
    const { initData, user } = req.body;
    
    // Validate Telegram init data
    // In production, verify the hash and data authenticity
    
    res.json({ 
      success: true,
      user: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/telegram/notify/match - Send match notification
router.post('/notify/match', async (req, res) => {
  try {
    const { userId, matchId, matchName } = req.body;
    
    // Mock notification - integrate with Telegram Bot API
    console.log(`📱 Sending match notification to user ${userId}: New match with ${matchName}`);
    
    res.json({ 
      success: true,
      notificationSent: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/telegram/notify/message - Send message notification
router.post('/notify/message', async (req, res) => {
  try {
    const { userId, matchId, senderName, messagePreview } = req.body;
    
    // Mock notification - integrate with Telegram Bot API
    console.log(`📱 Sending message notification to user ${userId}: ${senderName} sent a message`);
    
    res.json({ 
      success: true,
      notificationSent: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;