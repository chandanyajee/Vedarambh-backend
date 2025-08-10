// models/VideoLibraryItem.js
import mongoose from 'mongoose';

const videoLibraryItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  isYouTube: Boolean,
  videoUrl: String,
  thumbnailUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const VideoLibraryItem = mongoose.model('VideoLibraryItem', videoLibraryItemSchema);

export default VideoLibraryItem;
