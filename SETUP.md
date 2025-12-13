# Sweet Shop Management System - Setup Guide

This guide will walk you through setting up and running the Sweet Shop Management System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local or Atlas account) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 2GB
- **Disk Space**: At least 1GB free space

## Step-by-Step Installation

### 1. Clone or Download the Repository

```bash
# Clone from repository
git clone <repository-url>
cd "AI Kata Sweet Shop Management System"

# Or if you downloaded it, navigate to the folder
cd "path/to/AI Kata Sweet Shop Management System"
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages:
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin support
- typescript - Type safety
- jest - Testing framework

#### 2.3 Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

#### 2.4 Configure Environment Variables

Edit the `.env` file with your settings:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/sweet-shop

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_here_at_least_32_characters
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong, random string (minimum 32 characters)
- Never commit `.env` file to version control
- Use environment-specific secrets in production

#### 2.5 Start MongoDB

**Option A: Local MongoDB**

```bash
# Windows (if MongoDB is installed)
net start MongoDB

# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env` with your connection string

#### 2.6 Verify MongoDB Connection

```bash
# Test the connection by starting the development server
npm run dev
```

Look for the log message: `MongoDB connected successfully`

If you see this message, MongoDB is properly configured!

#### 2.7 Run Backend in Development Mode

```bash
npm run dev
```

The backend will start on `http://localhost:5000`

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

#### 2.8 Test the Backend

In a new terminal:

```bash
cd backend
npm test
```

This will run the test suite and show coverage.

### 3. Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend

```bash
# In a new terminal window/tab
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

This will install:
- react - UI library
- vite - Build tool
- typescript - Type safety
- tailwindcss - CSS framework
- axios - HTTP client

#### 3.3 Configure API Endpoint

The frontend is already configured to proxy API requests to `http://localhost:5000`. This is handled in `vite.config.ts`.

If you need to change the API endpoint:
- Edit `frontend/src/services/api.ts`
- Change `baseURL: 'http://localhost:5000/api'` to your backend URL

#### 3.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

You should see:
```
VITE v5.0.8 ready in 123 ms
➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 4. Access the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the Login page

## First Time Usage

### Create Test Account

1. Click "Register" link
2. Fill in the registration form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123` (min 6 characters)
   - Confirm Password: `password123`
3. Click "Register"
4. You will be logged in automatically

### Create Admin Account (for testing admin features)

To create an admin account, you'll need to manually update the database:

**Using MongoDB Compass:**
1. Install [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect to your local MongoDB or Atlas
3. Navigate to: `sweet-shop` > `users`
4. Find your user document
5. Change `isAdmin` from `false` to `true`
6. Logout and login again - you'll now have admin features!

**Using MongoDB Shell:**
```bash
# Connect to MongoDB
mongosh

# Switch to sweet-shop database
use sweet-shop

# Update user to admin
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { isAdmin: true } }
)

# Verify the update
db.users.find({ email: "test@example.com" })
```

### Add Sample Sweets (Admin Feature)

1. Login with your admin account
2. Scroll down on the dashboard
3. Click "Add New Sweet"
4. Fill in the form:
   - Name: "Chocolate Cake"
   - Category: "Cake"
   - Price: "50"
   - Quantity: "10"
   - Description: "Delicious chocolate cake"
5. Click "Add Sweet"
6. The sweet will appear in the dashboard!

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection failed`

**Solutions:**
1. Ensure MongoDB is running: `net start MongoDB` (Windows) or `brew services start mongodb-community` (macOS)
2. Check connection string in `.env`
3. If using Atlas, verify your IP is whitelisted in cluster settings

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change PORT in `.env` to `5001` or another available port
2. Or kill the process using the port:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -i :5000` then `kill -9 <PID>`

### CORS Errors in Browser Console

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Ensure backend is running on `http://localhost:5000`
2. Check CORS is enabled in `backend/src/index.ts`
3. Verify frontend API endpoint in `frontend/src/services/api.ts`

### Module Not Found Errors

**Error:** `Cannot find module 'express'` or similar

**Solutions:**
1. Run `npm install` in the appropriate directory
2. Delete `node_modules` and `package-lock.json`, then run `npm install` again
3. Ensure you're in the correct directory

### JWT Token Errors

**Error:** `Invalid or expired token`

**Solutions:**
1. Clear browser localStorage: Open DevTools > Application > Storage > Clear All
2. Logout and login again
3. Verify `JWT_SECRET` is set in `.env`

### MongoDB Atlas Connection Issues

**Error:** `authentication failed` or `connection refused`

**Solutions:**
1. Verify username and password in connection string
2. Check IP whitelist includes your current IP
3. Ensure database name is correct in connection string
4. Create a new cluster if issues persist

## Development Workflows

### Running Both Backend and Frontend

Use multiple terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Tests:**
```bash
cd backend
npm run test:watch
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# This creates a 'dist' folder with optimized files
```

### Debugging

**Frontend Debugging:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension
4. Check Network tab for API calls

**Backend Debugging:**
1. Add `console.log()` statements
2. Use VS Code debugger
3. Check server logs in terminal
4. Use MongoDB Compass to inspect database

## Project Structure Overview

```
backend/
  - src/
    - models/        # MongoDB schemas
    - controllers/   # Request handlers
    - services/      # Business logic
    - middleware/    # Auth middleware
    - routes/        # API routes
    - config/        # Database config
    - utils/         # JWT utilities
    - __tests__/     # Test files

frontend/
  - src/
    - components/   # React components
    - context/      # Auth context
    - services/     # API service
    - hooks/        # Custom hooks
    - types/        # TypeScript types
    - App.tsx       # Main component
    - main.tsx      # Entry point
```

## Next Steps

1. **Explore the API**: Use tools like Postman or curl to test endpoints
2. **Add more sweets**: Use the admin panel to populate the store
3. **Test features**: Create accounts, purchase sweets, test admin functions
4. **Review tests**: Look at test files to understand testing patterns
5. **Customize styling**: Modify Tailwind CSS classes in components
6. **Deploy**: Follow deployment guides in main README.md

## Getting Help

- Check the main README.md for feature documentation
- Review test files for usage examples
- Check server console logs for errors
- Verify all environment variables are set correctly

## Security Notes

**Never:**
- Commit `.env` files to version control
- Share your JWT_SECRET
- Use weak passwords in development
- Expose MongoDB credentials

**Always:**
- Use HTTPS in production
- Validate inputs on both client and server
- Keep dependencies updated
- Use strong, unique JWT_SECRET
- Whitelist IP addresses if using MongoDB Atlas

## Performance Tips

1. **MongoDB**: Create indexes on frequently queried fields
2. **Frontend**: Use React DevTools to check for unnecessary re-renders
3. **Backend**: Monitor API response times in browser Network tab
4. **Images**: Optimize sweet images for web

## Common Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run build        # Build for production
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Support

If you encounter issues:
1. Check this guide for solutions
2. Review error messages carefully
3. Check console logs in browser and terminal
4. Verify all prerequisites are installed
5. Try restarting services

---

**Last Updated:** December 2024
**Version:** 1.0.0
