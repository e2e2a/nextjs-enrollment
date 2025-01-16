'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getSingleProfileResponse } from '@/types';
import { checkAuth } from '@/utils/actions/session';
import Notification from '@/models/Notification';

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
        updated = await Notification.findOneAndUpdate({ to: session.user._id, type: 'FRESH' }, { type: 'OLD' }).exec();
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }

    return { success: true, userId: session.user._id.toString(), status: 200 };
  });
};
