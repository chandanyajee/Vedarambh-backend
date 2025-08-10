// routes/videoLibraryRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import VideoLibraryItem from '../models/VideoLibraryItem.js'; // Make sure this file exists with .js extension


const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, 'uploads/videos/thumbnails');
    } else {
      cb(null, 'uploads/videos/files');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// console.log("Files received:", req.files);
// console.log("Body:", req.body);


// Upload video route
router.post('/upload', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
  const { title, description, isYouTube, youtubeUrl } = req.body;

  try {
    const newVideo = new VideoLibraryItem({
      title,
      description,
      isYouTube: isYouTube === 'true',
      videoUrl: isYouTube === 'true' ? youtubeUrl : `/uploads/videos/files/${req.files['video'][0].filename}`,
      thumbnailUrl: req.files['thumbnail'] ? `/uploads/videos/thumbnails/${req.files['thumbnail'][0].filename}` : '',
      uploadedBy: req.userId || null
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video Uploaded', data: newVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


router.get('/', async (req, res) => {
  try {
    console.log('📽️ GET /api/videolibrary hit');
    const videos = await VideoLibraryItem.find();
    console.log('Fetched videos:', videos);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});



export default router;
