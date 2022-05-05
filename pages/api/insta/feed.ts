import type { NextApiRequest, NextApiResponse } from 'next';
import { getClient } from '../../../config/redis';
import fetch from 'node-fetch';
import { ENV } from '../../../config/env';

const isDev = ENV === 'development';
const cacheAge = (isDev ? 60 : 60 * 60) * 1000;

const feedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  //CONNECT REDIS
  const client = await getClient();

  const instaToken = await client.get('instaToken');
  let instaFeed = String(await client.get('instaFeed'));
  const instaFeedSaveTime = Number(await client.get('instaFeedSaveTime'));
  const currTime = new Date().getTime();

  if (currTime - instaFeedSaveTime > cacheAge) {
    const fields =
      'id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username';
    const endPoint = `https://graph.instagram.com/v12.0/me/media?fields=${fields}&access_token=${instaToken}`;
    const data = await fetch(endPoint);
    const statusCode = data.status;
    if (statusCode == 200) {
      const json: any = await data.json();
      await client.set('instaFeed', JSON.stringify(json));
      await client.set('instaFeedSaveTime', currTime);
      instaFeed = json;
      console.log('Feed updated in Redis, expiry time:', currTime + cacheAge);
    } else {
      console.log('Could not save feed');
      console.log(data);
    }
  }

  res.json(instaFeed);
};

export default feedHandler;
