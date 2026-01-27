import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, log } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!log || typeof log !== 'object') {
      return res.status(400).json({ error: 'log must be an object' });
    }

    // Verify user exists
    const existingLog = await redis.get(`user:${userId}:log`);
    if (existingLog === null) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save log data
    await redis.set(`user:${userId}:log`, JSON.stringify(log));

    return res.status(200).json({
      success: true,
      message: 'Log saved successfully',
    });
  } catch (error) {
    console.error('Write log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
