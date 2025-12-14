# API Documentation

Complete API reference for CineVerse backend endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via NextAuth.js session tokens.

### Headers

```http
Content-Type: application/json
Cookie: next-auth.session-token=<session-token>
```

### Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error



## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `400` - Email already exists
- `400` - Invalid email format
- `400` - Password too weak



### Login User

Authenticate user and create session.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "jwt_token"
}
```



### Verify Email

Verify user email address.

**Endpoint:** `GET /api/verify-account?token=<verification_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```



### Request Password Reset

Send password reset email.

**Endpoint:** `POST /api/auth/password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```



### Reset Password

Reset user password with token.

**Endpoint:** `POST /api/auth/reset`

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```



## Movie Endpoints

### Get All Movies

Retrieve list of all movies.

**Endpoint:** `GET /api/movies`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `genre` (optional) - Filter by genre
- `search` (optional) - Search term

**Response:** `200 OK`
```json
{
  "success": true,
  "movies": [
    {
      "id": "movie_id",
      "title": "Inception",
      "overview": "A thief who steals corporate secrets...",
      "posterPath": "/poster.jpg",
      "backdropPath": "/backdrop.jpg",
      "releaseDate": "2010-07-16",
      "voteAverage": 8.8,
      "voteCount": 25000,
      "runtime": 148,
      "genres": ["Action", "Sci-Fi"],
      "tmdbId": 27205
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```



### Get Movie by ID

Retrieve detailed movie information.

**Endpoint:** `GET /api/movies/[id]`

**Response:** `200 OK`
```json
{
  "success": true,
  "movie": {
    "id": "movie_id",
    "title": "Inception",
    "overview": "A thief who steals corporate secrets...",
    "posterPath": "/poster.jpg",
    "backdropPath": "/backdrop.jpg",
    "releaseDate": "2010-07-16",
    "voteAverage": 8.8,
    "voteCount": 25000,
    "runtime": 148,
    "budget": 160000000,
    "revenue": 829895144,
    "genres": ["Action", "Sci-Fi", "Thriller"],
    "cast": [
      {
        "id": "person_id",
        "name": "Leonardo DiCaprio",
        "character": "Cobb",
        "profilePath": "/profile.jpg"
      }
    ],
    "crew": [
      {
        "id": "person_id",
        "name": "Christopher Nolan",
        "job": "Director",
        "profilePath": "/profile.jpg"
      }
    ],
    "tmdbId": 27205
  }
}
```



### Create Movie Manually

Create a new movie entry (Admin only).

**Endpoint:** `POST /api/movies/manual`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "title": "Custom Movie",
  "overview": "Movie description",
  "releaseDate": "2024-01-01",
  "runtime": 120,
  "posterPath": "/poster.jpg",
  "backdropPath": "/backdrop.jpg",
  "genres": ["Action", "Drama"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "movie": {
    "id": "movie_id",
    "title": "Custom Movie",
    "overview": "Movie description",
    "releaseDate": "2024-01-01",
    "runtime": 120
  }
}
```



### Sync Movie from TMDB

Import movie from TMDB database.

**Endpoint:** `POST /api/movies/sync`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "tmdbId": 27205
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "movie": {
    "id": "movie_id",
    "title": "Inception",
    "tmdbId": 27205
  },
  "message": "Movie synced successfully"
}
```



### Sync Popular Movies

Bulk import popular movies from TMDB.

**Endpoint:** `POST /api/movies/sync/popular`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional) - TMDB page number (default: 1)

**Response:** `200 OK`
```json
{
  "success": true,
  "imported": 20,
  "skipped": 0,
  "message": "Successfully imported 20 movies"
}
```



### Search TMDB

Search movies on TMDB.

**Endpoint:** `GET /api/movies/tmdb?query=<search_term>`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `query` (required) - Search term
- `page` (optional) - Page number

**Response:** `200 OK`
```json
{
  "success": true,
  "results": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "A thief who steals corporate secrets...",
      "posterPath": "/poster.jpg",
      "releaseDate": "2010-07-16",
      "voteAverage": 8.8
    }
  ],
  "totalResults": 1
}
```



### Update Movie

Update movie information (Admin only).

**Endpoint:** `PUT /api/movies/[id]`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "title": "Updated Title",
  "overview": "Updated overview",
  "releaseDate": "2024-01-01"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "movie": {
    "id": "movie_id",
    "title": "Updated Title",
    "overview": "Updated overview"
  }
}
```



### Delete Movie

Delete a movie (Admin only).

**Endpoint:** `DELETE /api/movies/[id]`

**Authentication:** Required (Admin role)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```



