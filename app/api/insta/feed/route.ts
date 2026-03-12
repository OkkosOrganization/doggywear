import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '../../../../config/redis';
import fetch from 'node-fetch';
import { ENV } from '../../../../config/env';

interface InstaPost {
  id: string;
  caption: string;
  media_type: string;
  permalink: string;
  timestamp: string;
}
interface InstaResponse {
  data: InstaPost[];
}

const isDev = ENV === 'development';
const cacheAge = (isDev ? 60 : 60 * 60) * 1000; // Millis
const currTime = new Date().getTime(); //Millis
const currTimeInSeconds = Math.round(currTime / 1000); // Seconds
const tenDaysInSeconds = 60 * 60 * 24 * 10; //864 000 seconds

export async function GET(req: NextRequest) {
  //CONNECT REDIS
  const client = await getClient();

  const instaToken = await client.get('instaToken');
  let instaFeed = await client.get('instaFeed');
  const instaFeedSaveTime = Number(await client.get('instaFeedSaveTime'));
  const instaTokenExpiresTime = Number(await client.get('instaTokenExpires'));

  if (instaTokenExpiresTime - currTimeInSeconds <= tenDaysInSeconds) {
    //REFRESH TOKEN AND SAVE
    const refreshEndPoint = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${instaToken}`;
    try {
      console.log('Trying to refresh insta token...');
      const res = await fetch(refreshEndPoint);
      //console.log('Response:', res);
      const resJson = (await res.json()) as {
        'access-token'?: string;
        'expires-in'?: number;
      };
      if (resJson['access-token'] && resJson['expires-in']) {
        const newToken = resJson['access-token'];
        await client.set('instaToken', newToken);
        await client.set(
          'instaTokenExpires',
          currTime + Number(resJson['expires-in'])
        );
        console.log('Token refreshed and saved!');
      } else {
        console.log(
          'Refreshing token failed, no fields in response, maybe token is not yet 24 hours of age'
        );
      }
    } catch (e) {
      console.log('Refreshing token failed:', e);
    }
  }

  if (currTime - instaFeedSaveTime > cacheAge) {
    const fields =
      'id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username';
    const endPoint = `https://graph.instagram.com/v12.0/me/media?fields=${fields}&access_token=${instaToken}`;
    const data = await fetch(endPoint);
    const statusCode = data.status;
    if (statusCode == 200) {
      const json = (await data.json()) as InstaResponse;
      await client.set('instaFeed', JSON.stringify(json));
      await client.set('instaFeedSaveTime', currTime);
      instaFeed = JSON.stringify(json);
      console.log('Feed updated in Redis, expiry time:', currTime + cacheAge);
    } else {
      console.log('Could not save feed');
      //console.log(data);
    }
  }

  // Handle various types for instaFeed
  if (!instaFeed) {
    return NextResponse.json(null);
  }

  try {
    // If it's already an object, return it directly, else parse it
    const data =
      typeof instaFeed === 'string' ? JSON.parse(instaFeed) : instaFeed;
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error parsing insta feed', e);
    return NextResponse.json(null);
  }
}
