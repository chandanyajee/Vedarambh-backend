import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/today', async (req, res) => {
  try {
    const response = await axios.get('https://amritkalash.in/api/todayPanchang');
    res.json(response.data);
  } catch (err) {
    console.error('Panchang Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Panchang' });
  }
});

export default router;

