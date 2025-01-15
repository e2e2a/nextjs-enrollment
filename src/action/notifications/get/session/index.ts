'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getSingleProfileResponse } from '@/types';
import { checkAuth } from '@/utils/actions/session';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import DeanProfile from '@/models/DeanProfile';
import AdminProfile from '@/models/AdminProfile';
import AccountingProfile from '@/models/AccountingProfile';
import { getFreshNotificationByUserId, getNotificationByUserId, getOldNotificationByUserId } from '@/services/notification';

/**
 * Any authenticated role
 * handles query profile by session id
 *
 */
export const getNotificationBySessionIdAction = async (type: string, get?: number): Promise<getSingleProfileResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    // const notifications = await getNotificationByUserId(session.user._id, get);
    let notifications;
    switch (type) {
      case 'FRESH':
        notifications = await getFreshNotificationByUserId(session.user._id);
        break;
      case 'OLD':
        notifications = await getOldNotificationByUserId(session.user._id, get);
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }

    // const toProfile = await getToProfile(session);
    if (notifications.length > 0) {
      for (let notif of notifications) {
        // notif.to = { ...notif.to, ...toProfile.profile };
        if (notif.from) {
          const fromProfile = await getToProfile(session);
          notif.from = { ...notif.from, ...fromProfile.profile };
        } else {
          notif.from = { ...notif.from, type: 'Admin' };
        }
      }
    }

    if (type === 'OLD' && get) {
      if (get > notifications.length) return { error: 'No more notification found', notifications: JSON.parse(JSON.stringify(notifications)), type: 'show more', status: 404 };
    }

    return { notifications: JSON.parse(JSON.stringify(notifications)), status: 200 };
  });
};

/**
 * check roles
 *
 * @param {object} session
 */
const getToProfile = async (session: any): Promise<any> => {
  return tryCatch(async () => {
    let profile;
    switch (session.user.role) {
      case 'STUDENT':
        profile = await StudentProfile.findOne({ userId: session.user._id }).select('firstname middlename lastname extensionName');
        break;
      case 'TEACHER':
        profile = await TeacherProfile.findOne({ userId: session.user._id }).select('firstname middlename lastname extensionName');
        break;
      case 'DEAN':
        profile = await DeanProfile.findOne({ userId: session.user._id }).select('firstname middlename lastname extensionName');
        break;
      case 'ADMIN':
        profile = await AdminProfile.findOne({ userId: session.user._id }).select('firstname middlename lastname extensionName');
        break;
      case 'ACCOUNTING':
        profile = await AccountingProfile.findOne({ userId: session.user._id }).select('firstname middlename lastname extensionName');
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { profile: JSON.parse(JSON.stringify(profile)), status: 200 };
  });
};
