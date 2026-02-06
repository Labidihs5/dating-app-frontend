const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating user:', req.params.id, req.body);
    
    // Filter out undefined values and only update provided fields
    const updateData = {};
    
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.age !== undefined) updateData.age = parseInt(req.body.age);
    if (req.body.gender !== undefined) updateData.gender = req.body.gender;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.photos !== undefined) updateData.photos = req.body.photos;
    if (req.body.profilePhotoIndex !== undefined) updateData.profilePhotoIndex = parseInt(req.body.profilePhotoIndex);
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.preferences !== undefined) updateData.preferences = req.body.preferences;
    if (req.body.relationshipType !== undefined) updateData.relationshipType = req.body.relationshipType;
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    console.log('Creating user with data:', req.body);
    const { id, name, age, gender, bio, photos, location, preferences } = req.body;
    
    const userData = {
      name,
      age: parseInt(age),
      gender,
      bio,
      photos: photos || [],
      profilePhotoIndex: 0,
      location,
      preferences
    };
    
    // If ID is provided, use it (for Telegram users)
    if (id) {
      console.log('Using provided ID:', id);
      userData.id = id;
    } else {
      console.log('No ID provided, Prisma will generate one');
    }
    
    console.log('Final userData:', userData);
    
    const user = await prisma.user.create({
      data: userData
    });
    
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/:id/photos - Upload photos
router.post('/:id/photos', upload.array('photos', 5), async (req, res) => {
  try {
    const userId = req.params.id;
    const photoUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedPhotos = [...(user.photos || []), ...photoUrls].slice(0, 5);
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { photos: updatedPhotos }
    });
    
    res.json({ photos: updatedUser.photos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;