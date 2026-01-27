# Vercel KV Setup Instructions

## Steps to Enable Vercel KV

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Vercel KV Database**
   - Go to your Vercel dashboard: https://vercel.com/dashboard
   - Select your project (rowing-checklist)
   - Go to the "Storage" tab
   - Click "Create Database" or "Connect Store"
   - You'll be directed to the Marketplace
   - Look for "Vercel KV" or "Redis" (they're the same thing)
   - Click on it and select "Add Integration" or "Create"
   - Choose a name (e.g., "rowing-checklist-kv")
   - Select a region close to your users (e.g., US East, EU West)
   - Click "Create" or "Continue"
   - Connect it to your rowing-checklist project

3. **Connect to Your Project**
   - Vercel will automatically add the required environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`
   - These are automatically available to your API routes

4. **Deploy**
   - Push your changes to git
   - Vercel will automatically deploy with KV enabled
   - The API routes in `/api` will now work

## Local Development

For local development, you'll need to pull the environment variables:

```bash
vercel env pull .env.local
```

Then run your dev server:
```bash
npm run dev
```

## Testing

Once deployed, your API endpoints will be available at:
- `https://your-domain.vercel.app/api/auth/register`
- `https://your-domain.vercel.app/api/auth/login`
- `https://your-domain.vercel.app/api/log/read`
- `https://your-domain.vercel.app/api/log/write`
