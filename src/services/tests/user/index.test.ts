import { authenticateUser, followUser, registerUser } from '../../user.service';
import { createUser, findUserByEmail, findUserById, followUserRepo } from '../../../repositories/user.repository';
import { generateMockUser } from '../fixtures/user';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../models/user.model';
import { HttpError } from '../../../utils/error-handler';
import { Types } from 'mongoose';

// Mock data
const mockUser: IUser = generateMockUser();
const mockData: any = {
    _id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    following: [],
    comparePassword: jest.fn().mockResolvedValue(true),
  };

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
const token = jwt.sign({ id: mockUser._id }, jwtSecret, { expiresIn: '1h' });

jest.mock('../../../repositories/user.repository');
jest.mock('jsonwebtoken');

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and return the user and token', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);
    (createUser as jest.Mock).mockResolvedValue(mockData);
    (jwt.sign as jest.Mock).mockReturnValue(token);
    const result = await registerUser('john_doe', 'john@example.com', 'password123');

    expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
    expect(createUser).toHaveBeenCalledWith({ username: 'john_doe', email: 'john@example.com', password: 'password123' });
    expect(result).toEqual({ user: { _id: mockData._id, username: 'john_doe', email: 'john@example.com' }, token });
  });

  it('should throw an error if the user already exists', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(registerUser('john_doe', 'john@example.com', 'password123')).rejects.toThrow('User already exists');

    expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
    expect(createUser).not.toHaveBeenCalled();
  });
});

describe('authenticateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should authenticate a user and return the user and token', async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(token);
  
      const result = await authenticateUser('john@example.com', 'password123');
  
      expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result).toEqual({
        user: { _id: mockUser._id, username: mockUser.username, email: mockUser.email },
        token,
      });
    });
  
    it('should throw an error if the user is not found', async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);
  
      await expect(authenticateUser('john@example.com', 'password123')).rejects.toThrow(HttpError);
      await expect(authenticateUser('john@example.com', 'password123')).rejects.toThrow('User not found');
  
      expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
    });
  
    it('should throw an error if the password is incorrect', async () => {
      const incorrectPasswordUser = { ...mockUser, comparePassword: jest.fn().mockResolvedValue(false) };
      (findUserByEmail as jest.Mock).mockResolvedValue(incorrectPasswordUser);
  
      await expect(authenticateUser('john@example.com', 'password123')).rejects.toThrow(HttpError);
      await expect(authenticateUser('john@example.com', 'password123')).rejects.toThrow('Incorrect password');
  
      expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(incorrectPasswordUser.comparePassword).toHaveBeenCalledWith('password123');
    });
  });

  describe('followUser', () => {
    const userId = new Types.ObjectId().toString();
    const userToFollowId = new Types.ObjectId().toString();
  
    let currentUser: any;
    let userToFollow: any;
  
    beforeEach(() => {
      jest.clearAllMocks();
      currentUser = generateMockUser();
      userToFollow = generateMockUser();
    });
  
    it('should allow a user to follow another user', async () => {
      (findUserById as jest.Mock)
        .mockResolvedValueOnce(currentUser)
        .mockResolvedValueOnce(userToFollow);
  
      await followUser(userId, userToFollowId);
  
      expect(findUserById).toHaveBeenCalledTimes(2);
      expect(findUserById).toHaveBeenCalledWith(userId);
      expect(findUserById).toHaveBeenCalledWith(userToFollowId);
      expect(followUserRepo).toHaveBeenCalledWith(userId, userToFollowId);
    });
  
    it('should throw an error if current user is not found', async () => {
        (findUserById as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(userToFollow);
      
        await expect(followUser(userId, userToFollowId)).rejects.toThrow(HttpError);
        await expect(followUser(userId, userToFollowId)).rejects.toThrow('User not found');
      
        expect(findUserById).toHaveBeenCalledWith(userId);
        expect(findUserById).toHaveBeenCalledWith(userToFollowId);  
    });
  
    it('should throw an error if user to follow is not found', async () => {
      (findUserById as jest.Mock)
        .mockResolvedValueOnce(currentUser)
        .mockResolvedValueOnce(null);
  
      await expect(followUser(userId, userToFollowId)).rejects.toThrow(HttpError);
      await expect(followUser(userId, userToFollowId)).rejects.toThrow('User not found');
  
      expect(findUserById).toHaveBeenCalledWith(userId);
      expect(findUserById).toHaveBeenCalledWith(userToFollowId);
    });
  
    it('should throw an error if the user is already following the user to follow', async () => {
        const currentUser = generateMockUser();
        const userToFollow = generateMockUser();
        
        currentUser.following.push(userToFollowId as unknown as any);
    
        (findUserById as jest.Mock)
          .mockResolvedValueOnce(currentUser)
          .mockResolvedValueOnce(userToFollow);
    
        try {
          await followUser(userId, userToFollowId);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpError);
    
          if (error instanceof HttpError) {
            expect(error.message).toBe('Already following this user');
          } else {
            throw new Error('Unexpected error type');
          }
        }
    
        expect(findUserById).toHaveBeenCalledWith(userId);
        expect(findUserById).toHaveBeenCalledWith(userToFollowId);

    });
    
});
    