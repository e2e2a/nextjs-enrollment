'use server';
import db from '../db';
import { getIpAddress } from './getIp';

export const checkingIp = async (user: any) => {
  try {
    const ip = await getIpAddress();
    console.log(ip);
    if (!ip) return { errorIp: 'User has no IP address' };
    // if (!user.activeIpAddress || user.activeIpAddress !== ip) {
    //   if (user.recentIpAddress && user.recentIpAddress !== ip) {
    //     return { error: 'Old ip detected!' };
    //   }
    //   return { error: 'New ip detected!' };
    // }
    const existingActiveIp = await db.activeIp.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!existingActiveIp) {
      // await db.activeIp.create({
      //   data: {
      //     userId: user.id,
      //     ip: [],
      //   },
      // });
      return { errorIp: 'User has No activeIp.' };
    }
    const currentIpArray = existingActiveIp.ip || [];
    if (currentIpArray.includes(ip)) {
      // Do nothing if the IP is already the same
      console.log(`ActiveIp entry for userId ${user.id} already exists with IP ${ip}`);
      return { success: 'User using same ip.' };
    }
    return { error: 'User has different ip. ' };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
};
