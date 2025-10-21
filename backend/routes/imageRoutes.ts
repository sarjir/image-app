import express from "express";
import {
  createImageMetadata,
  getAllImages,
  uploadImage,
} from "../controllers/imageController.js";

export const imageRouter = express.Router();

imageRouter.route("/").get(getAllImages).post(uploadImage, createImageMetadata);
