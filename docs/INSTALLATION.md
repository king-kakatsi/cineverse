# Installation Guide

This guide will walk you through setting up CineVerse on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB** 6+ (Atlas or local installation)

### Verify Prerequisites

```bash
node --version  # Should be v18.x or higher
npm --version   # Should be v9.x or higher
git --version   # Any recent version
```

## Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/EpitechCodingAcademyPromo2026/C-COD-270-COT-2-1-c2cod270p0-7.git

# Or using SSH
git clone git@github.com:EpitechCodingAcademyPromo2026/C-COD-270-COT-2-1-c2cod270p0-7.git

# Navigate to project directory
cd cineverse
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 15
- React 
- Prisma
- NextAuth.js
- Tailwind CSS
- And all other packages

## Step 3: Database Setup

### Option A: MongoDB Atlas (Recommended for Development)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster (free tier is sufficient)

3. Create a database user:
   - Navigate to Database Access
   - Click "Add New Database User"
   - Choose username and password
   - Grant "Read and write to any database" privilege

4. Whitelist your IP address:
   - Navigate to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" for development

5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - add your collection name just before **?appname=...**

### Option B: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download installer from https://www.mongodb.com/try/download/community
```

Your local connection string will be:
```
mongodb://localhost:27017/cineverse
```

## Step 4: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:


### Generating NEXTAUTH_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32
```

### Getting TMDB API Key

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API
3. Request an API key (choose "Developer" option)
4. Copy your API Key (v3 auth)

### Setting up OAuth (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Setting up Email Service

1. Create account at [Resend](https://resend.com/)
2. Verify your domain (or use test mode)
3. Generate API key
4. Add to `.env` file

## Step 5: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify database connection
npx prisma studio
```

Prisma Studio will open in your browser at `http://localhost:5555`

## Step 6: Seed Database (Optional)

Create initial data for testing:

```bash
# Create a seed script if not exists
npm run seed

# Or manually using Prisma Studio
npx prisma studio
```

## Step 7: Start Development Server

```bash
npm run dev
```

The application will be available at:
```
http://localhost:3000
```

## Step 8: Create Admin Account

1. Register a new account at `http://localhost:3000/register`
2. Verify your email
3. Open Prisma Studio: `npx prisma studio`
4. Navigate to User table
5. Update your user's `role` field to `ADMIN`

## Verification

Test that everything works:

1. **Homepage**: Visit `http://localhost:3000`
2. **Registration**: Create a test account
3. **Login**: Sign in with your account
4. **Movie Sync**: Navigate to Admin > Movies and try syncing with TMDB
5. **Wishlist**: Add a movie to your wishlist

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Verify your database password in DATABASE_URL
- Ensure special characters are URL-encoded

**Error: "Connection timeout"**
- Check your IP whitelist in MongoDB Atlas
- Verify firewall settings

### Prisma Issues

**Error: "Prisma Client not found"**
```bash
npx prisma generate
```

**Error: "Schema validation error"**
```bash
# Reset and regenerate
npx prisma db push --force-reset
npx prisma generate
```

### TMDB API Issues

**Error: "Invalid API key"**
- Verify your TMDB_API_KEY in .env
- Ensure no extra spaces in the key
- Generate a new key if needed

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Development Workflow

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Open database GUI
npx prisma studio
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase
- Check [API.md](./API.md) for API documentation
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) before making changes
- See [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [GitHub Issues](https://github.com/yourusername/cineverse/issues)
3. Contact the development team
4. Check Next.js and Prisma documentation

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [NextAuth.js Documentation](https://next-auth.js.org/)