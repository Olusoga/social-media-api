import request from 'supertest';

import { createNewPost, getFeedPosts, getPostsWithCounts, getPostWithCounts, likePost, commentOnPost } from '../../../services/post.service';
import { HttpError } from '../../../utils/error-handler';
import mockAuthMiddleware from '../fixtures/mockAuthMiddleware';

jest.mock('../../../middlewares/auth', () => ({
    __esModule: true,
    default: mockAuthMiddleware, 
  }));
  

import { server } from '../../../server';  

jest.mock('../../../services/post.service', () => ({
    createNewPost: jest.fn(),
    getFeedPosts: jest.fn(),
    getPostsWithCounts: jest.fn(),
    getPostWithCounts: jest.fn(),
    likePost: jest.fn(),
    commentOnPost: jest.fn(),
  }));;


describe('Post Routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const post = { id: 'testPostId', content: 'Test Content', user: 'testUserId' };
      (createNewPost as jest.Mock).mockResolvedValueOnce(post);

      const response = await request(server)
        .post('/api/posts')
        .send({ content: 'Test Content', imageUrl: 'http://example.com/image.jpg' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(post);
    });

    it('should return 401 if user is not authenticated', async () => {
      (createNewPost as jest.Mock).mockRejectedValueOnce(new HttpError(401, 'User not authenticated'));

      const response = await request(server)
        .post('/api/posts')
        .send({ content: 'Test Content', imageUrl: 'http://example.com/image.jpg' })
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not authenticated');
    });
  });

  describe('POST /api/posts/like', () => {
    it('should like a post', async () => {
      (likePost as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(server)
        .post('/api/posts/like')
        .send({ postId: 'testPostId' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post liked successfully');
    });

    it('should return 500 if likePost fails', async () => {
      (likePost as jest.Mock).mockRejectedValueOnce(new Error('Failed to like post'));

      const response = await request(server)
        .post('/api/posts/like')
        .send({ postId: 'testPostId' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to like post');
    });
  });

  describe('POST /api/posts/comment', () => {
    it('should comment on a post', async () => {
      (commentOnPost as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(server)
        .post('/api/posts/comment')
        .send({ postId: 'testPostId', text: 'Test Comment' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post commented on successfully');
    });

    it('should return 500 if commentOnPost fails', async () => {
      (commentOnPost as jest.Mock).mockRejectedValueOnce(new Error('Failed to comment on post'));

      const response = await request(server)
        .post('/api/posts/comment')
        .send({ postId: 'testPostId', text: 'Test Comment' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to comment on post');
    });
  });

  describe('GET /api/posts/:postId', () => {
    it('should get a post with counts', async () => {
      const postWithCounts = { id: 'testPostId', content: 'Test Content', likeCount: 10, commentCount: 5 };
      (getPostWithCounts as jest.Mock).mockResolvedValueOnce(postWithCounts);

      const response = await request(server)
        .get('/api/posts/testPostId')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(postWithCounts);
    });

    it('should return 500 if getPostWithCounts fails', async () => {
      (getPostWithCounts as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch post with counts'));

      const response = await request(server)
        .get('/api/posts/testPostId')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch post with counts');
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts with counts', async () => {
      const posts = [{ id: 'testPostId', content: 'Test Content', likeCount: 10, commentCount: 5 }];
      (getPostsWithCounts as jest.Mock).mockResolvedValueOnce(posts);

      const response = await request(server)
        .get('/api/posts?page=1&limit=10')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(posts);
    });

    it('should return 500 if getPostsWithCounts fails', async () => {
      (getPostsWithCounts as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch posts'));

      const response = await request(server)
        .get('/api/posts?page=1&limit=10')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch posts');
    });
  });
});
