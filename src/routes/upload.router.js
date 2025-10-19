import { Router } from "express";
import { upload } from "../middleware/Multer.middleware.js";
import { handleFileUpload } from "../controllers/image.uploader.js";


const router=Router()

router.post('/image',upload.single('image'),handleFileUpload)

export default router