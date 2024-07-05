// src/repositories/postRepository.ts
import Post, { IPost } from '../models/post.model';

export const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  const post = new Post(postData);
  return post.save();
};

export const findPostsByUserIds = async (userIds: string[], page: number, limit: number): Promise<IPost[]> => {
  return Post.find({ author: { $in: userIds } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
};

export const findPostById = async (postId: string): Promise<IPost | null> => {
  return Post.findById(postId);
};

export const updatePost = async (postId: string, updateData: Partial<IPost>): Promise<IPost | null> => {
  return Post.findByIdAndUpdate(postId, updateData, { new: true });
};
