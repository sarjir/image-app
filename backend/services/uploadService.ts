import multer from "multer";
import { Request } from "express";

const allowedTypes = ["image/jpeg", "image/png"];
const storage = multer.memoryStorage();

export const getUploadMiddleware = () => {
  return multer({
    storage,
    fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG and PNG files are allowed"));
      }
    },
  }).single("photo");
};

export const isMulterError = (error: Error): boolean => {
  return error instanceof multer.MulterError;
};