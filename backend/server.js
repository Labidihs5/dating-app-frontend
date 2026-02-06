const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(
  '/py',
  createProxyMiddleware({
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
    ws: true,
    proxyTimeout: 120000,
    timeout: 120000,
    pathRewrite: (path) => path.replace(/^\/py/, ''),
    onProxyReq: (proxyReq, req) => {
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);
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
app.use('/api/settings', require('./routes/settings'));
app.use('/api/ai-profiles', require('./routes/ai-profiles'));
app.use('/api/games', require('./routes/games'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/presence', require('./routes/presence'));

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
