import { GeminiService } from "../../infrastructure/services/gemini.service";
import { Request, Response } from "express";

export class MeasureController {
  private geminiService: GeminiService;
  constructor() {
    this.geminiService = new GeminiService();
  }

  async upload(req: Request, res: Response) {
    const geminiAnswer = await this.geminiService.sendImage(req.body.image);
    return res.send(geminiAnswer);
  }
}
