import { createNotification } from '../repositories/notification.repository';
import  { Types } from 'mongoose';
const { ObjectId } = Types;
import { io } from '../server';

export const sendNotification = async ( userId: string, type: string, message: string) => {
    const user = new ObjectId(userId);
    const notification = await createNotification({ user, type, message });
    io.to(userId).emit('notification', notification);
    return notification;
  };
