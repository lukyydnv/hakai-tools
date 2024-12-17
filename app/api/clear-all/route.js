import { NextResponse } from 'next/server';
import { clearAllMessages } from '../clear';

export async function POST(request) {
  const { token } = await request.json();
  const result = await clearAllMessages(token);
  return NextResponse.json(result);
}

