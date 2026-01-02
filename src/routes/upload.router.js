import { Router } from 'express';
import { upload } from '../middleware/Multer.middleware.js';
import { handleFileUpload } from '../controllers/image.uploader.js';

const router = Router();

// multiple keys handle karne ke liye
router.post(
  '/image',
  upload.fields([
    { name: 'image', maxCount: 1 }, // single image
    { name: 'cover_images', maxCount: 10 }, // multiple images
  ]),
  handleFileUpload,
);

export default router;
