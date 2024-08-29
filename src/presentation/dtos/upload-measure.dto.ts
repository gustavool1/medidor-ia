import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

const uploadSchema = yup.object().shape({
  image: yup.string().required(),
  customer_code: yup.string().required(),
  measure_datetime: yup.string().required(),
  measure_type: yup
    .string()
    .oneOf(["WATER", "GAS"], "Only WATER or GAS are allowed")
    .required("Measure type is required"),
});

export const uploadValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body;

  try {
    await uploadSchema.validate(payload);
    next();
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: e.errors.join(", "),
      });
    }
  }
};
