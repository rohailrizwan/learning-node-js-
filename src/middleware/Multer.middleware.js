import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload_dir = path.join(__dirname,"../../public/uploads")

if(!fs.existsSync(upload_dir)){
  fs.mkdirSync(upload_dir,{recursive:true})
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_dir); // store inside /public/uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
