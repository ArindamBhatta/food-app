import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

//multer does store the uploaded file when you use the diskStorage engine
//Storage is mandatory - Multer requires a storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extImgPath = path.extname(file.originalname); //extImgPath is the original file extension (e.g., .jpg)
    const uniqueName = `${Date.now()}${extImgPath}`;
    cb(null, uniqueName);
  },
});

// Optional: filter allowed file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

//create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
