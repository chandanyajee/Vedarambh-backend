import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // To load email/password from .env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // e.g. admin@vedarambh.com
    pass: process.env.EMAIL_PASS,  // App password, not your Gmail password
  },
});

const sendEmail = async (to, subject, body) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    });
    console.log(`📨 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Failed to send email', err);
  }
};

export default sendEmail;
