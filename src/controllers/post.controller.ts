import { Request, Response } from 'express';
import { commentOnPost, createNewPost, getFeedPosts, likePost} from '../services/post.service';
import { HttpError, isHttpError } from '../utils/error-handler';
import {get} from 'lodash'

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

export const getFeed = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const user = req.user?._id.toString();
    const posts = await getFeedPosts(user, Number(page), Number(limit));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
  
};

export const likePostController = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = req.user?.id;
  try {
    await likePost(postId, userId, req.app.get('io')); 

    // If likePost succeeds, send success response
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);

    if (isHttpError(error)) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to like post' });
    }
  }
}

export const commentPostController =async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = req.user?.id;
  try {
    await commentOnPost(postId, userId, req.body.text, req.app.get('io')); 

    // If commentPost succeeds, send success response
    res.status(200).json({ message: 'Post commented on successfully' });
  } catch (error) {
    console.error('Error commenting on post:', error);

    if (isHttpError(error)) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to comment on post' });
    }
  }
}