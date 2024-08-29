import { NextFunction, Request, Response, Router } from "express";
import { MeasureController } from "../../presentation/controllers/measure.controller";
import { uploadValidation } from "../../presentation/dtos/upload-measure.dto";

const router = Router();
const measureController = new MeasureController();

router.post(
  "/upload",
  (req: Request, res: Response, next: NextFunction) =>
    uploadValidation(req, res, next),
  (req, res) => measureController.upload(req, res)
);

export default router;
