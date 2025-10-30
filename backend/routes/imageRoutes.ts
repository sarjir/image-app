import express from "express";
import {
  createImageMetadata,
  getAllImages,
  uploadImage,
  handleUploadError
} from "../controllers/imageController.js";

export const imageRouter = express.Router();

imageRouter.get("/", getAllImages);

imageRouter.post("/", uploadImage, handleUploadError, createImageMetadata);