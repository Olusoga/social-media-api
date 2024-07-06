import { Server as SocketIOServer } from 'socket.io';
import { createPost, findPostById, updatePost, findPostsByAuthorIds, findAllPosts } from '../repositories/post.repository';
import { findUserById } from '../repositories/user.repository';
import { IPost } from '../models/post.model';
import { HttpError } from '../utils/error-handler';
import mongoose, { Types } from 'mongoose';
import { sendNotification } from './notification.service';
import { detectMentions } from '../utils/detectmentions';
const { ObjectId } = Types;

export const createNewPost = async (authorId: string, content: string, imageUrl?: string, videoUrl?: string): Promise<IPost> => {
  const authorObjectId = new ObjectId(authorId); 

  const mentionedUserIds = detectMentions(content);

  // Create post object with detected mentions
  const post: Partial<IPost> = {
    author: authorObjectId,
    content,
    imageUrl,
    videoUrl,
  };

  const savedPost = await createPost(post);

  // Send notifications asynchronously to mentioned users(does not block post creation)
  await Promise.all(mentionedUserIds.map(async (userId) => {
    const message = `You were mentioned in a post by ${authorId}`;
    await sendNotification(userId, 'mention', message)
      .catch(notificationError => {
        console.error(`Failed to send mention notification to user ${userId}:`, notificationError);
      });
  }));

  return savedPost;
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

export const getPostWithCounts = async (postId: string): Promise<any> => {
  try {
    const post = await findPostById(postId)
    if (!post) {
       throw new HttpError(404, 'Post not found');
    }

    // Calculate number of likes and comments
    const likeCount = post.likes.length;
    const commentCount = post.comments.length;

    // Construct response object with post details and counts
    const response = {
      _id: post._id,
      author: post.author,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      likes : post.likes,
      comment:post.comments,
      likesCount: likeCount,
      commentsCount: commentCount,
    };

    return response;
  } catch (error) {
    console.error('Error fetching post with counts:', error);
    throw new HttpError(500, 'Failed to fetch post with counts');
  }
};

export const getPostsWithCounts = async (page: number, limit: number): Promise<any[]> => {
  const posts = await findAllPosts(page, limit);

  // Calculate likes and comments count for each post
  const postsWithCounts = posts.map((post: any) => ({
    _id: post._id,
    author: post.author,
    content: post.content,
    imageUrl: post.imageUrl,
    videoUrl: post.videoUrl,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return postsWithCounts;
};