import express from 'express';
import Student from '../models/studentIDModel.js';

const router = express.Router();

// ✅ Manual Registration Route
router.post('/register', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
