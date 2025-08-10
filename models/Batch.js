import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;
