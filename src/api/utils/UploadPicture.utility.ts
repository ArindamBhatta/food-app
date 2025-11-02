import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Fast, simple, secure, works in serverless, no cleanup needed
export const uploadBuffer = async (
  file: Express.Multer.File,
  cloudinaryFolderName: string
) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: cloudinaryFolderName }, // folder name in cloudinary
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer); // push the Buffer to Cloudinary
  });
};

export default cloudinary;
