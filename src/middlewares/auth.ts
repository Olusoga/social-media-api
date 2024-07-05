import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../repositories/user.repository';
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, jwtSecret)as { id: string };
    const user = await findUserById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found, authorization denied' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;