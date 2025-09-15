import express from "express";
import Course from "../models/Course.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// CREATE course (Teacher or Admin only)
router.post(
  "/",
  authMiddleware(["teacher", "admin"]),
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { title, description, category, language, level, price } = req.body;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: Invalid user" });
      }

      const newCourse = new Course({
        title,
        description,
        category,
        language,
        level,
        price,
        createdBy: req.user.id, // token se mila hua user id
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });

      await newCourse.save();
      res.json({ message: "Course created successfully!", course: newCourse });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create course" });
    }
  }
);

// ENROLL student
router.post(
  "/student/enroll/:id",
  authMiddleware(["student"]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });

      if (course.students.includes(req.user.id)) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      course.students.push(req.user.id);
      await course.save();

      res.json({ message: "Enrolled successfully!", course });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Enrollment failed" });
    }
  }
);

export default router;
