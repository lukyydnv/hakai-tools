import { NextResponse } from 'next/server';
import { clearChannel } from '../clear';

export async function POST(request) {
  const { token, channelId } = await request.json();
  const result = await clearChannel(token, channelId);
  return NextResponse.json(result);
}

