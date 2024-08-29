import { DataSource } from "typeorm";
import { UploadsEntity } from "./entities/uploads.entity";

export const Database = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "shopper",
  entities: [UploadsEntity],
  migrations: [`${__dirname}/migrations/{.ts,*.js}`],
  synchronize: false,
});
