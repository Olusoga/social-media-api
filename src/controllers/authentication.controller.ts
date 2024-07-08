import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/user.service';
import {  isHttpError } from '../utils/error-handler';


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
    res.status(401).json({ message: 'Authentication failed' });
  } else {
    res.status(200).json({...user, token, message: 'Login successful' });
  }
  } catch (error) {

  if (isHttpError(error)) {

  res.status(error.statusCode).json({ message: error.message });
  } else {

  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Server error' });
   }
  }
};