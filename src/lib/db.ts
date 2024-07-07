// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Allowing global `prisma` only in development to avoid issues in production.
  // This declaration is necessary to avoid TypeScript errors.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = db;

export default db;
