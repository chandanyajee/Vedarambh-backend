import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';




// import teacherRoutes from './routes/teacherRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js'
import batchRoutes from './routes/batchRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
// import teacherRoutes from './routes/teacherRoutes.js';
// import videoLibraryRoutes from './routes/videoLibraryRoutes.js';
import shortsRoutes from './routes/shortsRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';

import teacherRoutes from './routes/teacherRoutes.js';
import panchangRoute from './routes/panchangRoute.js';

import ResultRoute from './routes/results.js';

import { fileURLToPath } from 'url';

import videoLibraryRoutes from './routes/videoLibraryRoutes.js';

import studentIDRoutes from './routes/studentIDRoutes.js';

import studentIDFRoutes from './routes/studentIDRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';





// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Serve uploads folder as static


const app = express();


dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));
connectDB();

app.use(express.json());

app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// const panchangRoute = require('./routes/panchangRoute');


app.use('/uploads', express.static('uploads')); // to serve videos
// app.use('/api/videolibrary', videoLibraryRoutes); // ✅ Route prefix match hona chahiye


// ⭐ ADD THIS LINE to serve files from uploads folder
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// server.js 

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/upload', uploadRoutes);

// Middleware





app.use(cors()); // ✅ Required for frontend (React) to access backend

// app.use(cors()); // ✅ Add this line


// ✅ Test route for root
app.get('/', (req, res) => {
  res.send('VedArambh API is working!');
});


// Routes
app.use('/api/students', studentIDRoutes);

app.use('/api/panchang', panchangRoute);

app.use('/api/students', studentIDFRoutes);
app.use('/api/Result', ResultRoute);

app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', batchRoutes);
app.use('/api/institutions', institutionRoutes);
// app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher', teacherRoutes); // ⚠️ Must match frontend URL
// app.use('/api/videolibrary', videoLibraryRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/library', videoLibraryRoutes);



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vedarambh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
  









  
  
  
  
  // Serve static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

  // Start Server
  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


