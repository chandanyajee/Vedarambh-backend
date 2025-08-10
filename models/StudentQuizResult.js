import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const StudentQuizResult = mongoose.model('StudentQuizResult', resultSchema);

export default StudentQuizResult;
