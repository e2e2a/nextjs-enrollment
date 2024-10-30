// lib/helpers/bcrypt.ts

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export function hashPassword(password: string): Promise<string> {
  const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * Compare a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password.
 * @returns True if the passwords match, otherwise false.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = bcrypt.compare(password, hashedPassword);
  return isMatch;
}
