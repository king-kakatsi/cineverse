# CineVerse

**CineVerse** is a modern movie discovery and management platform that allows users to explore, rate, and organize their favorite films. Built with Next.js 15 and powered by MongoDB with Prisma ORM, CineVerse integrates with TMDB API to provide comprehensive movie information and real-time synchronization.

## Overview

CineVerse transforms the way you discover and interact with movies. Whether you're searching for the latest releases, building your watchlist, or managing a complete film database, CineVerse provides an intuitive interface with powerful features for both users and administrators.

### Why CineVerse?

- **TMDB Integration**: Automatic synchronization with The Movie Database
- **Real-time Updates**: Auto-refresh movie data and popular titles
- **Smart Reviews**: Comment system with replies and ratings
- **Wishlist Management**: Personal collection of favorite movies
- **Admin Dashboard**: Complete control over movies, users, and content
- **Secure Authentication**: Authentication with email verification or google and github
- **Modern Stack**: Next.js 14 with App Router and Server Actions
- **Fully Responsive**: Seamless experience across all devices

## Screenshots

### Register
![CineVerse registration page](./docs/screenshots/cineverse_register.png)

### Login
![CineVerse login page](./docs/screenshots/cineverse_login.png)

### Homepage
![CineVerse homepage](./docs/screenshots/cineverse_home.png)

### Movies' List
![Movies' list view](./docs/screenshots/cineverse_movies_list.png)

### Movie Details
![Movie detail view](./docs/screenshots/cineverse_movie_detail.png)

### Movie Comments
![Movie comment view](./docs/screenshots/cineverse_comments.png)

### User Profile
![User profile space](./docs/screenshots/cineverse_profile.png)

### Update Profile
![Update profile space](./docs/screenshots/cineverse_update_profile.png)

### Admin Dashboard
![Admin panel](./docs/screenshots/cineverse_admin_panel.png)

### Admin User Management Dashboard
![Admin user management panel](./docs/screenshots/cineverse_admin_user_management.png)

### Admin Movie Management Dashboard
![Admin movie management panel](./docs/screenshots/cineverse_admin_movie_management.png)

### Admin Statistics Dashboard
![Admin stats panel](./docs/screenshots/cineverse_admin_stats.png)

## Quick Links

- [Installation Guide](./docs/INSTALLATION.md)
- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Security Guidelines](./docs/SECURITY.md)

## Project Structure

```
cineverse/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── account/               # Account management pages
│   │   ├── admin/                 # Admin dashboard
│   │   ├── api/                   # API routes
│   │   ├── movies/                # Movie pages
│   │   └── user/                  # User profile
│   ├── components/                # React components
│   │   ├── admin/                 # Admin-specific components
│   │   ├── films/                 # Movie components
│   │   ├── reviews/               # Review system
│   │   └── ui/                    # Shared UI components
│   ├── context/                   # React Context providers
│   ├── helpers/                   # Utility functions
│   ├── lib/                       # Core libraries
│   └── services/                  # API service layer
├── prisma/
│   └── schema.prisma              # Database schema
├── docs/                          # Documentation
├── public/                        # Static assets
└── README.md
```

## Features

### For Users

#### Authentication & Profile
- Secure registration with email verification
- OAuth integration (Google, GitHub)
- Password reset functionality
- Profile customization with avatar
- Session management with NextAuth.js

#### Movie Discovery
- Browse popular and trending movies
- Advanced search and filtering
- Genre-based exploration
- TMDB-powered movie information
- Detailed movie pages with cast and crew

#### Reviews & Ratings
- Write detailed movie reviews
- Rate movies with emoji reactions
- Reply to other users' comments
- View community feedback
- Track your review history

#### Wishlist Management
- Add movies to personal wishlist
- Organize favorite films
- Quick access to saved movies
- Remove unwanted items

### For Administrators

#### Movie Management
- Manual movie creation
- TMDB synchronization
- Bulk import popular (or trend, new...) movies
- Edit movie details
- Delete movies with confirmation

#### User Management
- View all registered users
- Update user roles
- Manage user accounts
- Track user activity

#### Content Moderation
- Review and moderate comments
- Delete inappropriate content
- Monitor user interactions

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Context
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js with JWT
- **Email**: React Email + Resend
- **External API**: TMDB API v3

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- MongoDB 6+ (Atlas or local)
- TMDB API key
- Git

### Quick Start

```bash
# Clone the repository (SSH)
git clone git@github.com:EpitechCodingAcademyPromo2026/C-COD-270-COT-2-1-c2cod270p0-7.git
cd cineverse

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

**Access the application:**
```
http://localhost:3000
```

For detailed installation instructions, see [INSTALLATION.md](./docs/INSTALLATION.md)

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/cineverse"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-secret"

# TMDB API
TMDB_API_KEY="your-tmdb-api-key"
TMDB_BASE_URL="https://api.themoviedb.org/3"

# Email Service
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@cineverse.com"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Database Management

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database (caution!)
npx prisma db push --force-reset
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## API Overview

### Authentication Endpoints
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/reset             - Password reset
GET    /api/verify-account         - Email verification
```

### Movies Endpoints
```
GET    /api/movies                 - Get all movies
GET    /api/movies/[id]            - Get movie by ID
POST   /api/movies/manual          - Create movie manually
POST   /api/movies/sync            - Sync with TMDB
GET    /api/movies/tmdb            - Search TMDB
```

### User Endpoints
```
GET    /api/users                  - Get all users
GET    /api/users/[id]             - Get user by ID
PUT    /api/users/[id]             - Update user
DELETE /api/users/[id]             - Delete user
GET    /api/users/wishlist         - Get user wishlist
```

For complete API documentation, see [API.md](./docs/API.md)

## Deployment

CineVerse can be deployed on various platforms:

- **Vercel** 
- **Netlify**
- **Railway**
- **AWS**
- **DigitalOcean**

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Pull request process
- Coding standards

## Security

For security concerns, please review [SECURITY.md](./docs/SECURITY.md) or contact the maintainers privately.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

### Jocelyne Tossi
- **Email**: jocelyne.tossi@epitech.eu
- **WhatsApp**: +221 78 196 19 39
- **Portfolio**: [jocelyne-tossi.linkedin](https://www.linkedin.com/in/jocelyne-benisse-tossi-8739701aa)

### Leroi Kakatsi
- **Email**: leroi.kakatsi@epitech.eu
- **WhatsApp**: +233 53 561 0908
- **Portfolio**: [kingweb.pythonanywhere.com](https://kingweb.pythonanywhere.com)

### Juppé-Styve Hagbe
- **Email**: juppe-styve.hagbe@epitech.eu
- **WhatsApp**: +229 01 90 02 68 93
- **LinkedIn**: [styve-hagbe.linkedIn](https://www.linkedin.com/in/styve-hagbe-261254236)

### Benedicte Gantin
- **Email**: benedicte.gantin@epitech.eu
- **WhatsApp**: +229 01 52 14 98 69
- **Portfolio**: [benedicte-gantin.linkedin](https://www.linkedin.com/in/bénédicte-gantin-038383283)

## Acknowledgments

- Next.js team for the powerful framework
- Prisma team for excellent ORM
- TMDB for comprehensive movie database
- Tailwind CSS for utility-first styling
- The open-source community


**Built with care by The KINGDOM team**