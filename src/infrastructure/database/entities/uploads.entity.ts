import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("measures_uploads")
export class UploadsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "customer_code" })
  customerCode: string = "";

  @Column({ name: "measure_datetime", type: "datetime" })
  measureDatetime: Date = new Date();

  @Column({ name: "measure_type" })
  measureType: string = "";
}
