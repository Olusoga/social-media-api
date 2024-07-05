import { createUser, findUserByEmail, findUserById, followUserRepo } from '../repositories/user.repository';
import { formatUser, generateToken } from '../utils/user.util';
import { IUser } from '../models/user.model';
import { HttpError } from '../utils/error-handler';
import { Types } from 'mongoose';
const { ObjectId } = Types;

export const registerUser = async (username: string, email: string, password: string): Promise<{ user: Partial<IUser>, token: string }> => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new HttpError(409, 'User already exists');
      }
  
    const user = await createUser({ username, email, password });
    const token = generateToken(user);
    const formattedUser = formatUser(user);
  
    return {  user: formattedUser, token };
}

export const authenticateUser = async (email: string, password: string): Promise<{ user: Partial<IUser>, token: string }> => {
    try {
      const user = await findUserByEmail(email);
      
      if (!user) {
        throw new HttpError(404, 'User not found'); 
      }
  
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new HttpError(401, 'Incorrect password'); 
      }
  
      const token = generateToken(user);
      
      const formattedUser = formatUser(user);
  
      return {  user: formattedUser, token };
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  };

  export const followUser = async (userId: string, userToFollowId: string): Promise<void> =>{
    const currentUser = await findUserById(userId);
    const userToFollow = await findUserById(userToFollowId);

    if (!currentUser || !userToFollow) {
      throw new HttpError(404, 'User not found'); 
    }

     // Check if the user is already following the userToFollow
    if (currentUser.following.includes(new ObjectId(userToFollowId))) {
      throw new HttpError(409, 'Already following this user');
    }

     await followUserRepo(userId, userToFollowId)
  }

