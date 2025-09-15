import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js"; // agar tum course model banaye ho
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 Teacher Signup
export const signupTeacher = async (req, res) => {
  try {
    const { name, email, password, qualification, experience } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      qualification,
      experience,
    });

    await teacher.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Teacher Login
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: "teacher", name: teacher.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Teacher Create Course
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = new Course({
      title,
      description,
      teacher: req.user.id, // jo login hai uska ID aa jayega
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
