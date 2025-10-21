import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";

const IMG_DIRECTORY_PATH = "public/img";

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${req.body.name}.${extension}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

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

export const uploadImage = upload.single("photo");

export const createImageMetadata = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "No file uploaded",
    });
  }

  const doc = await ImageMetadataModel.create({
    name: req.body.name,
    path: `/img/${req.file.filename}`,
  });

  if (!doc) {
    return res.status(400).json({
      status: "fail",
      message: "invalid input",
    });
  }

  return res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};
