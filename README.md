# Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and admin features. Built with Node.js/Express backend, React frontend, MongoDB database, and styled with Tailwind CSS.

## Features

### Backend API
- **User Authentication**
  - User registration and login with email validation
  - JWT token-based authentication
  - Password hashing with bcryptjs
  - Admin role support

- **Sweet Management**
  - Create, Read, Update, Delete (CRUD) operations for sweets
  - Search and filter by name, category, and price range
  - Inventory management with quantity tracking
  - Admin-only operations for adding/updating/deleting sweets

- **Inventory Management**
  - Purchase functionality with quantity management
  - Restock functionality for admins
  - Prevent over-purchasing with stock validation

### Frontend Application
- **User Interface**
  - Beautiful, responsive design with Tailwind CSS
  - User registration and login pages
  - Dashboard with sweet listing and search
  - Admin panel for sweet management

- **User Features**
  - Browse all available sweets
  - Search and filter sweets by various criteria
  - Purchase sweets with quantity selection
  - Purchase button disabled for out-of-stock items

- **Admin Features**
  - Add new sweets to inventory
  - Update sweet details
  - Delete sweets from catalog
  - Restock sweets
  - Admin badge indicator

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest
- **Additional**: CORS, dotenv

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Sweet.ts
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   └── SweetController.ts
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   └── SweetService.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── sweetRoutes.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   ├── __tests__/
│   │   │   └── services/
│   │   │       ├── AuthService.test.ts
│   │   │       └── SweetService.test.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SweetCard.tsx
│   │   │   └── Header.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useNavigate.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

### Authentication
```
POST /api/auth/register
  - Body: { email, username, password, confirmPassword }
  - Returns: { message, token, user }

POST /api/auth/login
  - Body: { email, password }
  - Returns: { message, token, user }

GET /api/auth/me (Protected)
  - Returns: { user }
```

### Sweets
```
GET /api/sweets
  - Returns: { count, sweets[] }

GET /api/sweets/:id
  - Returns: { sweet }

GET /api/sweets/search?name=...&category=...&minPrice=...&maxPrice=...
  - Returns: { count, sweets[] }

POST /api/sweets (Protected, Admin only)
  - Body: { name, category, price, quantity, description, image }
  - Returns: { message, sweet }

PUT /api/sweets/:id (Protected, Admin only)
  - Body: { name, category, price, quantity, description, image }
  - Returns: { message, sweet }

DELETE /api/sweets/:id (Protected, Admin only)
  - Returns: { message, sweet }

POST /api/sweets/:id/purchase (Protected)
  - Body: { quantity }
  - Returns: { message, sweet }

POST /api/sweets/:id/restock (Protected, Admin only)
  - Body: { quantity }
  - Returns: { message, sweet }
```

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

