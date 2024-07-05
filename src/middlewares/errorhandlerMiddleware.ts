import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/error-handler';

export const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
