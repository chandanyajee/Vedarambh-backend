import { Schema, model } from 'mongoose';
const ReelSchema = new Schema(
  {
    type: { type: String, enum: ['upload', 'youtube', 'instagram', 'facebook', 'link'], required: true },
    // common
    caption: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // upload-specific
    videoUrl: String,
    thumbnailUrl: String,
    durationSec: Number,

    // link-specific
    sourceUrl: String, // original URL pasted by user
    embedUrl: String,  // normalized URL used for iframe

    // moderation & stats
    approved: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export default model('Reel', ReelSchema);

// // 6) middleware/auth.js (optional – wire later)
// export default function authOptional(req, _res, next) {
//   // TODO: parse JWT if present and attach req.user
//   next();
// };