import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const APP_ID = '934906070506923';
const APP_SECRET = '27f20da90dfbc94abe998130008187dd';
const REDIRECT_URI = 'https://doggywear.shop/api/insta/auth';

type ApiResponse = {
  access_token?:string;
  user_id?:string
}

const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let code = String(req.query?.code);
  if(code.includes('#_'))
    code = code.replace('#_', '');

  const endPoint = `https://api.instagram.com/oauth/access_token`;
  const formData = new URLSearchParams();
  formData.append('client_id', APP_ID);
  formData.append('client_secret', APP_SECRET);
  formData.append('redirect_uri', REDIRECT_URI);
  formData.append('grant_type', 'authorization_code');
  formData.append('code', code);
  let token = '';

  try{
     const res = await fetch(endPoint, {
      method:'POST',
      body: formData,
    });
    const json = await res.json() as ApiResponse;
    token = json.access_token;    
  }
  catch(e){
    console.log(e);
    return res.status(400).json({ error: e });
  }

  res.status(200).json({ token: token });
};

export default authHandler;