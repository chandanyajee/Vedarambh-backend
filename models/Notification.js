const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' },
  onModel: { type: String, enum: ['Student', 'Teacher'] },
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Notification', notificationSchema);
