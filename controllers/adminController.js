import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Institution from '../models/Institution.js';
import Course from '../models/Course.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
};

export const getOverviewStats = async (req, res) => {
  const students = await Student.countDocuments();
  const teachers = await Teacher.countDocuments();
  const institutions = await Institution.countDocuments();
  const courses = await Course.countDocuments();
  res.json({ students, teachers, institutions, courses });
};

export const getAllUsers = async (req, res) => {
  const { role = '', search = '', page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  let Model;
  if (role === 'student') Model = Student;
  else if (role === 'teacher') Model = Teacher;
  else if (role === 'institution') Model = Institution;
  else Model = [Student, Teacher, Institution];

  const users = await (Array.isArray(Model)
    ? Promise.all(Model.map(M => M.find({ name: { $regex: search, $options: 'i' } })))
    : Model.find({ name: { $regex: search, $options: 'i' } }).skip(skip).limit(limit));

  const flatUsers = Array.isArray(users[0]) ? users.flat() : users;
  res.json({ users: flatUsers, pages: 1 }); // update pages as needed
};

export const updateUserStatus = async (req, res) => {
  const { role, status } = req.body;
  const { id } = req.params;
  let Model;

  if (role === 'student') Model = Student;
  else if (role === 'teacher') Model = Teacher;
  else if (role === 'institution') Model = Institution;
  else return res.status(400).json({ message: 'Invalid role' });

  const updated = await Model.findByIdAndUpdate(id, { status }, { new: true });
  res.json({ message: 'Status updated', updated });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  await Teacher.findByIdAndDelete(id);
  await Institution.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
};

export const broadcastMessage = async (req, res) => {
  const { subject, message } = req.body;
  // This is where you'd use email/SMS integration
  res.json({ message: 'Broadcast sent (mock)' });
};
