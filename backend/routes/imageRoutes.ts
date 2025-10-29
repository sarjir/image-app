import express from "express";
import {
  createImageMetadata,
  getAllImages,
  uploadImage,
  handleUploadError
} from "../controllers/imageController.js";

export const imageRouter = express.Router();

imageRouter.route("/").get(getAllImages).post(uploadImage, handleUploadError, createImageMetadata); // What does the post api look like?
