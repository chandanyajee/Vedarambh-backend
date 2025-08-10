import express from 'express';
// import { institutionProtect } from '../middleware/institutionAuth.js';
import institutionProtect from '../middleware/institutionAuth.js'; // ✅ Correct

import Batch from '../models/Batch.js';

const router = express.Router();


router.put('/batch/:batchId/assign', institutionProtect, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { assignedCourses } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { assignedCourses },
      { new: true }
    );

    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Batch assignment failed', error: err.message });
  }
});

export default router;
