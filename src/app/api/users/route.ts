import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';
import {User} from '@/models/User';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/db';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect()
   
    // const headersList = headers();
    // const apiKey = headersList.get('x-api-key');
    // const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
    // const session = await auth();
    // if (!session) {
    //     return res.status(401).json({ error: 'User not authenticated' });
    //   }

    // if (!apiKey || apiKey !== NEXT_PUBLIC_API_KEY) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized access: API key missing or invalid.' },
    //     { status: 401 }
    //   );
    // }
    // if (session && session.user.role !== 'ADMIN') {
    //     return NextResponse.json(
    //     {
    //       error: 'Unauthorized access: User does not have admin privileges.',
    //     },
    //     { status: 401 }
    //   );
    // }
    if (req.method !== 'GET') {
      return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const users = await User.find().exec();

    return NextResponse.json({ users: users }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
