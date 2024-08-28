import express, { Request, Response } from "express";
import measureRoutes from "./infrastructure/routes/measure.routes"; // Importe suas rotas

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", measureRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
