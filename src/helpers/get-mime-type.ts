import fileType from "file-type";

export const getMimeType = async (base64Data: string): Promise<string> => {
  const buffer = Buffer.from(base64Data, "base64");
  const fileTypeResult = await fileType.fromBuffer(buffer);

  if (fileTypeResult) {
    return fileTypeResult.mime;
  }

  return "";
};
