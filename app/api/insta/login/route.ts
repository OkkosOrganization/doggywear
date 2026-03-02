import { NextRequest, NextResponse } from 'next/server';
import {
  INSTAGRAM_APP_ID,
  INSTAGRAM_REDIRECT_URL,
} from '../../../../config/env';

export async function GET(req: NextRequest) {
  const redirectUrl = `https://www.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URL}&scope=business_basic&response_type=code`;
  return NextResponse.redirect(redirectUrl, 307);
}
