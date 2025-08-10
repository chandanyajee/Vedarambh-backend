import mongoose from 'mongoose';

const ShortVideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: { type: String, required: true },
  thumbnailUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

const ShortVideo = mongoose.model('ShortVideo', ShortVideoSchema);

export default ShortVideo;
