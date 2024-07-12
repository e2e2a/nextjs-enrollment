import { SigninValidator } from '@/lib/validators/Validator';
import { getUserByEmail } from '@/services/user';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from '@/lib/helpers/rate-limit';
import { comparePassword } from '@/lib/helpers/bcrypt';
import { checkingIp } from '@/lib/helpers/checkingIp';
import { generateVerificationToken } from '@/services/verification-token';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const body = await req.json();
    const validatedFields = SigninValidator.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields!' }, { status: 400 });
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    try {
      const myLimit = await rateLimit(6, email);
    } catch (error) {
      return NextResponse.json({ error: 'Rate Limit exceeded.', limit: true }, { status: 429 });
    }
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 403 });
    }

    if (!existingUser.emailVerified) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 403 });

    const isMatch = await comparePassword(password, existingUser.password as string);

    if (!isMatch) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 403 });

    const userIp = await checkingIp(existingUser);
    if (!userIp || userIp.error || !userIp.success) {
      console.log(userIp.error);
      const tokenType = 'Activation';
      const verificationToken = await generateVerificationToken(email, tokenType);
      return NextResponse.json({ token: verificationToken.token }, { status: 203 });
    }
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error: any) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return NextResponse.json({ error: 'Invalid Credentials.' }, { status: 401 });
          default:
            return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
        }
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
