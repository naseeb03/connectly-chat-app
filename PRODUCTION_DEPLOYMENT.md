# Production Deployment Guide

This guide explains how to deploy your Connectly chat application to production with minimal configuration changes.

## Overview

The application has been configured to work seamlessly in both development and production environments. The only changes needed for production are environment variables.

## Key Changes Made

1. **Consistent API Routes**: No `/api` prefix differences between dev and production
2. **Unified Environment Variables**: Single `VITE_BACKEND_URL` variable for both HTTP and WebSocket connections
3. **Production-Ready CORS**: Dynamic CORS configuration based on environment variables
4. **Vercel Configuration**: Updated for proper production deployment

## Environment Variables

### Frontend (Vercel/Netlify/etc.)

Set these environment variables in your frontend hosting platform:

```bash
VITE_BACKEND_URL=https://your-backend-domain.com
```

**Note**: In development, this defaults to `http://localhost:5000`. In production, set it to your backend URL.

### Backend (Vercel/Railway/Render/etc.)

Set these environment variables in your backend hosting platform:

```bash
# Required
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-domain.com

# Optional (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server (auto-set by hosting platform)
PORT=5000
NODE_ENV=production
```

## Deployment Steps

### 1. Backend Deployment

1. Deploy your backend to your preferred platform (Vercel, Railway, Render, etc.)
2. Set the environment variables listed above
3. Ensure the backend is accessible via HTTPS

### 2. Frontend Deployment

1. Deploy your frontend to your preferred platform (Vercel, Netlify, etc.)
2. Set `VITE_BACKEND_URL` to your backend URL
3. Ensure the frontend is accessible via HTTPS

### 3. Database Setup

1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Update the `MONGODB_URL` in your backend environment variables

## Example Deployment URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.vercel.app`

In this case, set:
- Frontend: `VITE_BACKEND_URL=https://your-api.vercel.app`
- Backend: `CLIENT_URL=https://your-app.vercel.app`

## Security Considerations

1. **JWT Secret**: Use a strong, random secret for `JWT_SECRET`
2. **MongoDB**: Use MongoDB Atlas with proper authentication
3. **CORS**: The `CLIENT_URL` environment variable controls CORS origins
4. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Check that both frontend and backend are using HTTPS

### Socket Connection Issues
- Verify `VITE_BACKEND_URL` is set correctly in frontend
- Ensure the backend supports WebSocket connections

### Authentication Issues
- Check that `JWT_SECRET` is set in backend
- Verify MongoDB connection string is correct

## Development vs Production

The application automatically detects the environment:
- **Development**: Uses `http://localhost:5000` for backend
- **Production**: Uses the `VITE_BACKEND_URL` environment variable

No code changes are needed between environments - only environment variables! 