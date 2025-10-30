import { ImageMetadataModel } from "../models/ImageMetadataModel.js";

export interface ImageData {
  buffer: Buffer;
  mimetype: string;
  name: string;
}

export interface ProcessedImageData {
  name: string;
  path: string;
}

export const createImageMetadata = async (imageData: ProcessedImageData) => {
  const metadata = await ImageMetadataModel.create(imageData);
  return {
    status: "success",
    data: {
      data: metadata,
    },
  };
};