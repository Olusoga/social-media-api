import { Request, Response } from 'express';
import { followUser } from '../services/user.service';
import { isHttpError } from '../utils/error-handler';

export const followUserController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user
  const { userToFollowId } = req.params;

  try {
    await followUser(user?.id, userToFollowId);
    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    if (isHttpError(error)) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
