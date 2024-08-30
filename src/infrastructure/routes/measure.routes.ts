import { NextFunction, Request, Response, Router } from "express";
import { MeasureController } from "../../presentation/controllers/measure.controller";
import { uploadValidation } from "../../presentation/dtos/upload-measure.dto";
import { confirmValidation } from "../../presentation/dtos/confirm-measure.dto";

const router = Router();
const measureController = new MeasureController();

router.post(
  "/upload",
  (req: Request, res: Response, next: NextFunction) =>
    uploadValidation(req, res, next),
  (req, res) => measureController.upload(req, res)
);

router.patch(
  "/confirm",
  (req: Request, res: Response, next: NextFunction) =>
    confirmValidation(req, res, next),
  (req, res) => measureController.confirm(req, res)
);

export default router;
