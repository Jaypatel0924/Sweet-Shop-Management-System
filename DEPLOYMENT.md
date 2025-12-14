# Sweet Shop Management System - Deployment Guide

This guide covers deploying the Sweet Shop Management System to production environments.

## Deployment Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend API    │         │    MongoDB      │
│  (Vercel/      │────────▶│  (Heroku/Railway)│────────▶│   (Atlas)       │
│  Netlify)       │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## Prerequisites for Deployment

- GitHub repository (public or private)
- MongoDB Atlas account (free tier available)
- Vercel/Netlify account (for frontend)
- Heroku/Railway account (for backend)
- Environment variables configured

## Option 1: Deploy Backend to Heroku

### Step 1: Create Heroku Account

1. Go to [Heroku.com](https://www.heroku.com)
2. Sign up for a free account
3. Install Heroku CLI: `npm install -g heroku`

### Step 2: Initialize Heroku App

```bash
cd backend

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-sweet-shop-api

# Verify app was created
heroku apps
```

### Step 3: Configure Environment Variables

```bash
# Set environment variables on Heroku
heroku config:set JWT_SECRET="your-super-secure-random-string-here"
heroku config:set JWT_EXPIRY="7d"
heroku config:set MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority"
heroku config:set NODE_ENV="production"

# Verify variables were set
heroku config
```

### Step 4: Create Procfile

Create `backend/Procfile`:
```
web: npm start
```

### Step 5: Deploy to Heroku

```bash
# Add Heroku remote if not already added
git remote add heroku https://git.heroku.com/your-sweet-shop-api.git

# Deploy
git push heroku main

# Or if using different branch:
git push heroku your-branch:main

# View logs
heroku logs --tail

# Open deployed app
heroku open
```

### Step 6: Monitor Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Restart app if needed
heroku restart

# Scale dynos
heroku ps:scale web=1
```

## Option 2: Deploy Backend to Railway

### Step 1: Setup Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Connect GitHub Repository

1. Select "Deploy from GitHub repo"
2. Authorize Railway
3. Select your sweet-shop repository

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to Variables
2. Add the following:
```
JWT_SECRET=your-super-secure-random-string-here
JWT_EXPIRY=7d
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sweet-shop
NODE_ENV=production
```

### Step 4: Deploy

Railway will automatically deploy when you push to main branch.

## Option 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project

1. Click "New Project"
2. Import GitHub repository
3. Select `sweet-shop` repository

### Step 3: Configure Build Settings

Vercel should automatically detect Vite:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables

In Vercel dashboard:

1. Go to Settings > Environment Variables
2. Add:
```
VITE_API_URL=https://your-sweet-shop-api.herokuapp.com/api
```

### Step 5: Deploy

```bash
# Deploy from command line
vercel

# Or setup automatic deployments
# Vercel automatically deploys on push to main
```

## Option 4: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. Go to [Netlify.com](https://www.netlify.com)
2. Sign up with GitHub
3. Authorize Netlify

### Step 2: Import Project

1. Click "New site from Git"
2. Select GitHub
3. Choose `sweet-shop` repository

### Step 3: Configure Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: `frontend`

### Step 4: Set Environment Variables

In Netlify dashboard:

1. Go to Site settings > Build & deploy > Environment
2. Add:
```
VITE_API_URL=https://your-sweet-shop-api.herokuapp.com/api
```

### Step 5: Deploy

Netlify automatically deploys on push to main.

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create organization

### Step 2: Create Cluster

1. Click "Create" cluster
2. Select M0 (Free Tier)
3. Select region closest to you
4. Click "Create Cluster" (takes ~10 minutes)

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Give Admin access for development
5. Click "Add User"

### Step 4: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Or add specific IPs for production

### Step 5: Get Connection String

1. Click "Clusters" > "Connect"
2. Select "Connect your application"
3. Copy connection string
4. Replace `<password>` with database user password
5. Use this in `MONGODB_URI` environment variable

### Step 6: Verify Connection

Test the connection string in your app or MongoDB Compass.

## Environment Variables Checklist

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sweet-shop
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=production
```

### Frontend (Vercel/Netlify)

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Post-Deployment Verification

### Test Backend API

```bash
# Health check
curl https://your-api-domain.com/health

# Test registration
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Get all sweets
curl https://your-api-domain.com/api/sweets
```

### Test Frontend

1. Visit deployed frontend URL
2. Test registration and login
3. Verify API calls are successful
4. Check browser console for errors

### Check Logs

**Heroku:**
```bash
heroku logs --tail
```

**Railway:**
```bash
# In Railway dashboard > Deployments > Logs
```

**Vercel/Netlify:**
```bash
# In dashboard > Deployments > Details
```

## Performance Optimization

### Backend Optimization

1. **Enable Compression**
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Cache Headers**
```typescript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

3. **Database Indexing**
```typescript
// Create indexes in MongoDB Atlas
db.users.createIndex({ email: 1 })
db.sweets.createIndex({ name: 1 })
db.sweets.createIndex({ category: 1 })
```

### Frontend Optimization

1. **Lazy Load Components**
```typescript
const Dashboard = lazy(() => import('./components/Dashboard'));
```

2. **Optimize Images**
```typescript
// Use next-gen formats (WebP)
<img src="sweet.webp" alt="Sweet" />
```

3. **Code Splitting**
Vite automatically does code splitting on build.

4. **Minification**
```bash
npm run build # Automatically minifies
```

## SSL/TLS Certificates

### Heroku
- ✅ Automatic SSL certificate included
- Domain: `https://your-app.herokuapp.com`

### Railway
- ✅ Automatic SSL certificate included
- Domain: `https://your-app.railway.app`

### Vercel
- ✅ Automatic SSL certificate
- Auto HTTPS enabled

### Netlify
- ✅ Automatic SSL certificate
- Auto HTTPS enabled
- Free custom domain available

## Custom Domains

### Setup Custom Domain

1. Register domain (GoDaddy, Namecheap, etc.)
2. Update DNS records pointing to:
   - **Vercel**: `cname.vercel-dns.com`
   - **Netlify**: `random-id.netlify.app`
   - **Heroku**: `your-app.herokuapp.com`

3. Add custom domain in dashboard
4. Wait for DNS propagation (15-48 hours)

## Monitoring & Analytics

### Backend Monitoring

Use tools like:
- Heroku Metrics (built-in)
- Railway Logs (built-in)
- Sentry (error tracking)
- DataDog (APM)

### Frontend Monitoring

Use tools like:
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy backend
        run: git push heroku main
```

## Troubleshooting Deployment Issues

### Build Fails on Vercel/Netlify

1. Check build logs
2. Verify environment variables
3. Test build locally: `npm run build`
4. Check node version compatibility

### API Endpoint 404 Errors

1. Verify backend deployment succeeded
2. Check CORS configuration
3. Confirm API URL in frontend environment variables
4. Check network tab in browser DevTools

### MongoDB Connection Fails

1. Verify connection string is correct
2. Check IP whitelist in MongoDB Atlas
3. Test connection with MongoDB Compass
4. Verify database user credentials

### Performance Issues

1. Check server logs for errors
2. Enable caching headers
3. Optimize database queries
4. Add database indexes
5. Use CDN for static assets

## Rollback Plan

### Rollback Backend (Heroku)

```bash
# View releases
heroku releases

# Rollback to previous version
heroku releases:rollback v10
```

### Rollback Frontend (Vercel)

1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

### Rollback Frontend (Netlify)

1. Go to Deployments
2. Click on previous deployment
3. Select "Publish deploy"

## Security Considerations

### Before Production

- [ ] Change JWT_SECRET to strong random value
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Enable MongoDB IP whitelist
- [ ] Set up rate limiting
- [ ] Enable CSRF protection
- [ ] Set security headers

### Security Headers Example

```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## Cost Estimation

### Free Tier Options

| Service | Free Tier | Cost |
|---------|-----------|------|
| Heroku | 550 free dyno hours/month | $7+/month production |
| Railway | $5 credit/month | Pay as you go |
| Vercel | Unlimited | Pay as you go |
| Netlify | 100 GB/month | Pay as you go |
| MongoDB Atlas | 512MB storage | Free |

### Estimated Costs (Small App)

- **Backend**: $5-15/month
- **Frontend**: Free-$5/month
- **Database**: Free
- **Total**: $5-20/month

## Deployment Checklist

- [ ] Code committed to GitHub
- [ ] Tests passing locally
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Custom domain configured (optional)
- [ ] SSL/TLS verified
- [ ] API endpoints tested
- [ ] Frontend tested in production
- [ ] Error logging configured
- [ ] Monitoring enabled
- [ ] Backup strategy implemented

## Maintenance Tasks

### Daily
- Monitor error logs
- Check server uptime

### Weekly
- Review performance metrics
- Check database size
- Monitor costs

### Monthly
- Update dependencies
- Review security logs
- Backup database
- Plan optimizations

---

**Deployment Guide Version**: 1.0  
**Last Updated**: December 2025

For questions or issues with deployment, refer to service-specific documentation:
- [Heroku Docs](https://devcenter.heroku.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
