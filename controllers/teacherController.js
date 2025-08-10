import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';

// 🔹 Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const { name, email, phone, password, subject, mode } = req.body;

    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: 'Teacher already registered with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      phone,
      password: hashedPassword,
      subject,
      mode,
      // status: 'approved' // ✅ optional if status is in schema
    });

    await teacher.save();
    res.status(201).json({ message: 'Teacher registered successfully', teacher });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 🔹 Login Teacher (without admin approval check)
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ No status check here
    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, teacher });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};



// import Teacher, { findOne } from '../models/Teacher';

// const registerTeacher = async (req, res) => {
//   try {
//     const { name, email, phone, subject, mode } = req.body;

//     const teacherExists = await findOne({ email });
//     if (teacherExists) {
//       return res.status(400).json({ message: 'Teacher already registered with this email' });
//     }

//     // const teacher = new Teacher({ name, email, phone, subject, mode });
//     // await teacher.save();

//     // res.status(201).json({ message: 'Teacher registered successfully', teacher });
//   } catch (error) {
//     console.error('Registration Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export default { registerTeacher };

// import Teacher from '../models/Teacher.js';
// import Course from '../models/Course.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export const registerTeacher = async (req, res) => {
//   const { name, email, password, qualification, experience } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   const teacher = new Teacher({ name, email, password: hashed, qualification, experience });
//   await teacher.save();
//   res.status(201).json({ message: 'Teacher registered' });
// };

// export const loginTeacher = async (req, res) => {
//   const { email, password } = req.body;
//   const teacher = await Teacher.findOne({ email });
//   if (!teacher || !(await bcrypt.compare(password, teacher.password)))
//     return res.status(401).json({ message: 'Invalid credentials' });

//   const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);
//   res.json({ token });
// };

// export const getTeacherDashboard = async (req, res) => {
//   const teacher = await Teacher.findById(req.user.id).select('-password');
//   const courses = await Course.find({ createdBy: req.user.id });
//   res.json({ teacher, courses });
// };

// export const addCourse = async (req, res) => {
//   const { title, description, category, status } = req.body;
//   const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
//   const course = new Course({ title, description, category, status, fileUrl, createdBy: req.user.id });
//   await course.save();
//   res.status(201).json({ message: 'Course created', course });
// };

// export const getMyCourses = async (req, res) => {
//   const courses = await Course.find({ createdBy: req.user.id });
//   res.json({ courses });
// };

// export const deleteCourse = async (req, res) => {
//   await Course.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
//   res.json({ message: 'Course deleted' });
// };

// export const updateCourse = async (req, res) => {
//   const { title, description, category, status } = req.body;
//   const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

//   const update = { title, description, category, status };
//   if (fileUrl) update.fileUrl = fileUrl;

//   const updated = await Course.findOneAndUpdate(
//     { _id: req.params.id, createdBy: req.user.id },
//     update,
//     { new: true }
//   );
//   res.json({ message: 'Course updated', updated });
// };
