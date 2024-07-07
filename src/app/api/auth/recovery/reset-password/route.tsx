import { getUserByEmail, updateUserPasswordById } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';
import { NewPasswordValidator } from '@/lib/validators/Validator';
import { hashPassword } from '@/lib/helpers/bcrypt';
import { deleteResetPasswordTokenByEmail } from '@/services/reset-password';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { email } = body;
    const validatedFields = NewPasswordValidator.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields!' }, { status: 400 });
    }
    const { password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.emailVerified || !existingUser.password) {
      return NextResponse.json({ error: 'Email does not exist!' }, { status: 404 });
    }
    const data = {
      id: existingUser.id,
      password: password,
    };
    const updateUser = await updateUserPasswordById(data);
    if (!updateUser) return NextResponse.json({ error: 'failed to update the password' }, { status: 403 });
    await deleteResetPasswordTokenByEmail(email)
    return NextResponse.json({ success: 'New Password has been set!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
