import request from 'supertest';
import{followUser} from '../../../services/user.service';
import  mockAuthMiddleware from './fixtures/mockAuthMiddleware';

  jest.mock('../../../middlewares/auth', () => ({
    __esModule: true,
    default: mockAuthMiddleware, 
  }));

  import { server } from '../../../server';  
  import { HttpError } from '../../../utils/error-handler';

  jest.mock('../../../services/user.service', () => ({
    followUser: jest.fn(),
  }));;

describe('Follow User API', () => {

    beforeEach(() => {
        jest.resetAllMocks();
      });
  describe('POST /api/users/follow/:userToFollowId/follow', () => {
    const userToFollowId = '60d6fe9b1b9b9c1a8c8d7c8c';

    it('should return 200 if user is followed successfully', async () => {
        (followUser as jest.Mock).mockResolvedValueOnce(undefined);
    
        const userToFollowId = 'userToFollowId';
        const response = await request(server)
        .post(`/api/users/${userToFollowId}/follow`)
        .set('Authorization', 'Bearer validToken');
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User followed successfully');
      });
    
      it('should return 404 if user not found', async () => {
        const error = new HttpError(404, 'User not found');
        (followUser as jest.Mock).mockRejectedValueOnce(error);
    
        const userToFollowId = 'userToFollowId';
        const response = await request(server)
        .post(`/api/users/${userToFollowId}/follow`)
        .set('Authorization', 'Bearer validToken');
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
      });
    
      it('should return 409 if user is already followed', async () => {
        const error = new HttpError(409, 'Already following this user');
        (followUser as jest.Mock).mockRejectedValueOnce(error);
    
        const userToFollowId = 'userToFollowId';
        const response = await request(server)
        .post(`/api/users/${userToFollowId}/follow`)
        .set('Authorization', 'Bearer validToken');
    
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Already following this user');
      });
    
      it('should return 500 if there is an internal server error', async () => {
        const error = new Error('Internal Server Error');
        (followUser as jest.Mock).mockRejectedValueOnce(error);
    
        const userToFollowId = 'userToFollowId';
        const response = await request(server)
        .post(`/api/users/${userToFollowId}/follow`)
        .set('Authorization', 'Bearer validToken');
    
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
      });
    });
})