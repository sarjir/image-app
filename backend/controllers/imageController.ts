import { NextFunction, Request, Response } from "express";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import { getUploadMiddleware, validateUploadRequest } from "../services/uploadService.js";
import { handleImageProcessingWorkflow } from "../services/imageProcessingService.js";
import { createImageMetadata as createMetadata } from "../services/metadataService.js";

export const uploadImage = getUploadMiddleware();

export const handleUploadError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === "Only JPEG and PNG files are allowed") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid file format",
    });
  }
  next(err);
};

export const getAllImages = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const data = await ImageMetadataModel.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

export const createImageMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageData = validateUploadRequest(req);
    const outputPath = await handleImageProcessingWorkflow(imageData);

    const result = await createMetadata({
      name: imageData.name,
      path: outputPath,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
