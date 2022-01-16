import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { client } from '../../../config/redis';
import {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  INSTAGRAM_REDIRECT_URL,
} from '../../../config/env';

type ApiResponse = {
  access_token?: string;
  user_id?: string;
  expires_in?: string;
};

const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let code = String(req.query?.code);

  if (!code) return res.status(400).json({ error: 'noCode' });

  if (code.includes('#_')) code = code.replace('#_', '');

  //CONNECT REDIS
  await client.connect();

  let token = '';
  let longToken = '';
  let longTokenExpires = '';
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
    token = json?.access_token;
    userId = json?.user_id;

    //GET LONG-LIVED TOKEN
    const longTokenEndPoint = `https://graph.instagram.com/access_token?grant_type=${'ig_exchange_token'}&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${token}`;
    const longTokenRes = await fetch(longTokenEndPoint, { method: 'GET' });
    const longTokenJson = (await longTokenRes.json()) as ApiResponse;
    longToken = longTokenJson?.access_token;
    longTokenExpires = longTokenJson?.expires_in;

    //STORE TOKEN
    await client.set('instaToken', longToken);
    await client.set('instaTokenExpires', longTokenExpires);
    await client.set('instaUserId', userId);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }

  res.status(200).json({
    token: token,
    longToken: longToken,
    longTokenExpires: longTokenExpires,
  });
};

export default authHandler;
