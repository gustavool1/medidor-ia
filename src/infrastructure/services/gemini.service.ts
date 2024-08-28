import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { getMimeType } from "../../helpers/get-mime-type";

import * as dotenv from "dotenv";
dotenv.config();

export class GeminiService {
  private model: GenerativeModel;
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async askAQuestion(question: string) {
    try {
      const geminiResponse = await this.model.generateContent(question);

      if (
        geminiResponse &&
        geminiResponse.response &&
        geminiResponse.response.candidates
      ) {
        return geminiResponse.response.candidates[0].content.parts;
      }

      console.error("Unexpected response or API error:", geminiResponse);
      return [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async sendImage(imageBase64: string) {
    const imageType = await getMimeType(imageBase64);
    const imageData = {
      inlineData: {
        data: imageBase64,
        mimeType: imageType ?? "",
      },
    };

    return await this.model.generateContent([
      "Me diga quantas ML tem nesse recipiente",
      imageData,
    ]);
  }
}
