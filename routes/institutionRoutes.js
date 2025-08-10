import express from "express";
import Institution from "../models/institutionModel.js";
import institutionProtect from '../middleware/institutionAuth.js';
import authInstitution from"../middleware/institutionAuth.js";


const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone, address, city, state, pincode, password } = req.body;

  try {
    const institution = new Institution({
      name, email, phone, address, city, state, pincode, password
    });

    const savedInstitution = await institution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const institution = await Institution.findOne({ email });
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    if (institution.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", institution });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});


// const institutionProtect = require('../middleware/institutionAuth');
// import institutionProtect from "../middleware/institutionAuth";

// GET /api/institution/profile
router.get('/profile', institutionProtect, async (req, res) => {
  res.json(req.institution);
});


// const Batch = require('../models/Batch');
// const Course = require('../models/Course');

import Batch from "../models/Batch.js";
import Course from "../models/Course.js";

// import Batch from "../models/Batch";
// import courseSchema from "../models/Course";

// POST /api/institution/batch
router.post('/batch', institutionProtect, async (req, res) => {
  const { name } = req.body;
  try {
    const batch = await Batch.create({
      name,
      institution: req.institution._id
    });
    res.json({ success: true, message: 'Batch created', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch' });
  }
});

// GET /api/institution/batches
router.get('/batches', institutionProtect, async (req, res) => {
  try {
    const batches = await Batch.find({ institution: req.institution._id }).populate('assignedCourses');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load batches' });
  }
});

router.post('/add-teacher', authInstitution, async (req, res) => {
  const teacher = new Teacher({ ...req.body, institution: req.institution.id });
  await teacher.save();
  res.json({ message: "Teacher added successfully" });
});

router.post('/add-student', authInstitution, async (req, res) => {
  const student = new Student({ ...req.body, institution: req.institution.id });
  await student.save();
  res.json({ message: "Student added successfully" });
});




export default router;

