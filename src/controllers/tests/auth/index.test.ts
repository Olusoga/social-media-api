import request from 'supertest';
import{registerUser, authenticateUser} from '../../../services/user.service';
import { server } from '../../../server';

jest.mock('../../../services/user.service', () => ({
  registerUser: jest.fn(),
  authenticateUser: jest.fn(),
}));


describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 if user is created successfully', async () => {
      (registerUser as jest.Mock).mockResolvedValue({
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'fake-token',
      });

      const response = await request(server).post('/api/auth/signup').send({ email: 'test@example.com', password: 'Pas1aaa@', username: 'testuser' });
      expect(response.status).toBe(201);
      expect(response.body.username).toBe('testuser');
      expect(response.body.token).toBe('fake-token');
    });

    it('should return error if user creation fails', async () => {
      (registerUser as jest.Mock).mockResolvedValue({
        status: 400,
        message: 'User already exists',
      });

      const response = await request(server).post('/api/auth/signup').send({ email: 'test@example.com', password: 'Pa1@aaaaaaa',  });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should return 200 if login is successful', async () => {
      (authenticateUser as jest.Mock).mockResolvedValue({
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'jwt-token',
      });

      const response = await request(server).post('/api/auth/login').send({ email: 'test@example.com', password: 'Pas1aaa@' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('jwt-token');
    });

    it('should return error if login fails', async () => {
      (authenticateUser as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

      const response = await request(server).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });
});