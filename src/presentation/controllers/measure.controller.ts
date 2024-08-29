import { Repository } from "typeorm";
import { GeminiService } from "../../infrastructure/services/gemini.service";
import { Request, Response } from "express";
import { UploadsEntity } from "../../infrastructure/database/entities/uploads.entity";
import { Database } from "../../infrastructure/database/database";

export class MeasureController {
  private geminiService: GeminiService;
  private uploadRepository: Repository<UploadsEntity>;

  constructor() {
    this.geminiService = new GeminiService();
    this.uploadRepository = Database.getRepository(UploadsEntity);
  }

  async upload(req: Request, res: Response) {
    const geminiAnswer = await this.geminiService.sendImage(req.body.image);
    res.send(geminiAnswer);
  }
}
