import express from 'express';
import PDFDocument from 'pdfkit';
import StudentQuizResult from '../models/StudentQuizResult.js';
import Student from '../models/Student.js';

const router = express.Router();

router.get('/export-pdf/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const results = await StudentQuizResult.find({ studentId: req.params.studentId }).populate('quizId');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${student.name}_results.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`Student Result Report: ${student.name}`, { align: 'center' }).moveDown();

    results.forEach((r, i) => {
      doc.fontSize(14).text(`${i + 1}. Quiz: ${r.quizId.courseId}`);
      doc.text(`   Score: ${r.score}/${r.total}`);
      doc.text(`   Date: ${new Date(r.submittedAt).toLocaleString()}`).moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
});

export default router;
