import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { getIpAddress } from './getIp';

const trackersIp: Record<string, { count: number; expiresAt: number; emails: Record<string, { count: number }> }> = {};

const maxRequestsPerDevice = 20;
const expirationTimeMs = 3 * 60 * 1000; // 3 minutes

export default async function rateLimit(maxEmailRequests: number, email: string) {
  let uniqueId = headers().get('uniqueId') || uuidv4();
  const ip = await getIpAddress();
  console.log(ip);
  const currentTime = Date.now();

  if (!ip) {
    throw new Error('IP address not found.');
  }

  if (!email) {
    throw new Error('Email not found.');
  }

  // Initialize or update the IP tracker
  const ipTracker = trackersIp[ip] || { count: 0, emails: {} };
  
  if (!trackersIp[ip]) {
    trackersIp[ip] = ipTracker;
  }
  if (ipTracker.expiresAt < currentTime) {
    ipTracker.count = 0;
    ipTracker.expiresAt = currentTime + expirationTimeMs;
  }

  // Initialize or update the email tracker within the IP tracker
  const trackerEmail = ipTracker.emails[email] || { count: 0 };
  if (!ipTracker.emails[email]) {
    trackerEmail.count = 1;
    ipTracker.emails[email] = trackerEmail;
  }

  // Check if the email count exceeds the limit
  if (trackerEmail.count > maxEmailRequests) {
    throw new Error('Email Rate Limit exceeded.');
  }
  trackerEmail.count++;
  // Check if the IP count exceeds the limit
  if (ipTracker.count > maxRequestsPerDevice) {
    throw new Error('Your are requesting too much. Please try again a few hours.');
  }

  // Increment the email and IP counts
  console.log('ipTracker',ipTracker)
  ipTracker.count++;
}

// import {Ratelimit} from "@upstash/ratelimit";
// import {Redis} from "@upstash/redis";

// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// // Create a new ratelimiter, that allows 5 requests per 5 seconds
// export const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(3, "5 m"),
//   analytics: true,
//   timeout: 1000
// });
