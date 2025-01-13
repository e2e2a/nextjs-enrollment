'use server';
import { Notification } from '@/models/Notifcation';
import mongoose from 'mongoose';

export const createNotification = async (data: any) => {
  try {
    const newNotif = await Notification.create({ ...data });
    return newNotif;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNotificationByUserId = async (userId: string, get:number) => {
  try {
    const notifications = await Notification.find({ to: userId }).populate('to').populate('from').limit(get).lean();
    return notifications;
  } catch (error) {
    console.log(error);
    return [];
  }
};
