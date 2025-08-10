// uploadRoutes.js (Express.js Backend)
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Content from '../models/UploadForm.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadPath = 'uploads';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload content
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, category, language } = req.body;
    const filePath = req.file.path.replace(/\\/g, '/');

    const content = new Content({
      title,
      description,
      type,
      category,
      language,
      filePath,
    });

    await content.save();
    res.status(201).json({ message: 'Content uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

// @route   GET /api/upload
// @desc    Get uploaded content (filtered)
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const contents = await Content.find(filter).sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching content.' });
  }
});

export default router;