import mongoose from 'mongoose';
// ✅ ESM Syntax

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  institution: { type: String },
  class: { type: String },
  
  // ✅ Add batch and courses properly inside schema
  batch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

// ✅ Export correctly
const Student = mongoose.model('Student', studentSchema);
export default Student;

