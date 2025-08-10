
import express from "express"
const router = express.Router();
import multer from "multer";
import ShortVideo from "../models/ShortVideo.js";
import auth from '../middleware/authMiddleware.js'
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, 'uploads/shorts/thumbs');
    else cb(null, 'uploads/shorts/videos');
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

const upload = multer({ storage });

router.post('/upload', auth, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
  const { title, description } = req.body;

  try {
    const newShort = new ShortVideo({
      title,
      description,
      videoUrl: `/uploads/shorts/videos/${req.files['video'][0].filename}`,
      thumbnailUrl: req.files['thumbnail'] ? `/uploads/shorts/thumbs/${req.files['thumbnail'][0].filename}` : '',
      uploadedBy: req.userId
    });

    await newShort.save();
    res.status(201).json({ message: 'Short uploaded successfully', data: newShort });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/', async (req, res) => {
  const videos = await ShortVideo.find().populate('uploadedBy', 'name');
  res.json(videos);
});




export default router; // ✅ default export