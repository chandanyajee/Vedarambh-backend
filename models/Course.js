// import mongoose from 'mongoose';

// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   price: Number,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   institution: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Institution',
//   },

//   fileUrl: String,
// status: {
//   type: String,
//   enum: ['draft', 'published'],
//   default: 'draft'
// }

// });

// enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]


// const Course = mongoose.model('Course', courseSchema);
// export default Course;

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: { type: String, default: 'draft' },
  fileUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
