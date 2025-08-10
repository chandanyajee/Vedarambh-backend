const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: String,
  message: String,
  targetRole: { type: String, enum: ['all', 'student', 'teacher', 'institution'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
