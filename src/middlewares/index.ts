import { Request, Response, NextFunction } from "express";
import { ValidationResult } from "@src/interfaces";

export default function baseValidator<T = { [key: string]: string }>(
  validators: { [key in keyof T]: ((value: string) => ValidationResult)[] },
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validatorKeys: string[] = Object.keys(validators);
  const errors: { [key: string]: string }[] = [];

  validatorKeys.forEach((key) => {
    validators[key as keyof T].forEach((validator) => {
      const result = validator(req.body[key]);
      if (!result.success && result.error) errors.push({ [key]: result.error });
    });
  });

  if (errors.length > 0) return res.status(400).json({ errors: errors });
  else next();
}
