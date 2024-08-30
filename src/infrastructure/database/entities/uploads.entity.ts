import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("measures_uploads")
export class UploadsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "customer_code" })
  customerCode: string = "";

  @Column({ name: "measure_datetime", type: "date" })
  measureDatetime: Date = new Date();

  @Column({ name: "measure_type" })
  measureType: string = "";

  @Column({ name: "measure_value", type: "int" })
  measureValue: number = 0;

  @Column({ name: "confirmed_value", type: "boolean", default: false })
  confirmedValue: boolean = false;

  @Column({ name: "image_url_temporary", type: "date", nullable: true })
  imageUrlTemporary: string | null = null;
}
