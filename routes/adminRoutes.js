import express from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Course from '../models/Course.js';
import Student from "../models/Student.js";
import Teacher from '../models/Teacher.js';
import Institution from "../models/institutionModel.js";
import adminProtect from "../middleware/adminAuth.js";
import authAdmin from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/teacherAuth.js";

// import { adminProtect } from '../middleware/adminAuth';
// import User from '../models/User.js'; // If you have a unified User model
// import verifyAdmin from '../middleware/verifyAdmin.js';


const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.json({ success: false, message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'admin_secret', {
      expiresIn: '7d'
    });

    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// ✅ Sahi (ES Module me extension dena hi padega)
// import adminProtect  from '../middleware/adminAuth.js';

// GET /api/admin/overview
router.get('/overview', adminProtect, async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const teachers = await Teacher.countDocuments();
    const institutions = await Institution.countDocuments();

    res.json({ students, teachers, institutions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load overview' });
  }
});



// // GET unverified institutions
// router.get('/institutions/pending', adminProtect, async (req, res) => {
//   const list = await Institution.find({ isVerified: false });
//   res.json(list);
// });

// // GET unverified teachers
// router.get('/teachers/pending', adminProtect, async (req, res) => {
//   const list = await Teacher.find({ isVerified: false });
//   res.json(list);
// });

// // GET unverified students
// router.get('/students/pending', adminProtect, async (req, res) => {
//   const list = await Student.find({ isVerified: false });
//   res.json(list);
// });

// // backend/routes/admin.js
// router.get('/pending-students', authMiddleware, async (req, res) => {
//   const pendingStudents = await Student.find({ status: 'pending' });
//   res.json(pendingStudents);
// });


// PUT approve any user by ID and type
router.put('/verify/:type/:id', adminProtect, async (req, res) => {
  const { type, id } = req.params;
  let model;

  if (type === 'teacher') model = Teacher;
  else if (type === 'institution') model = Institution;
  else if (type === 'student') model = Student;
  else return res.status(400).json({ message: 'Invalid type' });

  try {
    const user = await model.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();
    res.json({ message: `${type} verified successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
});


// import Course from "../models/Course";

// GET /api/admin/courses
router.get('/courses', adminProtect, async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', adminProtect, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// PUT /api/admin/change-password
router.put('/change-password', adminProtect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin._id);
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.json({ message: 'Old password is incorrect' });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

export const getAdminOverview = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const institutionCount = await Institution.countDocuments();
    const courseCount = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });

    res.json({
      students: studentCount,
      teachers: teacherCount,
      institutions: institutionCount,
      courses: courseCount,
      activeCourses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPaginatedUsers = async (req, res) => {
  const { role, page = 1, limit = 10, search = '' } = req.query;
  const skip = (page - 1) * limit;
  let users = [];
  let total = 0;

  try {
    if (role === 'student' || !role) {
      const query = { name: { $regex: search, $options: 'i' } };
      const data = await Student.find(query).skip(skip).limit(limit);
      const count = await Student.countDocuments(query);
      users = [...users, ...data.map(d => ({ name: d.name, role: 'Student', status: d.status }))];
      total += count;
    }
    if (role === 'teacher' || !role) {
      const query = { name: { $regex: search, $options: 'i' } };
      const data = await Teacher.find(query).skip(skip).limit(limit);
      const count = await Teacher.countDocuments(query);
      users = [...users, ...data.map(d => ({ name: d.name, role: 'Teacher', status: d.status }))];
      total += count;
    }
    if (role === 'institution' || !role) {
      const query = { name: { $regex: search, $options: 'i' } };
      const data = await Institution.find(query).skip(skip).limit(limit);
      const count = await Institution.countDocuments(query);
      users = [...users, ...data.map(d => ({ name: d.name, role: 'Institution', status: d.status }))];
      total += count;
    }

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// backend/middleware/authMiddleware.js
export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Dummy check – replace with real JWT logic
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Unauthorized Admin' });
  }

  next();
};


// GET /api/admin/users?role=student&page=1&limit=10&search=John
router.get('/users', verifyAdmin, async (req, res) => {
  const { role, page = 1, limit = 10, search = '' } = req.query;
  const query = {};

  if (role) query.role = role;
  if (search) query.name = { $regex: search, $options: 'i' };

  try {
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});


// PATCH /api/admin/user/:id/toggle-status
router.patch('/user/:id/toggle-status', verifyAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  await user.save();
  res.json({ message: 'Status updated', status: user.status });
});

// DELETE /api/admin/user/:id
router.delete('/user/:id', verifyAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'User deleted' });
});


router.get('/analytics',  authAdmin, async (req, res) => {
  const [students, teachers, institutions, courses] = await Promise.all([
    Student.countDocuments(), Teacher.countDocuments(),
    Institution.countDocuments(), Course.countDocuments()
  ]);

  const courseStats = await Course.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  res.json({ students, teachers, institutions, courses, courseStats });
});


export default router;
// module.exports = router;

