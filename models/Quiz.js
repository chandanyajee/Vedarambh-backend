import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdBy: {
    userId: String,
    role: { type: String, enum: ['teacher', 'admin'] }
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ]
}, { timestamps: true });



router.post('/submit-quiz', authStudent, async (req, res) => {
  const { quizId, answers } = req.body;
  const quiz = await Quiz.findById(quizId);
  let score = 0;
  
  quiz.questions.forEach((q, i) => {
    if (q.correctAnswer === answers[i]) score++;
  });
  
  res.json({ message: "Quiz submitted", score, total: quiz.questions.length });
});


// module.exports = mongoose.model('Quiz', quizSchema);
// export default Quiz;
export default mongoose.model("Quiz", quizSchema);