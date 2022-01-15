import type { NextApiRequest, NextApiResponse } from 'next';

const APP_ID = '934906070506923';
const REDIRECT_URI = 'https://doggywear.shop/api/insta/auth';

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(307,redirectUrl).end();
};

export default loginHandler;