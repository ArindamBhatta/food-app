import multer from "multer";
import path from "path";
import { Request } from "express";

// Configure storage (destination + filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extImgPath = path.extname(file.originalname);
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
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
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
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
