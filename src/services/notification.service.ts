import { Server as SocketIOServer } from 'socket.io';

export const sendNotification = (io: SocketIOServer, userId: string, message: string) => {
  io.to(userId).emit('notification', message);
};
