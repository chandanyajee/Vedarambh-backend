import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  qualification: String,
  experience: String,
});

const Teacher = mongoose.model("Teacher", teacherSchema);

// ✅ Explicit default export
export default Teacher;
