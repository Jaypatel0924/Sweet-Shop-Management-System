# Quick Start Guide

Get the Sweet Shop Management System running in 10 minutes!

## Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- Git

## 1. Setup MongoDB (2 minutes)

### Option A: Local MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Get connection string

## 2. Setup Backend (3 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-secret-key-here
PORT=5000
```

Start backend:
```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

## 3. Setup Frontend (3 minutes)

Open **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## 4. Create Test Account (2 minutes)

1. Go to `http://localhost:3000`
2. Click "Register"
3. Fill form and submit
4. Automatically logged in!

## 5. Try Features

### Regular User
- ✅ Browse sweets
- ✅ Search by name/category/price
- ✅ Purchase sweets

### Become Admin

Update database (using MongoDB Compass or shell):

```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

Then:
- ✅ Add new sweets
- ✅ Edit sweets
- ✅ Delete sweets
- ✅ Restock inventory

## Running Tests

```bash
cd backend
npm test
```

## File Overview

```
backend/          Express.js API
frontend/         React SPA
README.md         Main documentation
SETUP.md          Detailed setup guide
API_DOCUMENTATION.md    All endpoints
TEST_REPORT.md    Testing details
DEPLOYMENT.md     Deploy to production
```

## Troubleshooting

### Port 5000 already in use
```bash
# Change PORT in backend/.env to 5001
```

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string in `.env`

### CORS errors
- Ensure backend is on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed instructions
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoints
- Review [TEST_REPORT.md](./TEST_REPORT.md) for testing info
- See [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production

## Commands Cheat Sheet

```bash
# Backend
npm run dev          # Start dev server
npm test             # Run tests
npm run test:watch   # Watch mode tests
npm run build        # Build for production

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
```

---

**That's it!** You now have a fully functional Sweet Shop Management System running locally. 🎉

Need help? See [SETUP.md](./SETUP.md) for detailed instructions.
