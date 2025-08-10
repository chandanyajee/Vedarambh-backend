// const jwt = require('jsonwebtoken');
// const Admin = require('../models/Admin');

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const adminProtect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin_secret');
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// module.exports = adminProtect;

export default adminProtect; 
