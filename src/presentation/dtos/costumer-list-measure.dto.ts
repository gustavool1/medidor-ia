import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

const allowedTypes = ["water", "gas"];

const costumerList = yup.object().shape({
  measure_type: yup
    .string()
    .test("case-insensitive", "Only WATER or GAS are allowed", (value) => {
      return (
        typeof value === "string" && allowedTypes.includes(value.toLowerCase())
      );
    }),
});

export const costumerListValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.query;
  console.log(payload);

  try {
    if (typeof payload.measure_type === "string") {
      await costumerList.validate(payload);
    }
    next();
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Tipo de medição não permitida",
      });
    }
  }
};
