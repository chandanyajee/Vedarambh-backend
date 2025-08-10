// controllers/shortsController.js
export const uploadShortVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoBuffer = req.file.buffer; // if using memoryStorage

    // Save to DB or cloud here
    return res.status(200).json({ message: 'Short video uploaded' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
