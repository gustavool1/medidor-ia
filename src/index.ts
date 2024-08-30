import express, { Request, Response } from "express";
import measureRoutes from "./infrastructure/routes/measure.routes";
import imageRoutes from "./infrastructure/routes/image.route";
import { Database } from "./infrastructure/database/database";
import "reflect-metadata";

const app = express();
const port = 3000;

Database.initialize().then((res) => {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb" }));
  app.use(express.json());

  app.use("/", measureRoutes);
  app.use("/", imageRoutes);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
