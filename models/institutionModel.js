import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;
