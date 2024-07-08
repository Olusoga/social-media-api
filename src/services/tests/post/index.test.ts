import { createNewPost } from '../../post.service';
import {  sendNotification } from '../../notification.service'
import { createPost } from '../../../repositories/post.repository';
import { detectMentions } from '../../../utils/detectmentions';
import { generateMockPost } from '../fixtures/post';
import { Types } from 'mongoose';
const { ObjectId } = Types;


jest.mock('../../../repositories/post.repository');
jest.mock('../../../utils/detectmentions');
jest.mock('../../../services/notification.service');

describe('createNewPost', () => {
  const authorId = new Types.ObjectId().toString();
  const content = 'This is a post with a mention @user1';
  const imageUrl = 'http://example.com/image.jpg';
  const videoUrl = 'http://example.com/video.mp4';
  const mentionedUserIds = ['user1'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post and send notifications to mentioned users', async () => {
  const mockPost = generateMockPost();

  (detectMentions as jest.Mock).mockReturnValue(mentionedUserIds);
  (createPost as jest.Mock).mockResolvedValue(mockPost);
  (sendNotification as jest.Mock).mockResolvedValue(undefined);

  const result = await createNewPost(authorId, content, imageUrl, videoUrl);

  expect(detectMentions).toHaveBeenCalledWith(content);
  expect(createPost).toHaveBeenCalledWith({
  author: (new ObjectId(authorId)),
  content,
  imageUrl,
  videoUrl,
  });
  expect(sendNotification).toHaveBeenCalledTimes(mentionedUserIds.length);
  mentionedUserIds.forEach(userId => {
  expect(sendNotification).toHaveBeenCalledWith(
  userId,
  'mention',
  `You were mentioned in a post by ${authorId}`
  );
  });

  expect(result).toEqual(mockPost);
  });

  it('should handle errors in sending notifications gracefully', async () => {
  const mockPost = generateMockPost();

  (detectMentions as jest.Mock).mockReturnValue(mentionedUserIds);
  (createPost as jest.Mock).mockResolvedValue(mockPost);
  (sendNotification as jest.Mock).mockRejectedValue(new Error('Notification error'));

  const result = await createNewPost(authorId, content, imageUrl, videoUrl);

  expect(detectMentions).toHaveBeenCalledWith(content);
  expect(createPost).toHaveBeenCalledWith({author: new ObjectId(authorId),content,imageUrl, videoUrl,});
  expect(sendNotification).toHaveBeenCalledTimes(mentionedUserIds.length);
  mentionedUserIds.forEach(userId => {
  expect(sendNotification).toHaveBeenCalledWith( userId,'mention',`You were mentioned in a post by ${authorId}` );
    }
  );

  expect(result).toEqual(mockPost);
  });
});
