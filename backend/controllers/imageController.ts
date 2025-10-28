import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
// import SharpMulter from "sharp-multer";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import path from "path";
// import { mkdir } from "fs/promises";
// import path from "path";

const IMG_DIRECTORY_PATH = "public/img";

// const multerStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, IMG_DIRECTORY_PATH);
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `${req.body.name}.${extension}`);
//   },
// });

// const upload = multer({
//   storage: multerStorage,
// });

// Configure multer storage
const storage = multer.memoryStorage(); // Store file in memory for processing
export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'));
    }
  }
}).single('photo'); // Specify that we're expecting a single file with field name 'photo'

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

// export const uploadImage = upload.single("photo");

export const createImageMetadata = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // if (!req.file) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "No file uploaded",
  //   });
  // }

  // if (checkIfInvalidFileFormat(req.file.filename)) {
  // console.log('req.file.filename', req.file.filename);

  //   return res.status(400).json({
  //     status: "fail",
  //     message: "Invalid file format",
  //   });
  // }

  // const doc = await ImageMetadataModel.create({
  //   name: req.body.name,
  //   path: `/img/${req.file.filename}`,
  // });

  // if (!doc) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "invalid input",
  //   });
  // }

  // return res.status(201).json({
  //   status: "success",
  //   data: {
  //     data: doc,
  //   },
  // });

    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }
  
      const timestamp = Date.now();
      const format = req.file.mimetype.includes('png') ? 'png' : 'jpeg';
      const filename = `image_${timestamp}.${format}`;
      const outputPath = path.join(IMG_DIRECTORY_PATH, filename);
  
      // Process image with sharp
      await sharp(req.file.buffer)
        .resize(400, 400, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFormat(format as keyof sharp.FormatEnum, { quality: 80 })
        .toFile(outputPath);
  
      // Save metadata to database
      const metadata = await ImageMetadataModel.create({
        // filename,
        // originalName: req.file.originalname,
        // mimeType: req.file.mimetype,
        // size: req.file.size,
        name: req.body.name,
        path: outputPath
      });
  
      // res.json({
      //   message: 'Image uploaded successfully',
      //   metadata
      // });

        const doc = await ImageMetadataModel.create({
    name: req.body.name,
    path: `/img/${req.file.filename}`,
  });

      return res.status(201).json({
        status: "success",
        data: {
          data: metadata,
        },
      });
    } catch (error) {
      _next(error);
    }
};

function checkIfInvalidFileFormat(filename: string): boolean {
  const extension = filename.split(".").pop(); // Is there a better way to get the extension? It is not immutable
  const validExtensions = ["jpeg", "png"];

  return extension ? !validExtensions.includes(extension) : false; // should I do something about this false case?
}
