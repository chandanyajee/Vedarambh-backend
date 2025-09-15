import express from "express";
import multer from "multer";
import validator from "validator";
import setupCloudinary from "../config/cloudinary.js";
import Reel from "../models/Reel.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB
  fileFilter: (_req, file, cb) => {
    const ok = ["video/mp4", "video/quicktime", "video/webm"].includes(file.mimetype);
    cb(ok ? null : new Error("Unsupported file type"), ok);
  },
});

const cloudinary = setupCloudinary();

// Helpers
function detectProvider(url) {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("facebook.com") || u.includes("fb.watch")) return "facebook";
  return "link";
}

function youtubeEmbed(url) {
  try {
    let id = "";
    const yt = new URL(url);
    if (yt.hostname === "youtu.be") id = yt.pathname.slice(1);
    else id = yt.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function instagramEmbed(url) {
  try {
    const ig = new URL(url);
    const path = ig.pathname.replace(/\/$/, "");
    return `https://www.instagram.com${path}/embed`;
  } catch {
    return null;
  }
}

function facebookEmbed(url) {
  try {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false&width=560`;
  } catch {
    return null;
  }
}

// Helper to stream buffer to Cloudinary
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

// POST /api/reels/upload
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: "video",
      folder: "vedarambh/reels",
    });

    const reel = await Reel.create({
      type: "upload",
      videoUrl: result.secure_url,
      caption: req.body.caption || "",
      tags: (req.body.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      postedBy: req.user?._id || null,
    });

    res.json(reel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reels/link
router.post("/link", async (req, res) => {
  try {
    const { url, caption = "", tags = "" } = req.body;
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ message: "Valid URL required (include https://)" });
    }

    const provider = detectProvider(url);
    let embedUrl = null;
    if (provider === "youtube") embedUrl = youtubeEmbed(url);
    if (provider === "instagram") embedUrl = instagramEmbed(url);
    if (provider === "facebook") embedUrl = facebookEmbed(url);

    const reel = await Reel.create({
      type: provider,
      sourceUrl: url,
      embedUrl,
      caption,
      tags: (Array.isArray(tags) ? tags : String(tags).split(","))
        .map((t) => String(t).trim())
        .filter(Boolean),
      postedBy: req.user?._id || null,
    });

    res.json(reel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reels
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);

    const query = { approved: true };
    const [items, total] = await Promise.all([
      Reel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Reel.countDocuments(query),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
