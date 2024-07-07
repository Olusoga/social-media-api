import { Request, Response } from 'express';
import { commentOnPost, createNewPost, getFeedPosts, getPostsWithCounts, getPostWithCounts, likePost} from '../services/post.service';
import { HttpError, isHttpError } from '../utils/error-handler';
import redisClient from '../utils/redis';

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

export const getPostWithCountsController = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const redisKey= `post:${postId}`;

  try {

    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    const postWithCounts = await getPostWithCounts(postId);

    await redisClient.setex(redisKey, 3600, JSON.stringify(postWithCounts))
   
    res.json(postWithCounts);
  } catch (error) {
    console.error('Error in getPostWithCountsController:', error);
    res.status(500).json({ error: 'Failed to fetch post with counts' });
  }
};

export const getAllPostswithCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await getPostsWithCounts(page, limit);
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}