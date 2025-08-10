const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  progress: { type: Number, default: 0 } // 0-100
});

module.exports = mongoose.model('Progress', progressSchema);
