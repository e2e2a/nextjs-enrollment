import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/services/user';
import { getVerificationTokenByEmail } from '@/services/verification-token';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const body = await req.json();
    const { token } = body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const existingToken = await getVerificationTokenByEmail(decodedToken.email);
    if (!existingToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    // // Handle different verification types
    // switch (Ttype) {
    //   case 'reset-password':
    //     if (!existingUser || !existingUser.emailVerified) {
    //       return NextResponse.json(
    //         { error: 'User email is not verified. Redirecting to recovery page...' },
    //         { status: 400 }
    //       );
    //     }
    //     break;
    //   default:
    //     break;
    // }
    switch (existingToken.tokenType) {
      case 'Activation':
      case 'Recovery':
        console.log(existingToken.tokenType);
        if (!existingUser || !existingUser.emailVerified) {
          return NextResponse.json({ error: 'User email is not verified. Redirecting to recovery page...' }, { status: 400 });
        }
        break;
      case 'Verify':
        console.log('Verify');
        if (!existingUser) {
          return NextResponse.json({ error: 'User not found.' }, { status: 400 });
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    return NextResponse.json({ existingToken: existingToken }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
