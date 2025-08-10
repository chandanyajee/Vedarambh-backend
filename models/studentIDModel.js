import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNo: String,
  admissionNo: String,
  name: String,
  fatherName: String,
  mobile: String,
  dob: String,
  address: String,
  email: { type: String, unique: true }
});


const StudentID = mongoose.model('StudentID', studentSchema);

export default StudentID;
