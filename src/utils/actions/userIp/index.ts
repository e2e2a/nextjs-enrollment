'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getIpAddress } from '@/lib/limiter/getIp';
import { UserIp } from '@/models/UserIp';
import { createActiveIp } from '@/services/userIp';

export const checkingIp = async (user: any) => {
  return tryCatch(async () => {
    const ip = await getIpAddress();
    if (!ip) return { errorIp: 'User has no IP address' };
    const existingActiveIp = await UserIp.findOne({ userId: user._id });
    if (!existingActiveIp) {
      await createActiveIp(user._id, ip);
      return { error: 'User has different ip.', ip: ip };
    } else {
      const currentIpArray = existingActiveIp.ips.map((obj: any) => obj.address);
      if (currentIpArray.flat().includes(ip)) return { success: 'User using the same IP.' };
      // console.log(`ActiveIp entry for userId ${user._id} already exists with IP ${ip}`);
    }
    return { error: 'User has different ip.', ip: ip };
  });
};
