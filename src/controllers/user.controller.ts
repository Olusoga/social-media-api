import { Request, Response } from 'express';
import { followUser } from '../services/user.service';
import { HttpError } from '../utils/error-handler';

const isHttpError = (error: any): error is HttpError => {
    return error instanceof HttpError;
  }
export const followUserController = async (req: Request, res: Response): Promise<void> => {
  const { userId, userToFollowId } = req.params;

  try {
    await followUser(userId, userToFollowId);
    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    if (isHttpError(error)) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
