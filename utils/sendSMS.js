// backend/utils/sendSMS.js
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_NUMBER,
      to,
    });
    console.log('📱 SMS sent:', message.sid);
  } catch (err) {
    console.error('❌ Failed to send SMS:', err.message);
  }
};

export default sendSMS;
