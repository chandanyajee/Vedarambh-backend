import express from "express"
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
// import protect from '../middleware/studentAuth.js';
import Batch from '../models/Batch.js';
import studentProtect from '../middleware/studentAuth.js';
import authMiddleware from "../middleware/teacherAuth.js";




const router = express.Router();



// ✅ Assigned Courses Route
router.get('/assigned-courses', studentProtect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).populate('batch');
    if (!student || !student.batch) return res.json([]);

    const batch = await Batch.findById(student.batch._id).populate('assignedCourses');
    res.json(batch.assignedCourses || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assigned courses' });
  }
});





// POST /api/student/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.json({ success: false, message: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});





// const bcrypt = require('bcryptjs');

// POST /api/student/register
router.post('/register', async (req, res) => {
  const { name, email, password, institution, class: studentClass } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: 'Student already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      institution,
      class: studentClass,
    });

    await newStudent.save();

    res.json({ success: true, message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// GET /api/student/profile
router.get('/profile', studentProtect, async (req, res) => {
  res.json(req.student);
});



// PUT /api/student/profile
router.put('/profile', studentProtect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const { name, institution, class: studentClass } = req.body;

    student.name = name || student.name;
    student.institution = institution || student.institution;
    student.class = studentClass || student.class;

    await student.save();

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




import Course from  '../models/Course.js'

// const Course = require('../models/Course');
// const Student = require('../models/Student');

// POST /api/student/enroll/:id
router.post('/enroll/:id', studentProtect, async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.student._id;

  try {
    const student = await Student.findById(studentId);
    if (!student.courses.includes(courseId)) {
      student.courses.push(courseId);
      await student.save();
      res.json({ message: 'Course enrolled successfully' });
    } else {
      res.json({ message: 'Already enrolled in this course' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/student/my-courses
router.get('/my-courses', studentProtect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).populate('courses');
    res.json(student.courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// /api/auth/forgot-password

import sendEmail from "../utils/sendEmail.js";
// import Student from "../models/Student.js";

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await Student.findOne({ email }); // change for other roles
  if (!user) return res.json({ message: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await sendEmail(email, 'Reset your VedArambh password', `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`);

  res.json({ message: 'Reset link sent to your email' });
});


// /reset-password/:token

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Student.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid link' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});



import PDFDocument from 'pdfkit'

// const PDFDocument = require('pdfkit');
// const Course = require('../models/Course');
// const Student = require('../models/Student');
// GET Certificate PDF
router.get('/certificate/:courseId', studentProtect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    const course = await Course.findById(req.params.courseId);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${course.title}-certificate.pdf"`);

    doc.fontSize(26).text('Certificate of Completion', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(18).text(`Presented to`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(22).fillColor('blue').text(`${student.name}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(18).fillColor('black').text(`for successfully completing the course`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(20).text(`${course.title}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Certificate generation failed' });
  }
});



// GET All Published Courses (public)
router.get('/course/public', async (req, res) => {
  const courses = await Course.find({ status: 'published' });
  res.json(courses);
});

// ENROLL in Course
router.post('/enroll/:courseId', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (course.enrolledStudents.includes(req.user.id))
    return res.status(400).json({ message: 'Already enrolled' });

  course.enrolledStudents.push(req.user.id);
  await course.save();

  const student = await Student.findById(req.user.id);
  student.courses.push(course._id);
  await student.save();

  res.json({ message: 'Enrollment successful' });
});


// POST /api/student/progress/:courseId
router.post('/progress/:courseId', authMiddleware, async (req, res) => {
  const { progress } = req.body;
  let entry = await Progress.findOne({ student: req.user.id, course: req.params.courseId });

  if (!entry) {
    entry = new Progress({ student: req.user.id, course: req.params.courseId });
  }

  entry.progress = progress;
  await entry.save();
  res.json({ message: 'Progress updated', progress: entry });
});

// GET /api/student/progress/:courseId
router.get('/progress/:courseId', authMiddleware, async (req, res) => {
  const entry = await Progress.findOne({ student: req.user.id, course: req.params.courseId });
  res.json(entry || { progress: 0 });
});


// POST /api/student/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 👇 yeh jaruri hai!
    res.json({
      token,
      name: student.name,
      message: 'Login successful',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// module.exports = router;
export default router; // ✅ default export


