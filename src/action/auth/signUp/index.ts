'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { sendEmail } from '@/lib/mail/mail';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { createStudentProfile } from '@/services/studentProfile';
import { generateVerificationToken } from '@/services/token';
import { createUser } from '@/services/user';
import { checkNewEmail } from '@/utils/actions/user/email';
import { checkNewUsername } from '@/utils/actions/user/username';

/**
 * Handles the user sign-up process.
 *
 * @param {Object} data
 */
export const signUpAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const validatedFields = SignupValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const { email, password, username } = validatedFields.data;

    const checkConflict = await checkingConflict(email, username);
    if (!checkConflict.success) return { error: checkConflict?.error, status: checkConflict?.status };

    const newUser = await creatingUser(email, username, password);
    return { message: 'Confirmation email sent!', token: newUser.token, status: 201 };
  });
};

/**
 * Perfoms checking conflict of email and username and store to db
 *
 * @param {string} email
 * @param {string} username
 */
const checkingConflict = async (email: string, username: string) => {
  return tryCatch(async () => {
    const existingUser = await checkNewEmail(email);
    if (existingUser && existingUser.error) return { error: 'Email already exist. Please sign in to continue.', status: existingUser.status };
    const checkedUsername = await checkNewUsername(username);
    if (!checkedUsername || !checkedUsername.success) return { error: checkedUsername?.error, status: checkedUsername?.status };
    return { success: 'success', status: 200 };
  });
};

/**
 * Creates a new user and student profile, generates a verification token, and sends a verification email.
 *
 * @param {string} email
 * @param {string} username
 * @param {string} password
 */
const creatingUser = async (email: string, username: string, password: string) => {
  return tryCatch(async () => {
    const user = await createUser({ email, username }, password);
    await createStudentProfile({ userId: user._id });
    if (!user) return { error: 'Error creating User', status: 404 };

    const tokenType = 'Verify';
    const verificationToken = await generateVerificationToken(user._id, tokenType);

    if (!verificationToken) return { error: 'Error creating verificationToken', status: 404 };

    await sendEmail(email, username, 'Verify', 'auth', verificationToken.code, 'Registration');
    return { user: user, token: verificationToken.token };
  });
};
