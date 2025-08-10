import Institution from '../models/Institution.js';
import Course from '../models/Course.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerInstitution = async (req, res) => {
  const { name, email, password, address, contact } = req.body;

  const exists = await Institution.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Institution already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  // const institution = new Institution({
  //   name, email, password: hashedPassword, address, contact
  // });

  // await institution.save();
  // res.status(201).json({ message: 'Registered successfully, pending approval' });
};

export const loginInstitution = async (req, res) => {
  const { email, password } = req.body;
  const institution = await Institution.findOne({ email });

  if (!institution || !(await bcrypt.compare(password, institution.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  if (institution.status !== 'approved')
    return res.status(403).json({ message: 'Your account is not approved yet.' });

  const token = jwt.sign({ id: institution._id }, process.env.JWT_SECRET);
  res.json({ token });
};

export const getInstitutionDashboard = async (req, res) => {
  const courses = await Course.find({ createdBy: req.user.id });
  res.json({ message: 'Institution Dashboard', totalCourses: courses.length });
};

export const getInstitutionCourses = async (req, res) => {
  const courses = await Course.find({ createdBy: req.user.id });
  res.json(courses);
};

export const manageBatches = async (req, res) => {
  // Mock response (You can create a Batch model later)
  res.json([
    { name: 'Batch A', students: 20 },
    { name: 'Batch B', students: 15 }
  ]);
};
