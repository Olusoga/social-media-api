import mongoose from 'mongoose';
import Post, { IPost } from '../models/post.model';

export const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  const post = new Post(postData);
  return post.save();
};

export const findAllPosts = async (page: number, limit: number): Promise<IPost[]> =>{
  const skip = (page - 1) * limit;
 return Post.find()
    .skip(skip)
    .limit(limit)
    .populate('author', 'username')
    .exec();
}

export const findPostById = async (postId: string) => {
  return Post.findById(postId).populate('author', 'username')
  .exec();
 
};

export const updatePost = async (postId: string, updateData: Partial<IPost>): Promise<IPost | null> => {
  return Post.findByIdAndUpdate(postId, updateData, { new: true });
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