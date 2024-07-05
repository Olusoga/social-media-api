import { Request, Response } from 'express';
import { createNewPost } from '../services/post.service';
import { HttpError, isHttpError } from '../utils/error-handler';

export const createPost = async (req: Request, res: Response) => {
    const { content, imageUrl, videoUrl } = req.body;
    try {
      const user  = req.user
      if (!user) {
        throw new HttpError(401, 'User not authenticated')
      }
      
      const post = await createNewPost(user.id, content, imageUrl, videoUrl);
      res.status(201).json(post);
    } catch (error) {
        if (isHttpError(error)) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
        }
    }
}