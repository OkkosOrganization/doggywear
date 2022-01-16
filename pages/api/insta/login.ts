import type { NextApiRequest, NextApiResponse } from 'next';
import { INSTAGRAM_APP_ID, INSTAGRAM_REDIRECT_URL } from '../../../config/env';

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URL}&scope=user_profile,user_media&response_type=code`;
  res.redirect(307, redirectUrl).end();
};

export default loginHandler;
