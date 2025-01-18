'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getIpAddress } from '@/lib/helpers/limiter/getIp';
import { UserIp } from '@/models/UserIp';
import { createActiveIp } from '@/services/userIp';

export const checkingIp = async (user: any) => {
  return tryCatch(async () => {
    const ip = await getIpAddress();
    if (!ip) return { errorIp: 'User has no IP address' };
    const existingActiveIp = await UserIp.findOne({ userId: user._id }).populate({
      path: 'userId',
      select: '-password',
    });
    if (!existingActiveIp) {
      await createActiveIp(user._id);
      return { error: 'Created Ip.', ip: ip };
    } else {
      const currentIpArray = existingActiveIp.ips.some((ipEntry: any) => ipEntry.address === ip);
      if (currentIpArray) return { success: 'User using the same IP.' };
      return { error: 'User has different ip.', ip: ip };
    }
  });
};
