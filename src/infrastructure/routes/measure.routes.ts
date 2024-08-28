import { Router } from "express";
import { MeasureController } from "../../presentation/controllers/measure.controller";

const router = Router();
const measureController = new MeasureController();

router.post("/upload", (req, res) => measureController.upload(req, res));

export default router;
