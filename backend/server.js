const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Auto-offline inactive users (every minute)
setInterval(async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    await prisma.user.updateMany({
      where: {
        isOnline: true,
        lastSeen: { lt: oneMinuteAgo }
      },
      data: { isOnline: false }
    });
  } catch (error) {
    console.error('Error updating offline users:', error);
  }
}, 60000);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/interactions', require('./routes/interactions'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/status', require('./routes/status'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});