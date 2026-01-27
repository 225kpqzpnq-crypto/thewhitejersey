# Cloud Sync Implementation - PIN Authentication

## Overview

Your rowing checklist app now has cloud sync with PIN-based authentication! This means:
- Your data is backed up to Vercel KV (Redis)
- You can access your data from any device using your PIN
- No email or complex passwords needed
- Data syncs automatically in the background

## What Was Implemented

### 1. Authentication System
- **PIN-based login**: 4-6 digit PIN for secure access
- **Welcome screen**: Choose to create account or login
- **PIN setup flow**: Enter PIN twice to confirm
- **Automatic authentication**: Stays logged in on device

### 2. Cloud Storage (Vercel KV)
- **API Routes** (in `/api` folder):
  - `/api/auth/register` - Create new account with PIN
  - `/api/auth/login` - Login with existing PIN
  - `/api/log/read` - Fetch user's data
  - `/api/log/write` - Save user's data
- **Security**: PINs are hashed before storage
- **Unique user IDs**: Generated automatically

### 3. Auto-Sync
- **Automatic syncing**: Data syncs to cloud 1 second after changes
- **Local cache**: localStorage still works for offline access
- **Sync indicator**: Shows when data is syncing or if errors occur
- **Debounced**: Avoids excessive API calls

### 4. New UI Components
- **AuthScreen**: PIN setup and login interface with numeric keypad
- **SettingsScreen**: View account info and logout
- **SyncIndicator**: Shows sync status in bottom center
- **Updated Layout**: Settings link in header

## Deployment Steps

### 1. Install Dependencies
```bash
cd apps/rowing-checklist
npm install
```

### 2. Set Up Vercel KV (Redis)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your rowing-checklist project
3. Click on the "Storage" tab
4. Click "Create Database" or "Connect Store"
5. You'll be redirected to the Marketplace
6. Find "Vercel KV" or "Redis" (same thing)
7. Click "Add Integration" or "Create"
8. Choose a name: `rowing-checklist-kv`
9. Select a region close to you (e.g., US East, EU West)
10. Click "Create" and connect to your project

Vercel will automatically add these environment variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. Deploy to Vercel
```bash
git add .
git commit -m "Add PIN authentication and cloud sync with Vercel KV"
git push
```

Vercel will automatically deploy. The API routes in `/api` will be deployed as serverless functions.

### 4. Test the Deployment
1. Visit your deployed site
2. You'll see the welcome screen
3. Create a new account with a 4-6 digit PIN
4. Add some sessions
5. Logout from settings
6. Login again with your PIN - your data should be there!

## Local Development

To test locally with Vercel KV:

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run dev server
npm run dev
```

## How It Works

### First Time User Flow
1. User visits app
2. Sees welcome screen
3. Chooses "Create New Account"
4. Enters 4-6 digit PIN twice
5. Account created, userId stored in localStorage
6. Data automatically syncs to cloud

### Returning User Flow
1. User visits app
2. Sees welcome screen (if on new device) or auto-logs in (same device)
3. If logging in, enters PIN
4. Data loads from cloud
5. All changes sync automatically

### Data Sync Flow
1. User makes changes (adds session, deletes session, etc.)
2. Change saved to localStorage immediately (fast, works offline)
3. After 1 second of inactivity, data syncs to cloud
4. Sync indicator shows at bottom of screen
5. If sync fails, error shown but data still in localStorage

## Security Features

- **PIN Hashing**: PINs are SHA-256 hashed before storage
- **No personal info**: No email or name required
- **Unique IDs**: Each user gets a random UUID
- **CORS enabled**: API routes accept requests from any origin (can be restricted later)

## Data Structure

### Vercel KV Storage
```
pin:{pinHash} → userId
user:{userId}:log → {full log object}
```

### localStorage (Local Cache)
```
rowing-userId → userId (for auto-login)
rowing-checklist-log → {full log object} (local cache)
```

## Troubleshooting

### Sync Errors
If you see sync errors:
1. Check Vercel deployment logs
2. Verify KV database is connected
3. Check browser console for error messages

### Lost PIN
Unfortunately, if you lose your PIN, there's no recovery since no email is linked. You'll need to create a new account. Future enhancement: allow optional email for recovery.

### Data Migration
Existing localStorage data will automatically migrate to cloud on first login.

## Future Enhancements

Potential additions:
- Optional email for PIN recovery
- Export/import data as backup
- Share sessions between accounts
- Rate limiting to prevent brute force PIN attacks
- PIN change functionality in settings

## Files Created

### API Routes
- `/api/auth/register.js` - Registration endpoint
- `/api/auth/login.js` - Login endpoint
- `/api/log/read.js` - Fetch data endpoint
- `/api/log/write.js` - Save data endpoint

### Frontend Components
- `/src/screens/AuthScreen.jsx` - PIN auth interface
- `/src/screens/SettingsScreen.jsx` - Settings page
- `/src/components/SyncIndicator.jsx` - Sync status display
- `/src/hooks/useAuth.js` - Authentication state management

### Updated Files
- `/src/App.jsx` - Added auth check
- `/src/components/Layout.jsx` - Added settings link and sync indicator
- `/src/hooks/useDailyLog.js` - Added cloud sync logic
- `/package.json` - Added @vercel/kv dependency

## Cost Considerations

**Vercel KV Free Tier:**
- 256 MB storage
- 30,000 commands per month
- Should be more than enough for personal use

Each user session typically uses:
- 1 write command per change
- 1 read command on load
- Average user: ~100-500 commands/month

You can monitor usage in Vercel dashboard under Storage → Usage.
