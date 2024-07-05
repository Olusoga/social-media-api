import { createPost, findPostsByUserIds, findPostById, updatePost } from '../repositories/post.repository';
import { findUserById } from '../repositories/user.repository';
import { IPost } from '../models/post.model';
import { HttpError } from '../utils/error-handler';
import { Types } from 'mongoose';
const { ObjectId } = Types;

export const createNewPost = async (authorId: string, content: string, imageUrl?: string, videoUrl?: string): Promise<IPost> => {
    
    const authorObjectId = new ObjectId(authorId); // Convert authorId to ObjectId
    return createPost({ author: authorObjectId, content, imageUrl, videoUrl });
  };

