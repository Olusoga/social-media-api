import { Types } from "mongoose";
import { createNotification } from "../../../repositories/notification.repository";
import { io } from "../../../server";
import { sendNotification } from "../../notification.service";
const { ObjectId } = Types;
jest.mock('../../../repositories/notification.repository');
jest.mock('../../../server');

describe('sendNotification', () => {
  const userId = new Types.ObjectId().toString();
  const type = 'mention';
  const message = 'You were mentioned in a post';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a notification and emit it to the user', async () => {
    const mockNotification = {
      user: new Types.ObjectId(userId),
      type,
      message,
    };

    (createNotification as jest.Mock).mockResolvedValue(mockNotification);
    const emitMock = jest.fn();
    (io.to as jest.Mock).mockReturnValue({ emit: emitMock });

    const result = await sendNotification(userId, type, message);

    expect(createNotification).toHaveBeenCalledWith({
      user: new Types.ObjectId(userId),
      type,
      message,
    });
    expect(io.to).toHaveBeenCalledWith(userId);
    expect(emitMock).toHaveBeenCalledWith('notification', mockNotification);
    expect(result).toEqual(mockNotification);
  });

  it('should handle errors in creating notifications gracefully', async () => {
    const error = new Error('Database error');
    (createNotification as jest.Mock).mockRejectedValue(error);
    const emitMock = jest.fn();
    (io.to as jest.Mock).mockReturnValue({ emit: emitMock });

    await expect(sendNotification(userId, type, message)).rejects.toThrow(error);

    expect(createNotification).toHaveBeenCalledWith({
      user: new Types.ObjectId(userId),
      type,
      message,
    });
    expect(io.to).not.toHaveBeenCalled();
    expect(emitMock).not.toHaveBeenCalled();
  });
});