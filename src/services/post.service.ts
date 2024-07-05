import { Server as SocketIOServer } from 'socket.io';
import { createPost, findPostById, updatePost, findPostsByAuthorIds } from '../repositories/post.repository';
import { findUserById } from '../repositories/user.repository';
import { IPost } from '../models/post.model';
import { HttpError } from '../utils/error-handler';
import mongoose, { Types } from 'mongoose';
import { sendNotification } from './notification.service';
const { ObjectId } = Types;

export const createNewPost = async (authorId: string, content: string, imageUrl?: string, videoUrl?: string): Promise<IPost> => {
    
    const authorObjectId = new ObjectId(authorId); 
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
    return await findPostsByAuthorIds(objectIdArray, page, limit);
  
    } catch (error) {

      console.error('Error fetching feed posts:', error);
      throw new HttpError(409, 'Failed to fetch feed posts');

    }
  
  };

  export const likePost = async (postId: string, userId: string, io: SocketIOServer) => {
    let updatedPost;
    try {
    const post = await findPostById(postId);
    if (!post) {
     throw new HttpError(404, 'Post not found');
    }
  
    if (post.likes.includes(new ObjectId(userId))) {
    throw new HttpError(409, 'Post already liked');
    }
  
    // Update post likes using $addToSet
    const updateLikesPromise = updatePost(postId, { $addToSet: { likes: userId } } as any);

    // Wait for post update to complete
    updatedPost = await updateLikesPromise;

    // Send notification asynchronously (does not block post update)
    if (post.author.toString() !== userId) {
    sendNotification(post.author.toString(), 'like', `Your post was liked by ${userId}`)
   .catch(notificationError => {
    console.error('Failed to send notification:', notificationError);
        });
    }

    return updatedPost; 
  } catch (error) {
    console.error('Error liking post:', error);
    if (error instanceof HttpError) {
    throw error; 
    } else {
      throw new HttpError(500, 'Failed to like post');
    }
  }
};

export const commentOnPost = async (postId: string, userId: string, text: string, io: SocketIOServer)=>{
  let updatedPost;
    try {
    const post = await findPostById(postId);

    if (!post) {
     throw new HttpError(404, 'Post not found');
    }

    const comment = { user: new Types.ObjectId(userId), text };
    const updateCommentPromise =updatePost(postId, { $push: { comments: comment } } as any);

    updatedPost = await updateCommentPromise;

     // Send notification asynchronously (does not block post update)

     if (post.author.toString() !== userId) {
      sendNotification(post.author.toString(), 'comment', `Your post was commented on by ${userId}`)
     .catch(notificationError => {
      console.error('Failed to send notification:', notificationError);
          });
      }
   
      return updatedPost;
  } catch (error) {
    console.error('Error commenting on  post:', error);
    if (error instanceof HttpError) {
    throw error; 
    } else {
      throw new HttpError(500, 'Failed to comment on post');
    }
  }
}