// Update progress when student watches content
router.post('/course/progress', authStudent, async (req, res) => {
  const { courseId, percentage } = req.body;
  await Progress.updateOne(
    { student: req.student.id, course: courseId },
    { $set: { percentage } },
    { upsert: true }
  );
  res.json({ message: "Progress updated" });
});
