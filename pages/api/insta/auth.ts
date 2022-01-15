import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const APP_ID = '934906070506923';
const APP_SECRET = '27f20da90dfbc94abe998130008187dd';
const REDIRECT_URI = 'https://doggywear.shop/api/insta/auth';

type ApiResponse = {
  access_token?:string;
  user_id?:string;
  expires_in?:string;
}

const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let code = String(req.query?.code);
  if(code.includes('#_'))
    code = code.replace('#_', '');

  let token = '';
  let longToken = '';  
  let longTokenExpires = '';

  const tokenEndPoint = `https://api.instagram.com/oauth/access_token`;
  const tokenFormData = new URLSearchParams();
  tokenFormData.append('client_id', APP_ID);
  tokenFormData.append('client_secret', APP_SECRET);
  tokenFormData.append('redirect_uri', REDIRECT_URI);
  tokenFormData.append('grant_type', 'authorization_code');
  tokenFormData.append('code', code);

  try{
    //GET SHORT-LIVED TOKEN
    const res = await fetch(tokenEndPoint, {
      method:'POST',
      body: tokenFormData,
    });
    const json = await res.json() as ApiResponse;
    token = json?.access_token;    

    //GET LONG-LIVED TOKEN
    const longTokenEndPoint = `https://graph.instagram.com/access_token?grant_type=${'ig_exchange_token'}&client_secret=${APP_SECRET}&access_token=${token}`;
    const longTokenRes = await fetch(longTokenEndPoint, {method:'GET'});
    const longTokenJson = await longTokenRes.json() as ApiResponse;
    longToken = longTokenJson?.access_token;
    longTokenExpires = longTokenJson?.expires_in;
  }
  catch(e){
    console.log(e);
    return res.status(400).json({ error: e });
  }

  res.status(200).json({ 
    token: token,
    longToken: longToken,
    longTokenExpires: longTokenExpires
   });
};

export default authHandler;