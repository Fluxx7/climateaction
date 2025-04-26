import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    return res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error initializing database', error: error instanceof Error ? error.message : String(error) });
  }
}

