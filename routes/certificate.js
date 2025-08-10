import express from 'express';

const router = express.Router();


router.get('/verify-certificate/:certId', async (req, res) => {
  const cert = await Certificate.findOne({ certId: req.params.certId });
  if (!cert) return res.status(404).json({ valid: false });
  res.json({ valid: true, student: cert.studentName, course: cert.courseTitle, date: cert.issueDate });
});


export default router;