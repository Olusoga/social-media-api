import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/user.service';
import { HttpError } from '../utils/error-handler';

const isHttpError = (error: any): error is HttpError => {
    return error instanceof HttpError;
  };

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    try {
        const { user, token } = await registerUser(username, email, password);
        res.status(201).json( { ...user, token } );
    } catch (error: any) { 
        if (isHttpError(error)) {
          res.status(error.statusCode).json({ error: error.message });
        } else if (error.name === 'ValidationError') {
          res.status(400).json({ error: error.message });
        } else {
          console.error('Unhandled error:', error);
          res.status(500).json({ error: 'Server error' });
        }
      }
    };

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const { user, token } = await authenticateUser(email, password);
    if (!token) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(200).json({...user, token });
    }
  } catch (error) {
    if (isHttpError(error)) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Unhandled error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};