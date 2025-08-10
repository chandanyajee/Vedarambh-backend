// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
