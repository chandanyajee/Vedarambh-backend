import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await Student.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Student already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = new Student({ name, email, password: hashedPassword });
  await student.save();
  res.status(201).json({ message: 'Registered successfully' });
};

export const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student || !(await bcrypt.compare(password, student.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
  res.json({ token });
};

export const studentDashboard = async (req, res) => {
  const student = await Student.findById(req.user.id).populate('enrolledCourses');
  res.json({ enrolledCourses: student.enrolledCourses });
};

export const enrollCourse = async (req, res) => {
  const student = await Student.findById(req.user.id);
  if (!student.enrolledCourses.includes(req.params.courseId)) {
    student.enrolledCourses.push(req.params.courseId);
    await student.save();
  }
  res.json({ message: 'Course enrolled' });
};

export const getMyCourses = async (req, res) => {
  const student = await Student.findById(req.user.id).populate('enrolledCourses');
  res.json(student.enrolledCourses);
};

export const getCertificate = async (req, res) => {
  const certificate = await Certificate.findOne({
    student: req.user.id,
    course: req.params.courseId
  });
  res.json(certificate || {});
};

export const saveProgress = async (req, res) => {
  const { progress } = req.body;
  let entry = await Progress.findOne({ student: req.user.id, course: req.params.courseId });

  if (!entry) {
    entry = new Progress({ student: req.user.id, course: req.params.courseId });
  }

  entry.progress = progress;
  await entry.save();
  res.json({ message: 'Progress updated', progress: entry });
};

export const getProgress = async (req, res) => {
  const entry = await Progress.findOne({ student: req.user.id, course: req.params.courseId });
  res.json(entry || { progress: 0 });
};
