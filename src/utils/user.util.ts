import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
};

export const formatUser = (user: IUser): Partial<IUser> => {
  const { _id, username, email } = user;
  return { _id, username, email };
};