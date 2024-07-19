'use server';
import { UserIp } from '@/models/UserIp';
import { getIpAddress } from './getIp';

export const checkingIp = async (user: any) => {
  try {
    console.log('userId', user._id);
    const ip = await getIpAddress();
    if (!ip) return { errorIp: 'User has no IP address' };
    const existingActiveIp = await UserIp.findOne({ userId: user._id });
    if (!existingActiveIp) return { errorIp: 'User has No activeIp.' };

    const currentIpArray = existingActiveIp.ips.map((obj: any) => obj.address); 

    if (currentIpArray.flat().includes(ip)) {
      console.log(`ActiveIp entry for userId ${user._id} already exists with IP ${ip}`);
      return { success: 'User using the same IP.' };
    }
    return { error: 'User has different ip. ' };
  } catch (error) {
    console.log('error', error);
    return { error: 'Something went wrong' };
  }
};
