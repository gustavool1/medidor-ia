import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

export const saveBase64AsImage = (base64: string): string => {
  const matches = base64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 image data");
  }
  const extension = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");
  const fileName = `image_${Date.now()}.${extension}`;
  const filePath = path.join(path.resolve(__dirname, "../../temp"), fileName);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `http://localhost:${3000}/temp/${fileName}`;

  return fileUrl;
};
