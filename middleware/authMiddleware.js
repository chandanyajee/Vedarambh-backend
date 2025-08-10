import Student from '../models/Student.js';
import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.student = await Student.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token failed' });
  }
};

// module.exports = protect;

export default protect; // ✅ default export