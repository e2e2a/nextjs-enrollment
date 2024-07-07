import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { token } = body;

    const userToken = await db.resetPassword.findFirst({ where: { token: token } });
    if (!userToken) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 404 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    const existingToken = await db.resetPassword.findFirst({
      where: { email: decodedToken.email, token: decodedToken.token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: 'Please ensure the token you provided.' }, { status: 404 });
    }
    return NextResponse.json({ existingToken: existingToken }, { status: 200 });
  } catch (err) {
    console.error('Error processing request:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
