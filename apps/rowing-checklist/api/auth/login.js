import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

// Hash PIN for secure storage using Web Crypto API
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
    const { pin } = req.body;

    // Validate PIN
    if (!pin || !/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({ error: 'Invalid PIN format' });
    }

    const pinHash = await hashPin(pin);

    // Look up user by PIN
    const userId = await redis.get(`pin:${pinHash}`);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    return res.status(200).json({
      success: true,
      userId,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
