import { ObjectId, Types } from 'mongoose';
import { IPost } from '../../../models/post.model';
import { faker } from '@faker-js/faker';

export const generateMockPost = (): IPost => ({
  author: new Types.ObjectId(),
  content: faker.lorem.paragraph(),
  imageUrl: faker.internet.url(),
  videoUrl: faker.internet.url(),
  likes: [new Types.ObjectId()],
  comments: [
    { user: new Types.ObjectId(), text: faker.lorem.sentence() },
  ],
} as unknown as IPost);
