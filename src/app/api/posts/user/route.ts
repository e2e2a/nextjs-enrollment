import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
  try {
    const posts = await db.post.findMany();

    console.log('posts fetched');
    return NextResponse.json({ posts: posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
