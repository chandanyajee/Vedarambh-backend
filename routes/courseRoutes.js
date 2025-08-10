import express from "express"
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import studentAuth from "../middleware/studentAuth.js";

const router = express.Router();

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/course/details/:courseId', studentAuth, //isEnrolled 
 async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  res.json(course);
});
  


// module.exports = router;

export default router;