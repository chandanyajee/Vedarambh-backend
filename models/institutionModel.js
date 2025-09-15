// models/institutionModel.js
import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;   // ✅ ab default export ho gaya
