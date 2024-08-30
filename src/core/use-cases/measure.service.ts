import { Repository } from "typeorm";
import { GeminiService } from "../../infrastructure/services/gemini.service";
import { UploadsEntity } from "../../infrastructure/database/entities/uploads.entity";
import { Database } from "../../infrastructure/database/database";
import { removeBase64Prefix } from "../../helpers/remove-64-prefix";
import { saveBase64AsImage } from "../../helpers/base64-to-image";
import { DoubleReportException } from "../exceptions/double-report.exception";
import { NotFoundMeasure } from "../exceptions/not-found-measure.exception";
import { ConfirmationDuplicate } from "../exceptions/confirmation-duplicate.exception";
import { ParsedQs } from "qs";

export class MeasureService {
  private geminiService: GeminiService;
  private uploadRepository: Repository<UploadsEntity>;

  constructor() {
    this.geminiService = new GeminiService();
    this.uploadRepository = Database.getRepository(UploadsEntity);
  }

  private async checkIfReportAlreadyExistsThisMonth(
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

  async confirm(id: string, confirmedValue: number) {
    const measure = await this.uploadRepository.findOne({ where: { id } });

    if (!measure) {
      throw new NotFoundMeasure("Measure not found");
    }
    if (measure.confirmedValue) {
      throw new ConfirmationDuplicate("Confirmation duplicate");
    }

    measure.confirmedValue = confirmedValue;
    await this.uploadRepository.save(measure);

    return {
      success: true,
    };
  }

  private formatGetCostumerResponse(measures: UploadsEntity[]) {
    return measures.map((measure) => {
      return {
        measure_uuid: measure.id,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.measureValue,
        image_url: measure.imageUrlTemporary,
      };
    });
  }

  async getCustomerMeasures(customerCode: string, queryParams?: ParsedQs) {
    const measureType =
      typeof queryParams?.measure_type === "string"
        ? queryParams.measure_type
        : undefined;

    const measures = await this.uploadRepository.find({
      where: {
        customerCode: customerCode,
        measureType: measureType?.toLocaleUpperCase(),
      },
    });

    if (!measures || measures.length === 0) {
      throw new NotFoundMeasure("Measure not found");
    }

    return {
      customer_code: customerCode,
      measures: this.formatGetCostumerResponse(measures),
    };
  }
}
