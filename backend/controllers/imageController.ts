import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import path from "path";

const IMG_DIRECTORY_PATH = "public/img"; // TODO: How should I handle this path more elegantly?

const storage = multer.memoryStorage();
export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) { // TODO: Make this look neater
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
}).single("photo");

export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err instanceof multer.MulterError)
  if (err.message === "Only JPEG and PNG files are allowed") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid file format"
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
    const transformedName = name
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/ /g, "-")
      .substring(0, 10);
    const timestamp = Date.now(); // TODO: is there a better way to timestamp?
    const format = req.file.mimetype.includes("png") ? "png" : "jpeg"; // TODO: This seems a bit odd
    const filename = `${transformedName}-${timestamp}.${format}`;
    const outputPath = path.join(IMG_DIRECTORY_PATH, filename);

    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: "contain",
      })
      .toFormat(format as keyof sharp.FormatEnum, { quality: 80 }) // Only use what is necessary
      .toFile(outputPath);

    const metadata = await ImageMetadataModel.create({
      name: req.body.name,
      path: outputPath,
    });

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

function checkIfInvalidFileFormat(filename: string): boolean {
  const extension = filename.split(".").pop(); // Is there a better way to get the extension? It is not immutable
  const validExtensions = ["jpg", "jpeg", "png"];

  return extension ? !validExtensions.includes(extension) : false; // should I do something about this false case?
}
