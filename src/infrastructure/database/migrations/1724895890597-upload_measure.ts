import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UploadMeasure1724895890597 implements MigrationInterface {
  private TABLE_NAME = "measures_uploads";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },

          {
            name: "customer_code",
            type: "varchar",
          },
          {
            name: "measure_datetime",
            type: "datetime",
          },
          {
            name: "measure_value",
            type: "int",
          },
          {
            name: "measure_type",
            type: "varchar",
          },
          {
            name: "confirmed_value",
            type: "tinyint",
            default: 0,
          },
          {
            name: "image_url_temporary",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
