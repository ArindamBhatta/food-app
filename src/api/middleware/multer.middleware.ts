import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

//Using memoryStorage to keep files in buffer for Cloudinary upload
//This avoids saving files locally and provides file.buffer for cloud upload

// Use memory storage for Cloudinary uploads (keeps file in buffer)
const storage = multer.memoryStorage();

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
