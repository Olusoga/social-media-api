import { createPost, findPostById, updatePost, findPostsByAuthorIds } from '../repositories/post.repository';
import { findUserById } from '../repositories/user.repository';
import { IPost } from '../models/post.model';
import { HttpError } from '../utils/error-handler';
import mongoose, { Types } from 'mongoose';
const { ObjectId } = Types;

export const createNewPost = async (authorId: string, content: string, imageUrl?: string, videoUrl?: string): Promise<IPost> => {
    
    const authorObjectId = new ObjectId(authorId); // Convert authorId to ObjectId
    return createPost({ author: authorObjectId, content, imageUrl, videoUrl });
  };

  export const getFeedPosts = async (userId: string, page: number, limit: number): Promise<IPost[]> => {
    try {
      const user = await findUserById(userId);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }
  
      // Convert user.following from ObjectId[] to string[]
      const followingIds = user.following.map(item => item.toString());
  
      // Convert followingIds to ObjectId array
      const objectIdArray = followingIds.map(id => new mongoose.Types.ObjectId(id));
  
      // Fetch posts by authorIds (followingIds) with pagination
      const posts = await findPostsByAuthorIds(objectIdArray, page, limit);
  
      return posts;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw new HttpError(409, 'Failed to fetch feed posts');
    }
  
  };