import { NextFunction, Request, Response } from "express";
import multer from "multer";
// import sharp from "sharp";
// import SharpMulter from "sharp-multer";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
// import { mkdir } from "fs/promises";
// import path from "path";

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

// const getFileFormat = (mimetype: string)=> {
//   const format = mimetype.split('/')[1];
// };

// const storage = SharpMulter({
//   destination: (_req, _file, cb) => {
//     cb(null, IMG_DIRECTORY_PATH);
//   },
//   imageOptions: {
//     resize: { width: 400, height: 400 },
//     // quality: 80
//   },
//   filename: (_originalname, options, req) => {
//     const file = req?.file;
//     const format = file ? getFileFormat(file.mimetype) : 'jpg';
//     console.log(format, 'format');
//     // const timestamp = Date.now();
//     // return `image_${timestamp}.${format}`;
//     return `${_originalname}.${format}`;
//   }
// });

// const upload = multer({ 
//   storage,
//   // fileFilter: (_req, file, cb) => {
//   //   // Accept only jpeg/jpg and png
//   //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//   //     cb(null, true); // what does this do?
//   //   } else {
//   //     cb(new Error('Only JPEG and PNG files are allowed')); // Do we really want to throw an error here?
//   //   }
//   // }
// });

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

  if (checkIfInvalidFileFormat(req.file.filename)) {
  console.log('req.file.filename', req.file.filename);

    return res.status(400).json({
      status: "fail",
      message: "Invalid file format",
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

function checkIfInvalidFileFormat(filename: string): boolean {
  const extension = filename.split(".").pop(); // Is there a better way to get the extension? It is not immutable
  const validExtensions = ["jpeg", "png"];

  return extension ? !validExtensions.includes(extension) : false; // should I do something about this false case?
}
