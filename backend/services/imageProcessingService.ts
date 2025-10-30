import sharp from "sharp";
import path from "path";

const IMG_DIRECTORY_PATH = "public/img";

export type ImageFormat = "jpeg" | "png";

export const processAndSaveImage = async (
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