import express from "express" ;
import router from "../routes/studentRoutes.js";
import Contact from '../models/Contact.js'


// POST /api/public/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });

  await Contact.create({ name, email, message });
  res.json({ message: 'Message received' });
});


export default router;


