"use server"
import { headers } from "next/headers";


export const getIpAddress = async () => {
    const forwardedFor = headers().get('x-forwarded-for');
    const realIp = headers().get('x-real-ip');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    if (realIp) {
      return realIp.trim();
    }
    return null;
  };
  
// export const getIpAddress = async() => {
//     const headersList = headers();
//     const forwarded = headersList.get('x-forwarded-for');
//     const ip = forwarded ?? "127.0.0.1"
//     console.log(ip)
//     const {success, pending, limit, reset, remaining} = await ratelimit.limit(ip)
//     return {success, pending, limit, reset, remaining}
// }