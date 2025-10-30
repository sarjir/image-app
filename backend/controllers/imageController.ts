import { NextFunction, Request, Response } from "express";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import { getUploadMiddleware } from "../services/uploadService.js";
import { processAndSaveImage, getImageFormat } from "../services/imageProcessingService.js";
import { transformName, generateFilename } from "../services/nameTransformationService.js";

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
  _next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const name = req.body.name;
    const transformedName = transformName(name);
    const format = getImageFormat(req.file.mimetype);
    const filename = generateFilename(transformedName, format);
    
    const outputPath = await processAndSaveImage(
      req.file.buffer,
      filename,
      format
    );

    const metadata = await ImageMetadataModel.create({
      name: req.body.name,
      path: outputPath,
    });

    // TODO: This is what was used from the start. I should probably use it instead of outputPath above.
    // const doc = await ImageMetadataModel.create({
    //   name: req.body.name,
    //   path: `/img/${req.file.filename}`,
    // });

    return res.status(201).json({
      status: "success",
      data: {
        data: metadata, // TODO: Fix this data.data problem
      },
    });
  } catch (error) {
    _next(error);
  }
};
