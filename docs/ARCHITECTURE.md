# Architecture Overview

This document provides a comprehensive overview of CineVerse's architecture, design patterns, and technical decisions.

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────┐
│               Client Browser                     │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │        Next.js Frontend (React)          │    │
│  │  - Pages & Components                    │    │
│  │  - Client-side State Management          │    │
│  │  - UI/UX Layer                           │    │
│  └──────────────┬───────────────────────────┘    │
└─────────────────┼────────────────────────────────┘
                  │ HTTP/HTTPS
                  │
┌─────────────────▼──────────────────────────────┐
│         Next.js Backend (API Routes)           │
│                                                │
│  ┌────────────────────────────────────────┐    │
│  │     Authentication Layer               │    │
│  │     - NextAuth.js                      │    │
│  │     - JWT Tokens                       │    │
│  │     - Session Management               │    │
│  └────────────────┬───────────────────────┘    │
│                   │                            │
│  ┌────────────────▼───────────────────────┐    │
│  │        Business Logic Layer            │    │
│  │  - Movies Management                   │    │
│  │  - User Management                     │    │
│  │  - Comments & Reviews                  │    │
│  │  - Wishlist Operations                 │    │
│  └────────────────┬───────────────────────┘    │
│                   │                            │
│  ┌────────────────▼───────────────────────┐    │
│  │         Data Access Layer              │    │
│  │  - Prisma ORM                          │    │
│  │  - Query Optimization                  │    │
│  └────────────────┬───────────────────────┘    │
└───────────────────┼────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ MongoDB  │  │   TMDB   │  │  Resend  │
│ Database │  │   API    │  │  Email   │
└──────────┘  └──────────┘  └──────────┘
```

## Technology Stack

### Frontend Layer

**Core Technologies:**
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks and server components
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript (JSX)**: Primary language

**State Management:**
- React Context API for global state
- Local state with useState and useReducer
- Server state with Next.js server components

**Routing:**
- Next.js App Router (file-based routing)
- Dynamic routes with `[id]` pattern
- Nested layouts for consistent UI

### Backend Layer

**Core Technologies:**
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Type-safe database client
- **NextAuth.js**: Authentication solution
- **MongoDB**: NoSQL database

**Authentication:**
- JWT-based sessions
- OAuth providers (Google, GitHub)
- Email verification flow
- Password reset functionality

**External Integrations:**
- TMDB API for movie data
- Resend for transactional emails

## Directory Structure

### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.jsx           # Homepage
│   ├── globals.css        # Global styles
│   │
│   ├── account/           # Account management
│   │   ├── verified/
│   │   ├── already-verified/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── admin/             # Admin dashboard
│   │   ├── layout.jsx     # Admin layout
│   │   ├── page.jsx       # Admin home
│   │   ├── movies/        # Movie management
│   │   ├── manage_films/  # Film operations
│   │   ├── manage_users/  # User operations
│   │   └── statistics/    # Analytics
│   │
│   ├── user/              # User profile
│   │   └── favorites/     # User wishlist
│   │
│   ├── movies/            # Movie pages
│   │   └── [id]/         # Dynamic movie detail
│   │
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── movies/        # Movie endpoints
│       ├── users/         # User endpoints
│       ├── comments/      # Comment endpoints
│       └── verify-account/ # Email verification
│
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── films/            # Movie components
│   ├── reviews/          # Review system
│   ├── emails/           # Email templates
│   └── ui/               # Shared UI components
│
├── context/              # React Context
│   ├── MovieContext.jsx  # Movie state
│   └── UserContext.jsx   # User state
│
├── services/             # API services
│   ├── movieService.js
│   ├── userServices.js
│   ├── commentsService.js
│   ├── wishlistService.js
│   └── axiosService.js
│
├── lib/                  # Core libraries
│   ├── prisma.js         # Prisma client
│   ├── auth.js           # Auth utilities
│   ├── movies.js         # Movie operations
│   ├── user.js           # User operations
│   ├── comments.js       # Comment operations
│   ├── tmdb.js           # TMDB integration
│   └── sync.js           # Sync utilities
│
└── helpers/              # Utility functions
    ├── constants.js
    ├── validators.js
    ├── movieHelper.js
    ├── stringHelper.js
    ├── dateHelper.js
    └── listHelper.js
```

## Application Flow

### User Authentication Flow

```
1. User Registration
   ↓
2. Create User Record (password hashed)
   ↓
3. Generate Verification Token
   ↓
4. Send Verification Email
   ↓
5. User Clicks Email Link
   ↓
6. Verify Token & Mark User as Verified
   ↓
7. Redirect to Login

Login Process:
1. User Submits Credentials
   ↓
2. Validate Email & Password
   ↓
3. Check if Email is Verified
   ↓
4. Create NextAuth Session
   ↓
5. Generate JWT Token
   ↓
6. Set Session Cookie
   ↓
7. Redirect to Dashboard
```

### Movie Synchronization Flow

```
Admin Initiates Sync
   ↓
Fetch Movie from TMDB API
   ↓
Validate Movie Data
   ↓
Check if Movie Exists (by tmdbId)
   │
   ├─ Exists → Update Movie
   │
   └─ Not Exists → Create Movie
        ↓
   Fetch Additional Details
   (Cast, Crew, Images)
        ↓
   Save to Database
        ↓
   Return Success Response
```

### Comment Creation Flow

```
User Submits Comment
   ↓
Validate User Authentication
   ↓
Validate Movie Exists
   ↓
Validate Comment Data
   ↓
Create Comment Record
   ↓
Link to User & Movie
   ↓
Update Movie Stats
   ↓
Return Comment with User Info
   ↓
Refresh UI
```

## Performance Optimization

### Database Indexing

```prisma
model Movie {
  // ...
  @@index([tmdbId])
  @@index([title])
  @@index([releaseDate])
}
```

### Query Optimization

```javascript
// Efficient data fetching with Prisma
const movies = await prisma.movie.findMany({
  select: {
    id: true,
    title: true,
    posterPath: true,
    // Only select needed fields
  },
  take: 20, // Pagination
  skip: (page - 1) * 20
});
```

### Client-Side Optimization

- Next.js automatic code splitting
- Image optimization with next/image
- Dynamic imports for large components
- React.memo for expensive components

## Testing Strategy

### Unit Testing
- Test utility functions in `helpers/`
- Test service layer logic
- Mock external dependencies

### Integration Testing
- Test API routes with mock database
- Test authentication flows
- Test TMDB integration

### E2E Testing
- Test complete user workflows
- Test admin operations
- Test error scenarios

## Deployment Architecture

```
┌─────────────────────────────────────┐
│          Cineverse app              │
│                                     │
│  ┌────────────────────────────────┐ │
│  │   Next.js Application          │ │
│  │   - SSR & API Routes           │ │
│  │   - Static Assets (CDN)        │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               ├─────────────────┐
               │                 │
               ▼                 ▼
       ┌─────────────┐   ┌─────────────┐
       │  MongoDB    │   │   External  │
       │   Atlas     │   │   Services  │
       │             │   │  - TMDB     │
       │             │   │  - Resend   │
       └─────────────┘   └─────────────┘
```

## Future Improvements

### Scalability
- Implement caching with Redis
- Add database read replicas
- Implement queue system for background jobs
- Add CDN for images

### Features
- Real-time notifications with WebSocket
- Advanced search with Elasticsearch
- Recommendation engine
- Social features (follow users, share lists)

### Performance
- Implement server-side caching
- Optimize database queries
- Add service worker for offline support
- Implement lazy loading for images