import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Fetch user's log data
    const logData = await redis.get(`user:${userId}:log`);

    if (logData === null) {
      return res.status(404).json({ error: 'User not found' });
    }

    const log = logData ? JSON.parse(logData) : {};

    return res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error('Read log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
