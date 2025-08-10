// run once to insert admin
// const bcrypt = require('bcryptjs');
// const Admin = require('./models/Admin');

import bcrypt from 'bcryptjs';
import Admin from '../models/Admin'

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = new Admin({ email: 'admin@vedarambh.com', password: hashedPassword });
  await admin.save();
  console.log('Admin created');
};

createAdmin();
