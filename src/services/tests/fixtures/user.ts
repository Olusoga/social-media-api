import { Types } from 'mongoose';
import { IUser } from '../../../models/user.model';
import { faker } from '@faker-js/faker';

export const generateMockUser = (): IUser => {
  return {
      id: new Types.ObjectId().toString(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, false, /[A-Z]/, '@1a'),
      following: [new Types.ObjectId(), new Types.ObjectId()],
      comparePassword: jest.fn().mockResolvedValue(true),
  } as unknown as IUser;
};

