'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getSingleProfileResponse } from '@/types';
import { checkAuth } from '@/utils/actions/session';
import Notification from '@/models/Notification';
import mongoose from 'mongoose';

/**
 * Any authenticated role
 * handles query profile by session id
 *
 */
export const updateNotificationBySessionIdAction = async (data: any, get?: number): Promise<getSingleProfileResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let updated;
    switch (data.type.toLowerCase()) {
      case 'mark all as read':
        updated = await Notification.updateMany({ to: session.user._id, type: 'FRESH' }, { $set: { type: 'OLD' } }).exec();
        break;
      case 'single':
        if (!data.notifId || !mongoose.Types.ObjectId.isValid(data.notifId)) return { error: 'Invalid data', status: 400 };
        updated = await Notification.findOneAndUpdate({ _id: data.notifId, to: session.user._id, type: 'FRESH' }, { $set: { type: 'OLD' } }).exec();
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }

    return { success: true, userId: session.user._id.toString(), status: 200 };
  });
};
