import { kv } from '@vercel/kv';

// Hash PIN for secure storage using Web Crypto API
async function hashPin(pin) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Hash error:', error);
    throw new Error('Failed to hash PIN');
  }
}

// Generate unique user ID
function generateUserId() {
  try {
    // Use crypto.randomUUID() if available, otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: generate a simple UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (error) {
    console.error('UUID generation error:', error);
    throw new Error('Failed to generate user ID');
  }
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
    console.log('Register request received');

    const { pin } = req.body;
    console.log('PIN received, length:', pin?.length);

    // Validate PIN
    if (!pin || !/^\d{4,6}$/.test(pin)) {
      console.log('Invalid PIN format');
      return res.status(400).json({ error: 'PIN must be 4-6 digits' });
    }

    console.log('Hashing PIN...');
    const pinHash = await hashPin(pin);
    console.log('PIN hashed successfully');

    // Check if KV is available
    if (!kv) {
      console.error('KV not available');
      return res.status(500).json({ error: 'Database not configured' });
    }

    console.log('Checking for existing PIN...');
    // Check if PIN already exists
    const existingUserId = await kv.get(`pin:${pinHash}`);
    if (existingUserId) {
      console.log('PIN already in use');
      return res.status(409).json({ error: 'PIN already in use. Please choose a different PIN.' });
    }

    console.log('Generating user ID...');
    // Create new user
    const userId = generateUserId();
    console.log('User ID generated:', userId);

    console.log('Storing PIN mapping...');
    // Store PIN -> userId mapping
    await kv.set(`pin:${pinHash}`, userId);
    console.log('PIN mapping stored');

    console.log('Initializing user log...');
    // Initialize empty log for user
    await kv.set(`user:${userId}:log`, {});
    console.log('User log initialized');

    return res.status(201).json({
      success: true,
      userId,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
