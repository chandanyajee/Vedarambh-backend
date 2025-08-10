import Course from '../models/Course.js';

const isEnrolled = async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);

  if (!course) return res.status(404).json({ message: "Course not found" });

  if (!course.enrolledStudents.includes(req.user.id)) {
    return res.status(403).json({ message: "Access denied. You are not enrolled in this course." });
  }

  next();
};

export default isEnrolled;
