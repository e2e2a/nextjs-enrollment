import { sendVerificationEmail } from '@/lib/helpers/mail';
import { generateVerificationToken } from '@/lib/helpers/tokens';
import { RecoveryValidator } from '@/lib/validators/Validator';
import { getUserByEmail } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const body = await req.json();
    const validatedFields = RecoveryValidator.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields!' }, { status: 400 });
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.emailVerified || !existingUser.password) {
      return NextResponse.json({ error: 'Email does not exist!' }, { status: 404 });
    }

    const tokenType = 'Recovery';
    const verificationToken = await generateVerificationToken(email,tokenType);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.code,
      existingUser.firstname,
      'Recovery Activation'
    );

    return NextResponse.json({ success: 'Confirmation email sent!', token: verificationToken.token }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
