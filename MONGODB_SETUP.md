# MongoDB Setup for Vercel Deployment

## Problem
Vercel serverless functions have a **read-only filesystem**, so storing users in `data/users.json` doesn't work in production. This causes 500 errors on `/api/auth/register` and `/api/auth/login`.

## Solution
Use MongoDB Atlas (free tier) for production user storage. The code now supports both:
- **Local development**: Uses `data/users.json` file
- **Production (Vercel)**: Uses MongoDB Atlas when `MONGODB_URI` is set

## Setup Steps

### 1. Create MongoDB Atlas Account (Free)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free M0 cluster (takes ~3-5 minutes)
4. Choose a cloud provider and region (AWS recommended)

### 2. Create Database User
1. In Atlas, go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Username: `ecommerce-user` (or any name)
4. Password: Generate a strong password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

### 3. Allow Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (for Vercel)
   - This adds `0.0.0.0/0` which allows Vercel's dynamic IPs
3. Click **Confirm**

### 4. Get Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database user password
7. Add database name before the `?`:
   ```
   mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER-ID>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
   ```

### 5. Add to Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string from step 4
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 6. Redeploy
1. Go to **Deployments** tab
2. Click **•••** on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-deployment:
   ```bash
   git add .
   git commit -m "Add MongoDB integration"
   git push origin main
   ```

## Testing Locally with MongoDB

If you want to test MongoDB locally (optional):

1. Create a `.env.local` file in your project root:
   ```env
   MONGODB_URI=mongodb+srv://ecommerce-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

2. Install dotenv:
   ```bash
   npm install dotenv
   ```

3. Update `api/server.js` to load .env:
   ```javascript
   import dotenv from 'dotenv';
   dotenv.config({ path: '.env.local' });
   ```

## Verification

After deployment with `MONGODB_URI` set:

1. Test registration: POST to `https://your-app.vercel.app/api/auth/register`
2. Check MongoDB Atlas → **Browse Collections** to see the new user
3. Test login: POST to `https://your-app.vercel.app/api/auth/login`

## Fallback Behavior

The code automatically falls back to file system if:
- `MONGODB_URI` is not set (local development)
- Database connection fails (uses `data/users.json`)

This means:
- ✅ Local development works with or without MongoDB
- ✅ Production works with MongoDB
- ✅ Graceful degradation if database is temporarily unavailable

## Database Collections

The app uses the `ecommerce` database with these collections:
- **users**: User accounts (email, name, password, createdAt, updatedAt)

## Security Notes

⚠️ **Important**: This implementation stores passwords in plain text. For production:

1. Install bcrypt:
   ```bash
   npm install bcrypt
   ```

2. Hash passwords on registration and login (update auth handler)

3. Add JWT tokens for session management

4. Enable MongoDB encryption at rest (Atlas settings)

## Troubleshooting

### Still getting 500 errors?
- Check Vercel logs: `Dashboard → Deployments → Click deployment → Functions tab`
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas → Network Access allows `0.0.0.0/0`
- Verify database user has write permissions

### Connection timeout?
- Check your internet connection
- Verify MongoDB Atlas cluster is not paused
- Try a different region for the cluster

### Data not persisting?
- Check MongoDB Atlas → Collections to verify data is being written
- Verify connection string includes database name (`/ecommerce`)
