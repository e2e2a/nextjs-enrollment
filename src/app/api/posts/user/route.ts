
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
  try {


    return NextResponse.json( { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
