'use server';
import Notification from '@/models/Notification';

export const createNotification = async (data: any) => {
  try {
    const newNotif = await Notification.create({ ...data });
    return newNotif;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNotificationByUserId = async (userId: string, get?: number) => {
  try {
    const notifications = await Notification.find({ to: userId })
      .populate('to')
      .populate('from')
      .limit(get || 0)
      .lean();
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getFreshNotificationByUserId = async (userId: string) => {
  try {
    const notifications = await Notification.find({ to: userId, type: 'FRESH' }).sort({ createdAt: -1 }).populate('from').lean();
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getOldNotificationByUserId = async (userId: string, get?: number) => {
  try {
    if(!get || get === 0) return []
    const notifications = await Notification.find({ to: userId, type: 'OLD' })
      .sort({ createdAt: -1 })
      .populate('from')
      .limit(get)
      .lean();
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};
