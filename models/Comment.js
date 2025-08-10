const commentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' },
  onModel: { type: String, enum: ['Student', 'Teacher'] },
  text: String,
  createdAt: { type: Date, default: Date.now }
});
