// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, default: "Beginner" },
  price: { type: Number, default: 0 },
  thumbnailUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model("Course", courseSchema);

export default Course;  // 🔥 ab default export hai
