import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { getClient } from '../../../../config/redis';
import {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  INSTAGRAM_REDIRECT_URL,
} from '../../../../config/env';

type ApiResponse = {
  access_token?: string;
  user_id?: string;
  expires_in?: string;
};

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let code = searchParams.get('code');
  const currTimeInSeconds = Math.round(new Date().getTime() / 1000);

  if (!code) return NextResponse.json({ error: 'noCode' }, { status: 400 });

  if (code.includes('#_')) code = code.replace('#_', '');

  //CONNECT REDIS
  const client = await getClient();

  let token = '';
  let longToken = '';
  let longTokenExpires = 0;
  let userId = '';

  try {
    //GET SHORT-LIVED TOKEN
    const tokenEndPoint = `https://api.instagram.com/oauth/access_token`;
    const tokenFormData = new URLSearchParams();
    tokenFormData.append('client_id', INSTAGRAM_APP_ID);
    tokenFormData.append('client_secret', INSTAGRAM_APP_SECRET);
    tokenFormData.append('redirect_uri', INSTAGRAM_REDIRECT_URL);
    tokenFormData.append('grant_type', 'authorization_code');
    tokenFormData.append('code', code);

    const res = await fetch(tokenEndPoint, {
      method: 'POST',
      body: tokenFormData,
    });
    const json = (await res.json()) as ApiResponse;
    token = json?.access_token || '';
    userId = json?.user_id || '';

    //GET LONG-LIVED TOKEN
    const longTokenEndPoint = `https://graph.instagram.com/access_token?grant_type=${'ig_exchange_token'}&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${token}`;
    const longTokenRes = await fetch(longTokenEndPoint, { method: 'GET' });
    const longTokenJson = (await longTokenRes.json()) as ApiResponse;
    longToken = longTokenJson?.access_token || '';
    longTokenExpires = currTimeInSeconds + Number(longTokenJson?.expires_in);

    //STORE TOKEN
    await client.set('instaToken', longToken);
    await client.set('instaTokenExpires', longTokenExpires);
    await client.set('instaUserId', userId);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }

  return NextResponse.json({
    token: token,
    longToken: longToken,
    longTokenExpires: longTokenExpires,
    userid: userId,
  });
}
