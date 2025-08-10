// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const LibraryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },   // PDF
  imageUrl: String,                            // Optional cover image
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: String,
  subject: String,
  uploadedAt: { type: Date, default: Date.now }
});

const LibraryItem = mongoose.model('LibraryItem', LibraryItemSchema);

// export default LibraryItemSchema; // ✅ default export

// const ShortVideo = mongoose.model('ShortVideo', ShortVideoSchema);

export default LibraryItemSchema;
