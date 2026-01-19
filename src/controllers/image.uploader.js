// export const handleFileUpload = (req, res) => {
//   try {

//     const singleFile = req.files?.image?.[0]; // single image
//     const multipleFiles = req.files?.cover_images || []; // array of images

//     if (!singleFile && multipleFiles.length === 0) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // URL build karo
//     const imageUrl = singleFile
//       ? `${req.protocol}://${req.get('host')}/uploads/${singleFile.filename}`
//       : null;

//     const cover_imagesUrls = multipleFiles.map(
//       (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
//     );

//     res.status(200).json({
//       success: true,
//       message: 'File(s) uploaded successfully',
//       image: imageUrl,
//       images: cover_imagesUrls,
//     });
//   } catch (error) {
//     console.error('Upload Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'File upload failed',
//     });
//   }
// };

import streamifier from 'streamifier';
import cloudinary from '../utils/cloudinary.js';

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const handleFileUpload = async (req, res) => {
  try {
    const singleFile = req.files?.image?.[0];
    const multipleFiles = req.files?.cover_images || [];

    if (!singleFile && multipleFiles.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let image = null;
    let images = [];

    // single image upload
    if (singleFile) {
      const result = await uploadToCloudinary(singleFile, 'images');
      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // multiple images upload
    if (multipleFiles.length > 0) {
      for (const file of multipleFiles) {
        const result = await uploadToCloudinary(file, 'cover_images');
        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'File(s) uploaded successfully',
      image,
      images,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
    });
  }
};
