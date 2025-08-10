import express from "express" ;
import router from "../routes/studentRoutes.js";
import multer from "multer";
import path from "path";
// import LibraryItem from "../models/LibraryItem";
import LibraryItem from '../models/LibraryItem.js';


// Setup Multer for PDF and Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, 'uploads/library/images');
    } else {
      cb(null, 'uploads/library/pdfs');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

// Upload Route (PDF + optional image)
router.post('/upload', upload.fields([{ name: 'pdf' }, { name: 'image' }]), async (req, res) => {
  const { title, description, class: cls, subject } = req.body;
  try {
    const newItem = new LibraryItem({
      title,
      description,
      class: cls,
      subject,
      fileUrl: `/uploads/library/pdfs/${req.files['pdf'][0].filename}`,
      imageUrl: req.files['image'] ? `/uploads/library/images/${req.files['image'][0].filename}` : '',
      uploadedBy: req.userId || null
    });
    await newItem.save();
    res.status(201).json({ message: 'Uploaded successfully', data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all
router.get('/', async (req, res) => {
  const items = await LibraryItem.find().populate('uploadedBy', 'name');
  res.json(items);
});

export default router;
