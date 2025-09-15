import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Institution from "../models/institutionModel.js";

import adminProtect from "../middleware/adminAuth.js";


const router = express.Router();
/**
 * @route POST /api/admin/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "admin_secret", {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/admin/overview
 */
router.get("/overview", adminProtect, async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const teachers = await Teacher.countDocuments();
    const institutions = await Institution.countDocuments();
    const courses = await Course.countDocuments();

    res.json({ students, teachers, institutions, courses });
  } catch (err) {
    res.status(500).json({ message: "Failed to load overview" });
  }
});

/**
 * @route PUT /api/admin/verify/:type/:id
 */
router.put("/verify/:type/:id", adminProtect, async (req, res) => {
  const { type, id } = req.params;
  let model;

  if (type === "teacher") model = Teacher;
  else if (type === "institution") model = Institution;
  else if (type === "student") model = Student;
  else return res.status(400).json({ message: "Invalid type" });

  try {
    const user = await model.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();
    res.json({ message: `${type} verified successfully` });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

/**
 * @route GET /api/admin/courses
 */
router.get("/courses", adminProtect, async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to load courses" });
  }
});

/**
 * @route DELETE /api/admin/courses/:id
 */
router.delete("/courses/:id", adminProtect, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/**
 * @route PUT /api/admin/change-password
 */
router.put("/change-password", adminProtect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin._id);
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * @route GET /api/admin/analytics
 */
router.get("/analytics", adminProtect, async (req, res) => {
  try {
    const [students, teachers, institutions, courses] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Institution.countDocuments(),
      Course.countDocuments(),
    ]);

    const courseStats = await Course.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    res.json({ students, teachers, institutions, courses, courseStats });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
});

export default router;
