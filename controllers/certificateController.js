import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateCertificate = async (req, res) => {
  const { studentName, courseTitle } = req.body;

  const doc = new PDFDocument();
  const certPath = `certificates/${studentName}_${Date.now()}.pdf`;
  const stream = fs.createWriteStream(certPath);

  doc.pipe(stream);
  doc.fontSize(25).text('VedArambh Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`This certifies that ${studentName} has successfully completed the course "${courseTitle}".`, {
    align: 'center',
  });

  doc.end();

  stream.on('finish', () => {
    res.json({ success: true, path: certPath });
  });
};
