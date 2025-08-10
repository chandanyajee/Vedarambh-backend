import { findOne, create } from '../models/studentModel';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register Student
export async function registerStudent(req, res) {
  const { name, email, mobile, password } = req.body;
  try {
    const userExists = await findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await hash(password, 10);
    const student = await create({ name, email, mobile, password: hashedPassword });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token: generateToken(student._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Login Student
export async function loginStudent(req, res) {
  const { email, password } = req.body;
  try {
    const student = await findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid Email or Password' });

    const isMatch = await compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token: generateToken(student._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
