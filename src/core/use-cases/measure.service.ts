import { Repository } from "typeorm";
import { GeminiService } from "../../infrastructure/services/gemini.service";
import { UploadsEntity } from "../../infrastructure/database/entities/uploads.entity";
import { Database } from "../../infrastructure/database/database";
import { removeBase64Prefix } from "../../helpers/remove-64-prefix";
import { saveBase64AsImage } from "../../helpers/base64-to-image";
import { DoubleReportException } from "../exceptions/double-report.exception";

export class MeasureService {
  private geminiService: GeminiService;
  private uploadRepository: Repository<UploadsEntity>;

  constructor() {
    this.geminiService = new GeminiService();
    this.uploadRepository = Database.getRepository(UploadsEntity);
  }

  async checkIfReportAlreadyExistsThisMonth(
    customerCode: string,
    measureDatetime: Date,
    measureType: string
  ) {
    const customersMeasures = await this.uploadRepository.find({
      where: { customerCode, measureType },
    });

    const measureMonth = new Date(measureDatetime).getMonth();
    const hasReport = customersMeasures.find((customer) => {
      return new Date(customer.measureDatetime).getMonth() === measureMonth;
    });

    return hasReport;
  }

  async upload(
    imageBase64: string,
    customerCode: string,
    measureDatetime: Date,
    measureType: string
  ) {
    const reportAlreadyExistThisMonth =
      await this.checkIfReportAlreadyExistsThisMonth(
        customerCode,
        measureDatetime,
        measureType
      );

    if (reportAlreadyExistThisMonth) {
      throw new DoubleReportException("Double report exception");
    }

    const temporaryUrl = saveBase64AsImage(imageBase64);
    const geminiAnswer = await this.geminiService.sendImage(
      removeBase64Prefix(imageBase64),
      measureType
    );

    const uploadMeasure = this.uploadRepository.create({
      customerCode: customerCode,
      measureDatetime: measureDatetime,
      measureType: measureType,
      measureValue: geminiAnswer,
      imageUrlTemporary: temporaryUrl,
    });
    const saveMeasure = await this.uploadRepository.save(uploadMeasure);

    return {
      image_url: temporaryUrl,
      measure_uuid: saveMeasure.id,
      measure_value: geminiAnswer,
    };
  }
}
