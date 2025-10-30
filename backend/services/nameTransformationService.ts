export const transformName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/ /g, "-")
    .substring(0, 10);
};

export const generateFilename = (
  transformedName: string,
  format: string
): string => {
  const timestamp = Date.now();
  return `${transformedName}-${timestamp}.${format}`;
};