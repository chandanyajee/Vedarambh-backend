import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  qualification: String,
  experience: String,
  // status: { type: String, default: 'pending' }
});

export default mongoose.model('Teacher', teacherSchema);
