router.post('/create', authMiddleware, async (req, res) => {
  const { courseId, questions } = req.body;
  const quiz = new Quiz({
    courseId,
    questions,
    createdBy: {
      userId: req.user.id,
      role: req.user.role
    }
  });

  await quiz.save();
  res.json({ message: "Quiz created successfully", quiz });
});

router.post('/submit', authStudent, async (req, res) => {
  const { quizId, answers } = req.body;
  const quiz = await Quiz.findById(quizId);

  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (q.correctAnswer === answers[i]) score++;
  });

  await StudentQuizResult.create({
    studentId: req.student.id,
    quizId,
    score,
    total: quiz.questions.length
  });

  res.json({ score, total: quiz.questions.length });
});

router.get('/results/student', authStudent, async (req, res) => {
  const results = await StudentQuizResult.find({ studentId: req.student.id })
    .populate('quizId', 'courseId')
    .sort({ submittedAt: -1 });

  res.json(results);
});

router.get('/leaderboard/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const results = await StudentQuizResult.find().populate('studentId', 'name').lean();

  const leaderboard = results
    .filter(r => r.quizId.courseId === courseId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Top 10

  res.json(leaderboard);
});

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

router.get('/fetch-quiz/:courseId', authStudent, async (req, res) => {
  const quiz = await Quiz.findOne({ courseId: req.params.courseId });
  const randomized = shuffleArray(quiz.questions).slice(0, 5); // 5 random
  res.json({ quizId: quiz._id, questions: randomized });
});

router.post('/submit', authStudent, async (req, res) => {
  const existing = await StudentQuizResult.findOne({
    studentId: req.student.id,
    quizId: req.body.quizId
  });

  if (existing) return res.status(400).json({ message: "You have already attempted this quiz." });

  // ... grading logic
});
