import { Repository } from "typeorm";
import { Request, Response } from "express";
import { MeasureService } from "../../core/use-cases/measure.service";
import { DoubleReportException } from "../../core/exceptions/double-report.exception";

export class MeasureController {
  private measureService: MeasureService;
  constructor() {
    this.measureService = new MeasureService();
  }

  async upload(req: Request, res: Response) {
    try {
      res.send(
        await this.measureService.upload(
          req.body.image,
          req.body.customer_code,
          req.body.measure_datetime,
          req.body.measure_type
        )
      );
    } catch (e) {
      if (e instanceof DoubleReportException) {
        res.status(409).send({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      }
    }
  }
}
