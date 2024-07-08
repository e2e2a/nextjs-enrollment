'use server';
import { getUserByEmail, updateUserEmailVerifiedById, updateUserIpById } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';
import { deleteVerificationTokenByid, getVerificationTokenByEmail } from '@/services/verification-token';
import { generateResetPasswordToken } from '@/lib/helpers/tokens';
import { signIn } from '@/auth';
import { getIpAddress } from '@/lib/helpers/getIp';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
    const body = await req.json();
    const { email, verificationCode, Ttype } = body;

    const userToken = await getVerificationTokenByEmail(email);
    if (!userToken) return NextResponse.json({ error: 'Somethings went wrong' }, { status: 403 });

    const hasExpired = new Date(userToken.expiresCode) < new Date();
    if (hasExpired) return NextResponse.json({ error: 'Verification Code has expired.' }, { status: 410 });

    if (verificationCode !== userToken.code) return NextResponse.json({ error: 'Verification Code not match.' }, { status: 403 });

    const user = await getUserByEmail(userToken.email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    switch (Ttype) {
      case 'Recovery':
        const RPtoken = await generateResetPasswordToken(email);
        await deleteVerificationTokenByid(userToken.id);
        return NextResponse.json({ token: RPtoken }, { status: 201 });

      case 'Activation':
        const ip = await getIpAddress();
        if(!ip) return NextResponse.json({ error: 'Something went wrong!' }, { status: 403 });
        await deleteVerificationTokenByid(userToken.id);
        await updateUserIpById(user.id, ip)
        await signIn('credentials', {
          email: user.email,
          redirect: false,
        });

        return NextResponse.json({ redirect: '/admin' }, { status: 201 });
      case 'Verify':
        await updateUserEmailVerifiedById(user.id);
        await deleteVerificationTokenByid(userToken.id);
        return NextResponse.json({ redirect: '/sign-in' }, { status: 201 });
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
