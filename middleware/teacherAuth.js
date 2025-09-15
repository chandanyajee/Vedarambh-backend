// // // middleware/teacherAuth.js
// // import jwt from 'jsonwebtoken';
// // import Teacher from '../models/Teacher.js';

// // const teacherProtect = async (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     // 1. Token Check
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return res.status(401).json({ success: false, message: 'No token provided' });
// //     }

// //     const token = authHeader.split(' ')[1];

// //     // 2. Verify Token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teacher_secret');

// //     // 3. Attach Teacher to Request
// //     const teacher = await Teacher.findById(decoded.id).select('-password');
// //     if (!teacher) {
// //       return res.status(404).json({ success: false, message: 'Teacher not found' });
// //     }

// //     req.teacher = teacher;
// //     next();
// //   } catch (err) {
// //     console.error('Token verification failed:', err.message);
// //     res.status(401).json({ success: false, message: 'Invalid or expired token' });
// //   }
// // };

// // export default teacherProtect;

// import jwt from 'jsonwebtoken';
// import Teacher from '../models/Teacher.js';

// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const teacher = await Teacher.findById(decoded.id);
//     if (!teacher) return res.status(401).json({ message: 'Invalid token' });
//     req.user = teacher;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Auth failed' });
//   }
// };

// export default authMiddleware;
