export const handleFileUpload = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // URL build karo — /uploads folder ko static serve kiya hai app.js mein
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
    });
  }
};
