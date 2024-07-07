import { Request, Response, NextFunction } from 'express';
import { AnySchema, ObjectSchema } from 'joi';

export const validateRequest = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail: { message: string; }) => detail.message);
      return res.status(400).json({ errors });
    }
    next();
  };
};

export const validate = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};