## Genre Endpoints

### Get All Genres

Retrieve list of all genres.

**Endpoint:** `GET /api/movies/genres`

**Response:** `200 OK`
```json
{
  "success": true,
  "genres": [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" }
  ]
}
```



### Sync Genres from TMDB

Update genres from TMDB (Admin only).

**Endpoint:** `POST /api/movies/genres/sync`

**Authentication:** Required (Admin role)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Genres synced successfully",
  "count": 19
}
```



## Comment Endpoints

### Get Movie Comments

Retrieve comments for a specific movie.

**Endpoint:** `GET /api/movies/[id]/comments`

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "comments": [
    {
      "id": "comment_id",
      "content": "Great movie!",
      "rating": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "/avatar.jpg"
      },
      "replies": [
        {
          "id": "reply_id",
          "content": "I agree!",
          "createdAt": "2024-01-02T00:00:00Z",
          "user": {
            "id": "user_id",
            "firstName": "Jane",
            "lastName": "Smith"
          }
        }
      ]
    }
  ]
}
```



### Create Comment

Add a comment to a movie.

**Endpoint:** `POST /api/comments`

**Authentication:** Required

**Request Body:**
```json
{
  "movieId": "movie_id",
  "content": "This is an amazing movie!",
  "rating": 5
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "comment": {
    "id": "comment_id",
    "content": "This is an amazing movie!",
    "rating": 5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```



### Update Comment

Edit your own comment.

**Endpoint:** `PUT /api/comments/[id]`

**Authentication:** Required (Own comment)

**Request Body:**
```json
{
  "content": "Updated comment text",
  "rating": 4
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "comment": {
    "id": "comment_id",
    "content": "Updated comment text",
    "rating": 4
  }
}
```



### Delete Comment

Delete your own comment or any comment (Admin).

**Endpoint:** `DELETE /api/comments/[id]`

**Authentication:** Required (Own comment or Admin)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```



## User Endpoints

### Get All Users

Retrieve list of all users (Admin only).

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```



### Get User by ID

Retrieve user details.

**Endpoint:** `GET /api/users/[id]`

**Authentication:** Required (Own profile or Admin)

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "/avatar.jpg",
    "role": "USER",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```



### Update User

Update user information.

**Endpoint:** `PUT /api/users/[id]`

**Authentication:** Required (Own profile or Admin)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "/new-avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "/new-avatar.jpg"
  }
}
```



### Update User Email

Change user email address.

**Endpoint:** `PUT /api/users/updateEmail/[id]`

**Authentication:** Required (Own profile)

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "password": "CurrentPassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email updated. Please verify new email."
}
```



### Update User Password

Change user password.

**Endpoint:** `PUT /api/users/updatePassword/[id]`

**Authentication:** Required (Own profile)

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```



### Update User Role

Change user role (Admin only).

**Endpoint:** `PUT /api/users/updateRule/[id]`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "role": "ADMIN"
  }
}
```



### Delete User

Delete user account (Admin only).

**Endpoint:** `DELETE /api/users/[id]`

**Authentication:** Required (Admin role)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```



## Wishlist Endpoints

### Get User Wishlist

Retrieve user's wishlist.

**Endpoint:** `GET /api/users/wishlist`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "wishlist": [
    {
      "id": "movie_id",
      "title": "Inception",
      "posterPath": "/poster.jpg",
      "releaseDate": "2010-07-16",
      "voteAverage": 8.8,
      "addedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```



### Add to Wishlist

Add movie to user's wishlist.

**Endpoint:** `POST /api/users/wishlist/[movieId]`

**Authentication:** Required

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Movie added to wishlist"
}
```



### Remove from Wishlist

Remove movie from wishlist.

**Endpoint:** `DELETE /api/users/wishlist/[movieId]`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Movie removed from wishlist"
}
```



## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `DUPLICATE_ENTRY` - Resource already exists
- `SERVER_ERROR` - Internal server error



## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated requests**: 100 requests per minute
- **Anonymous requests**: 20 requests per minute
- **TMDB sync endpoints**: 10 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```



## Postman Collection

Import the Postman collection for easy API testing:

[Download CineVerse.postman_collection.json](../postman/CineVerse.postman_collection.json)