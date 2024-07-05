import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded as { id: string };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;