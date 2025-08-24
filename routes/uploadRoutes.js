import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { bucket } from '../firebaseAdmin.js';

const router = express.Router();

// --------------------- LOCAL STORAGE ---------------------
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

// --------------------- ROUTE ---------------------
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const localFilePath = path.join(uploadPath, req.file.filename);

    // ✅ 1. Local file saved
    console.log('File saved locally at:', localFilePath);

    // ✅ 2. Upload to Firebase Cloud
    const blob = bucket.file(req.file.filename);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (err) => {
      console.error('Cloud upload error:', err);
    });

    blobStream.on('finish', async () => {
      const cloudUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // ✅ 3. (Optional) Upload to YouTube
      // यहाँ आप YouTube Data API (v3) का code लगाएंगे
      // अभी सिर्फ placeholder दे रहा हूँ
      let youtubeUrl = null;
      // youtubeUrl = await uploadToYouTube(localFilePath); <-- future function

      res.status(200).json({
        message: 'Upload successful!',
        localPath: localFilePath,
        cloudUrl: cloudUrl,
        youtubeUrl: youtubeUrl, // अभी null रहेगा
      });
    });

    blobStream.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