5. Run the development server:
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

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
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
```

### Test Coverage
The test suite includes:
- **AuthService Tests**: User registration, login, and user retrieval
- **SweetService Tests**: CRUD operations, search, purchase, and restock functionality

## Database Models

### User
```typescript
{
  _id: ObjectId
  email: string (unique, required)
  username: string (unique, required)
  password: string (hashed, required)
  isAdmin: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### Sweet
```typescript
{
  _id: ObjectId
  name: string (unique, required)
  category: string (required)
  price: number (required, non-negative)
  quantity: number (required, non-negative, default: 0)
  description: string (optional)
  image: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

### Frontend
Uses environment variables from Vite config for API proxy

## Usage Guide

### For Regular Users

1. **Register**: Create an account with email, username, and password
2. **Login**: Sign in with your credentials
3. **Browse Sweets**: View all available sweets on the dashboard
4. **Search/Filter**: Use the search bar to find sweets by name, category, or price
5. **Purchase**: Select quantity and click "Buy" to purchase a sweet
6. **Logout**: Click logout to sign out

### For Admin Users

1. Complete the regular user steps above
2. **Add Sweet**: Click "Add New Sweet" to add inventory
3. **Edit Sweet**: Click "Edit" on any sweet card to update details
4. **Delete Sweet**: Click "Delete" on any sweet card to remove it
5. **Restock**: Update the quantity when editing a sweet
6. **Admin Badge**: Your admin status is indicated with a badge

## My AI Usage

### Overview
I used GitHub Copilot extensively throughout this project to accelerate development while maintaining code quality and authenticity. AI was leveraged strategically for boilerplate generation, test creation, and debugging.

### Specific AI Usage Examples

1. **Backend Architecture & Setup**
   - Used Copilot to generate the initial Express.js server structure with TypeScript configuration
   - Generated boilerplate for middleware setup and CORS configuration
   - Created MongoDB connection patterns and Mongoose schema definitions

2. **Authentication System**
   - Copilot helped generate JWT utility functions for token creation and verification
   - Generated authentication middleware with request type extensions
   - Created password hashing and validation logic using bcryptjs

3. **Service Layer Implementation**
   - Used Copilot to generate CRUD operation patterns in AuthService and SweetService
   - Generated business logic for inventory management (purchase, restock)
   - Created search and filter functionality with MongoDB queries

4. **API Controllers**
   - Generated request validation and error handling patterns
   - Created HTTP response formatting for consistency
   - Generated admin authorization check implementations

5. **Frontend Component Development**
   - Used Copilot to generate React component templates for Login, Register, and Dashboard
   - Generated Tailwind CSS styling classes for responsive design
   - Created form handling and state management patterns

6. **Testing**
   - Used Copilot to generate Jest test suites for services
   - Created mock implementations for MongoDB models
   - Generated test cases covering both success and error scenarios

7. **API Client Integration**
   - Generated Axios service wrapper with interceptors for JWT tokens
   - Created TypeScript interfaces for API requests and responses
   - Generated React Context for state management

8. **UI/UX Components**
   - Generated SweetCard component with conditional rendering
   - Created admin form components with dynamic field handling
   - Generated responsive grid layouts with Tailwind CSS

### Impact on Development Workflow

**Positive Impacts:**
- Significantly reduced time spent on boilerplate code generation
- Improved consistency across similar code patterns
- Allowed focus on business logic and feature implementation
- Helped identify best practices for error handling and validation
- Accelerated testing process by generating test templates

**Responsible AI Usage:**
- All AI-generated code was reviewed and tested
- Customized templates to match project requirements
- Added manual enhancements and bug fixes
- Ensured code follows SOLID principles and clean code practices
- Maintained original logic and unique implementations

**Total Development Efficiency:**
- Estimated 40% reduction in development time
- All features implemented with high test coverage
- Maintainable and extensible codebase

## Error Handling

The application includes comprehensive error handling:

- **Validation**: Input validation on both client and server
- **Authentication Errors**: Clear messages for login/registration failures
- **Database Errors**: Proper error responses from MongoDB operations
- **Authorization**: Admin-only operations properly protected
- **Network Errors**: Graceful handling of API failures

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Authorization Checks**: Role-based access control
- **Input Validation**: Server-side validation of all inputs
- **CORS**: Configured CORS for secure cross-origin requests

## Performance Optimizations

- **Frontend**: 
  - Lazy component rendering
  - Efficient state management with Context API
  - Responsive images with Tailwind CSS
  
- **Backend**:
  - MongoDB indexing on frequently queried fields
  - Efficient query patterns
  - Proper error handling to prevent server crashes

## Known Limitations

- In-memory navigation state (future: implement React Router)
- No real image upload (uses URLs)
- No payment integration
- No email verification
- No password reset functionality
- No pagination for large datasets

## Future Enhancements

1. Implement React Router for better navigation
2. Add email verification for registration
3. Implement password reset functionality
4. Add image upload functionality
5. Implement pagination for sweets list
6. Add order history and purchase tracking
7. Implement wish list feature
8. Add reviews and ratings
9. Implement payment gateway integration
10. Add notification system

## Deployment

### Deploy Backend (Heroku)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Follow Vercel or Netlify deployment instructions
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify `MONGODB_URI` in `.env` file

### Port Already in Use
- Change PORT in `.env` for backend
- Change port in Vite config for frontend

### CORS Errors
- Ensure backend CORS is configured correctly
- Check API endpoint URLs in frontend

### Authentication Issues
- Verify JWT_SECRET in `.env`
- Check token is being stored in localStorage
- Ensure Authorization header is sent with requests

## Contributing

Contributions are welcome! Please follow the TDD approach and include tests with your changes.

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using GitHub Copilot**

*This project demonstrates modern full-stack development practices with emphasis on clean code, testing, and responsible AI usage in software development.*
