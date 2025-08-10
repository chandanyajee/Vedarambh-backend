import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js"; // ✅ Import course model
import teacherProtect from '../middleware/teacherAuth.js'; // ✅ Middleware

const router = express.Router();

// Multer Setup
const upload = multer({ dest: "uploads/" });

// ✅ Teacher Registration
router.post(
  "/register",
  upload.fields([
    { name: "profilePhoto" },
    { name: "qualificationCert" },
    { name: "idProof" },
  ]),
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        mobile,
        dob,
        gender,
        qualification,
        subjects,
        teachingMode,
        experience,
        state,
        city,
        pincode,
        bio,
        availabilitySlots,
        password,
      } = req.body;

      const existing = await Teacher.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newTeacher = new Teacher({
        fullName,
        email,
        password: hashedPassword,
        mobile,
        dob,
        gender,
        qualification,
        subjects: subjects?.split(","),
        teachingMode,
        experience,
        location: { state, city, pincode },
        profilePhoto: req?.files?.profilePhoto?.[0]?.path || "",
        qualificationCert: req?.files?.qualificationCert?.[0]?.path || "",
        idProof: req?.files?.idProof?.[0]?.path || "",
        bio,
        availabilitySlots: availabilitySlots?.split(","),
      });

      await newTeacher.save();
      res.status(201).json({ success: true, message: "Registration submitted!" });
    } catch (err) {
      console.error("Teacher Register Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ✅ Teacher Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.json({ success: false, message: 'Email not registered' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    // if (!teacher.isVerified) {
    //   return res.json({ success: false, message: 'Account not yet verified by admin' });
    // }
    
    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET || 'teacher_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      teacher: {
        name: teacher.fullName,
        email: teacher.email,
        qualification: teacher.qualification,
        experience: teacher.experience
      }
    });
  } catch (err) {
    console.error("Teacher Login Error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Dashboard Route
router.get('/dashboard', teacherProtect, async (req, res) => {
  try {
    const teachercourses = await Course.find({ teacher: req.teacher._id });
    res.json({
      teacher: req.teacher,
      courses: teachercourses
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create Course
router.post('/courses', teacherProtect, async (req, res) => {
  const { title, description, content } = req.body;

  if (!title || !description || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const course = await Course.create({
      title,
      description,
      content,
      teacher: req.teacher._id
    });

    res.json({ success: true, message: 'Course created successfully', course });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ My Courses
router.get('/my-courses', teacherProtect, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.teacher._id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete Course
router.delete('/courses/:id', teacherProtect, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found or unauthorized' });

    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update Course
router.put('/courses/:id', teacherProtect, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, content } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.content = content || course.content;

    await course.save();
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ Get Course by ID
router.get('/courses/:id', teacherProtect, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
