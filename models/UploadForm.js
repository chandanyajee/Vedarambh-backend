// models/Content.js
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // 'document' | 'video' | 'audio' | 'image'
  category: String,
  language: String,
  filePath: String,
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
