import { kv } from '@vercel/kv';

// Hash PIN for secure storage using Web Crypto API
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate unique user ID
function generateUserId() {
  return crypto.randomUUID();
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
      return res.status(400).json({ error: 'PIN must be 4-6 digits' });
    }

    const pinHash = await hashPin(pin);

    // Check if PIN already exists
    const existingUserId = await kv.get(`pin:${pinHash}`);
    if (existingUserId) {
      return res.status(409).json({ error: 'PIN already in use. Please choose a different PIN.' });
    }

    // Create new user
    const userId = generateUserId();

    // Store PIN -> userId mapping
    await kv.set(`pin:${pinHash}`, userId);

    // Initialize empty log for user
    await kv.set(`user:${userId}:log`, {});

    return res.status(201).json({
      success: true,
      userId,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
