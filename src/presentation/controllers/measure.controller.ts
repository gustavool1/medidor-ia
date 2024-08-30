import { Repository } from "typeorm";
import { Request, Response } from "express";
import { MeasureService } from "../../core/use-cases/measure.service";
import { DoubleReportException } from "../../core/exceptions/double-report.exception";
import { NotFoundMeasure } from "../../core/exceptions/not-found-measure.exception";
import { ConfirmationDuplicate } from "../../core/exceptions/confirmation-duplicate.exception";

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

  async confirm(req: Request, res: Response) {
    try {
      res.send(
        await this.measureService.confirm(
          req.body.measure_uuid,
          req.body.confirmed_value
        )
      );
    } catch (e) {
      if (e instanceof NotFoundMeasure) {
        res.status(404).send({
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura do mês já realizada",
        });
      }

      if (e instanceof ConfirmationDuplicate) {
        res.status(409).send({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês já realizada",
        });
      }
    }
  }
}
