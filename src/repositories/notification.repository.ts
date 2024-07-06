import Notification, { INotification } from '../models/notification.model';

export const createNotification = async (notificationData: Partial<INotification>): Promise<INotification> => {
  const notification = new Notification(notificationData);
 return notification.save();
};