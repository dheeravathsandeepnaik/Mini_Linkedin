# Mini LinkedIn Backend API

A Node.js/Express backend API for the Mini LinkedIn application with MongoDB integration.

## Features

- User authentication (register/login) with JWT tokens
- User profiles with customizable bio and location
- Post creation, viewing, and management
- Like/unlike posts functionality
- Comment system for posts
- MongoDB integration with Mongoose ODM
- Input validation and error handling
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env` file and update the values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens
   - `PORT`: Server port (default: 5000)

4. Start MongoDB service (if running locally)

5. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/:userId` - Get user profile by ID
- `GET /api/auth/me` - Get current user profile (requires auth)

### Posts
- `POST /api/posts` - Create a new post (requires auth)
- `GET /api/posts` - Get all posts with pagination
- `GET /api/posts/user/:userId` - Get posts by specific user
- `GET /api/posts/:postId` - Get single post by ID
- `POST /api/posts/:postId/like` - Like/unlike a post (requires auth)
- `POST /api/posts/:postId/comment` - Add comment to post (requires auth)
- `DELETE /api/posts/:postId` - Delete post (requires auth, author only)

### Health Check
- `GET /api/health` - API health check

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User Model
- name, email, password (hashed)
- bio, location, profilePicture
- connections (array of user IDs)
- posts (array of post IDs)

### Post Model
- content, author (user ID)
- likes (array with user ID and timestamp)
- comments (array with user ID, content, timestamp)
- image (optional)

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- 404 Not Found errors
- 500 Server errors
