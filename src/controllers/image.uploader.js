export const handleFileUpload = (req, res) => {
  try {
    
    const singleFile = req.files?.image?.[0]; // single image
    const multipleFiles = req.files?.cover_images || []; // array of images

    if (!singleFile && multipleFiles.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // URL build karo
    const imageUrl = singleFile
      ? `${req.protocol}://${req.get('host')}/uploads/${singleFile.filename}`
      : null;

    const cover_imagesUrls = multipleFiles.map(
      (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    res.status(200).json({
      success: true,
      message: 'File(s) uploaded successfully',
      image: imageUrl,
      cover_images: cover_imagesUrls,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
    });
  }
};
