import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

const uuidV4Regex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const confirmSchema = yup.object().shape({
  measure_uuid: yup
    .string()
    .matches(uuidV4Regex, "Invalid UUID format")
    .required(),
  confirmed_value: yup.number().required("confirmed_value is required"),
});

export const confirmValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body;

  try {
    await confirmSchema.validate(payload);
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
