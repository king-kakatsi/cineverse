# Deployment Guide

Complete guide for deploying CineVerse to production environments.

## Deployment Options

CineVerse can be deployed on various platforms:

1. **Vercel** (Recommended) - Optimized for Next.js
2. **Netlify** - Alternative serverless platform
3. **Railway** - Full-stack deployment
4. **AWS** - Custom infrastructure
5. **DigitalOcean** - VPS deployment

## Prerequisites

Before deployment, ensure you have:

- Production database (MongoDB Atlas recommended)
- TMDB API key
- Email service account (Resend)
- OAuth credentials (if using social login)
- Domain name (optional but recommended)

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "New Project"
4. Import your Git repository

### Step 3: Configure Build Settings

Vercel should auto-detect Next.js. Verify settings:

```
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: npm install
```

### Step 4: Environment Variables

Add the following environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/cineverse

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key

# OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-secret

# TMDB
TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

### Step 6: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Deploy schema to production database
npx prisma db push
```

### Step 7: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

### Step 8: Create Admin Account

1. Register via the deployed application
2. Access your MongoDB database
3. Update user role to `ADMIN`:

```javascript
// In MongoDB Atlas or Prisma Studio
db.users.updateOne(
  { email: "admin@yourdomain.com" },
  { $set: { role: "ADMIN", isVerified: true } }
);
```

## Railway Deployment

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
railway init
```

### Step 4: Add MongoDB

```bash
railway add mongodb
```

### Step 5: Set Environment Variables

```bash
railway variables set NEXTAUTH_SECRET=your-secret
railway variables set TMDB_API_KEY=your-key
# Add all other variables
```

### Step 6: Deploy

```bash
railway up
```

## Netlify Deployment

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Build the Project

```bash
npm run build
```

### Step 3: Deploy

```bash
netlify deploy --prod
```

### Step 4: Configure Environment Variables

Add variables in Netlify dashboard under Site settings > Build & deploy > Environment.

## AWS Deployment

### Using AWS Amplify

1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. Add environment variables
5. Deploy

### Using EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your-repo/cineverse.git
cd cineverse

# Install dependencies
npm install

# Setup environment variables
nano .env

# Build application
npm run build

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "cineverse" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## DigitalOcean Deployment

### Using App Platform

1. Go to DigitalOcean App Platform
2. Create new app
3. Connect Git repository
4. Select settings:
   - **Environment**: Node.js
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
5. Add environment variables
6. Deploy

### Using Droplet

Similar to AWS EC2 setup above.

## Production Database Setup

### MongoDB Atlas

1. Create production cluster
2. Configure IP whitelist (add your deployment platform IPs)
3. Create database user with strong password
4. Get connection string
5. Add to environment variables

```env
DATABASE_URL="mongodb+srv://produser:securepass@cluster.mongodb.net/cineverse?retryWrites=true&w=majority"
```

### Database Migration

```bash
# From development to production
npx prisma db push

# Or using migrations
npx prisma migrate deploy
```

## Post-Deployment Checklist

### Security

- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set secure cookie options
- [ ] Enable rate limiting
- [ ] Review database access rules
- [ ] Setup firewall rules
- [ ] Enable monitoring and logging

### Performance

- [ ] Enable caching headers
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Enable compression
- [ ] Setup database indexing
- [ ] Configure connection pooling

### Monitoring

- [ ] Setup error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Setup performance monitoring
- [ ] Enable logging aggregation
- [ ] Configure alerts

### Testing

- [ ] Test all critical user flows
- [ ] Verify email sending
- [ ] Test OAuth login
- [ ] Verify TMDB synchronization
- [ ] Test payment processing (if applicable)
- [ ] Check mobile responsiveness

## Environment-Specific Configuration

### Production .env

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=strong-random-secret
TMDB_API_KEY=your-api-key
RESEND_API_KEY=your-resend-key
```

### Staging .env

```env
NODE_ENV=staging
DATABASE_URL=mongodb+srv://...staging...
NEXTAUTH_URL=https://staging.yourdomain.com
NEXTAUTH_SECRET=different-secret
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID}}
        vercel-project-id: ${{ secrets.PROJECT_ID}}
        vercel-args: '--prod'
```

## Monitoring and Maintenance

### Setup Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Configure Logging

```javascript
// lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Health Check Endpoint

```javascript
// app/api/health/route.js
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

## Backup Strategy

### Database Backups

```bash
# MongoDB Atlas automated backups are enabled by default

# Manual backup
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore backup
mongorestore --uri="mongodb+srv://..." ./backup
```

### Scheduled Backups

Setup automated backups using cron or cloud services:

```bash
# Cron job for daily backups
0 2 * * * /path/to/backup-script.sh
```

## Rollback Procedure

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main
```

## Scaling Strategies

### Horizontal Scaling

- Use load balancer
- Deploy multiple instances
- Implement session store (Redis)
- Use read replicas for database

### Vertical Scaling

- Upgrade server resources
- Optimize database queries
- Implement caching
- Use CDN for static assets

## Troubleshooting

### Deployment Fails

```bash
# Check build logs
vercel logs <deployment-url>

# Test build locally
npm run build
```

### Database Connection Issues

- Verify connection string
- Check IP whitelist
- Verify credentials
- Test connection locally

### Environment Variable Issues

- Verify all required variables are set
- Check for typos
- Restart deployment after changes

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** on production
4. **Implement rate limiting** on API routes
5. **Regular security updates** for dependencies
6. **Monitor for vulnerabilities** with `npm audit`
7. **Use strong passwords** for database and services
8. **Enable 2FA** for deployment platforms
9. **Regular backups** of database
10. **Implement proper CORS** configuration

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## Post-Deployment Tasks

1. **Monitor first 24 hours** closely
2. **Test all critical features** in production
3. **Set up monitoring alerts**
4. **Document any issues** encountered
5. **Create runbooks** for common tasks
6. **Schedule regular maintenance** windows
7. **Plan for scaling** as traffic grows