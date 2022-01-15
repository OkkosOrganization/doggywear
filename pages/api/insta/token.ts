import type { NextApiRequest, NextApiResponse } from 'next';

const tokenHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = String(req.query?.token);
  res.status(200).json({ token: token });
};

export default tokenHandler;