import User, { IUser } from "../models/user.model";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const followUserRepo = async (userId: string, userToFollowId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $addToSet: { following: userToFollowId } }).exec();
}
