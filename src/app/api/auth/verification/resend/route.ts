"use server"
import { getUserByEmail } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/helpers/mail';
import { generateVerificationCode } from '@/lib/helpers/tokens';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }
  const body = await req.json();
  const { email } = body;
  const verification = await generateVerificationCode(email);
  if ('error' in verification) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 403 });
  }
  const User = await getUserByEmail(verification.email);
  if (!User) return NextResponse.json({ error: 'User not found' }, { status: 403 });
  await sendVerificationEmail(
    verification.email,
    verification.code,
    User.firstname,
    'Resend Verification'
  );
  return NextResponse.json({ verification: verification, message: 'hello' }, { status: 200 });
}
