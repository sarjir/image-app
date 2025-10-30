import sharp from "sharp";
import path from "path";
import type { ImageData } from "./metadataService.js";
import { transformName, generateFilename } from "./nameTransformationService.js";

const IMG_DIRECTORY_PATH = "public/img";

export type ImageFormat = "jpeg" | "png";

export const resizeAndSaveImage = async (
  buffer: Buffer,
  filename: string,
  format: ImageFormat
): Promise<string> => {
  const outputPath = path.join(IMG_DIRECTORY_PATH, filename);

  await sharp(buffer)
    .resize(400, 400, {
      fit: "contain",
    })
    .toFormat(format, { quality: 80 })
    .toFile(outputPath);

  return outputPath;
};

export const getImageFormat = (mimetype: string): ImageFormat => {
  return mimetype.includes("png") ? "png" : "jpeg";
};

export const handleImageProcessingWorkflow = async (imageData: ImageData): Promise<string> => {
  const transformedName = transformName(imageData.name);
  const format = getImageFormat(imageData.mimetype);
  const filename = generateFilename(transformedName, format);
  
  return resizeAndSaveImage(
    imageData.buffer,
    filename,
    format
  );
};