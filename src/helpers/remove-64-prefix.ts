export const removeBase64Prefix = (base64: string): string => {
  const parts = base64.split(",");
  if (parts.length === 2) {
    return parts[1];
  }
  throw new Error("Invalid base64 image data");
};
