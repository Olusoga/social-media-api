// src/repositories/postRepository.ts
import mongoose from 'mongoose';
import Post, { IPost } from '../models/post.model';

export const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  const post = new Post(postData);
  return post.save();
};

export const findPostsByAuthorIds = async (authorIds: mongoose.Types.ObjectId[], page: number, limit: number): Promise<IPost[]> => {
  try {
    const query = Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const posts = await query.exec();
    return posts;
  } catch (error) {
    console.error('Error finding posts by author IDs:', error);
    throw new Error('Failed to find posts');
  }
};

export const findPostById = async (postId: string): Promise<IPost | null> => {
  return Post.findById(postId);
};

export const updatePost = async (postId: string, updateData: Partial<IPost>): Promise<IPost | null> => {
  return Post.findByIdAndUpdate(postId, updateData, { new: true });
};

