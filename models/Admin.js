import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ✅ 1. Admin schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// ✅ 2. Model banate hain
const Admin = mongoose.model('Admin', adminSchema);

// ✅ 3. Run once to insert admin
const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: 'admin@vedarambh.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  // ✅ 4. name field bhi dena zaroori hai
  const admin = new Admin({ name: 'Super Admin', email: 'admin@vedarambh.com', password: hashedPassword });
  await admin.save();
  console.log('✅ Admin created successfully');
};

// ✅ 5. Run it only if you want to insert manually
createAdmin();

// ✅ 6. Export the model
export default Admin;

