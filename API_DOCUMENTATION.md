# Sweet Shop Management System - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from login or registration endpoints.

## Response Format

All responses follow this format:

```json
{
  "message": "Success message",
  "data": {}
}
```

Error responses:

```json
{
  "message": "Error description"
}
```

## Auth Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Parameters:**
- `email` (string, required): Valid email address
- `username` (string, required): Unique username
- `password` (string, required): Minimum 6 characters
- `confirmPassword` (string, required): Must match password

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "username",
    "isAdmin": false
  }
}
```

**Error Responses:**

```json
{
  "message": "User with this email or username already exists"
}
```

```json
{
  "message": "Passwords do not match"
}
```

```json
{
  "message": "Password must be at least 6 characters"
}
```

---

### Login User

Authenticates user and returns JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Parameters:**
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "username",
    "isAdmin": false
  }
}
```

**Error Responses:**

```json
{
  "message": "User not found"
}
```

```json
{
  "message": "Invalid password"
}
```

---

### Get Current User

Retrieves the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authentication:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "username",
    "isAdmin": false
  }
}
```

**Error Response:**

```json
{
  "message": "Unauthorized"
}
```

---

## Sweet Endpoints

### Get All Sweets

Retrieves a list of all available sweets.

**Endpoint:** `GET /sweets`

**Authentication:** Optional

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "count": 5,
  "sweets": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Chocolate Cake",
      "category": "Cake",
      "price": 50,
      "quantity": 10,
      "description": "Delicious chocolate cake",
      "image": "https://example.com/cake.jpg",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### Get Sweet by ID

Retrieves a specific sweet by its ID.

**Endpoint:** `GET /sweets/:id`

**Authentication:** Optional

**URL Parameters:**
- `id` (string, required): Sweet's MongoDB ObjectId

**Response (200 OK):**
```json
{
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Chocolate Cake",
    "category": "Cake",
    "price": 50,
    "quantity": 10,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "message": "Sweet not found"
}
```

---

### Search Sweets

Searches for sweets with optional filters.

**Endpoint:** `GET /sweets/search`

**Authentication:** Optional

**Query Parameters:**
- `name` (string, optional): Search by sweet name (case-insensitive)
- `category` (string, optional): Filter by category (case-insensitive)
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter

**Examples:**
```
GET /sweets/search?name=chocolate
GET /sweets/search?category=cake
GET /sweets/search?minPrice=30&maxPrice=100
GET /sweets/search?name=cake&category=dessert&minPrice=40&maxPrice=60
```

**Response (200 OK):**
```json
{
  "count": 2,
  "sweets": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Chocolate Cake",
      "category": "Cake",
      "price": 50,
      "quantity": 10,
      "description": "Delicious chocolate cake",
      "image": "https://example.com/cake.jpg",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### Create Sweet

Creates a new sweet (Admin only).

**Endpoint:** `POST /sweets`

**Authentication:** Required (Bearer token, Admin only)

**Request Body:**
```json
{
  "name": "Chocolate Cake",
  "category": "Cake",
  "price": 50,
  "quantity": 10,
  "description": "Delicious chocolate cake",
  "image": "https://example.com/cake.jpg"
}
```

**Parameters:**
- `name` (string, required): Unique sweet name
- `category` (string, required): Sweet category
- `price` (number, required): Price (must be >= 0)
- `quantity` (number, required): Stock quantity (must be >= 0)
- `description` (string, optional): Sweet description
- `image` (string, optional): Image URL

**Response (201 Created):**
```json
{
  "message": "Sweet created successfully",
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Chocolate Cake",
    "category": "Cake",
    "price": 50,
    "quantity": 10,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "message": "Admin access required"
}
```

```json
{
  "message": "Name, category, price, and quantity are required"
}
```

---

### Update Sweet

Updates a sweet's details (Admin only).

**Endpoint:** `PUT /sweets/:id`

**Authentication:** Required (Bearer token, Admin only)

**URL Parameters:**
- `id` (string, required): Sweet's MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Updated Chocolate Cake",
  "price": 55,
  "quantity": 15
}
```

**Parameters:** (All optional, at least one required)
- `name` (string): Sweet name
- `category` (string): Sweet category
- `price` (number): Price (must be >= 0)
- `quantity` (number): Stock quantity (must be >= 0)
- `description` (string): Sweet description
- `image` (string): Image URL

**Response (200 OK):**
```json
{
  "message": "Sweet updated successfully",
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Updated Chocolate Cake",
    "category": "Cake",
    "price": 55,
    "quantity": 15,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:01.000Z"
  }
}
```

**Error Responses:**

```json
{
  "message": "Sweet not found"
}
```

```json
{
  "message": "Admin access required"
}
```

---

### Delete Sweet

Deletes a sweet from the catalog (Admin only).

**Endpoint:** `DELETE /sweets/:id`

**Authentication:** Required (Bearer token, Admin only)

**URL Parameters:**
- `id` (string, required): Sweet's MongoDB ObjectId

**Response (200 OK):**
```json
{
  "message": "Sweet deleted successfully",
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Chocolate Cake",
    "category": "Cake",
    "price": 50,
    "quantity": 10,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "message": "Sweet not found"
}
```

```json
{
  "message": "Admin access required"
}
```

---

## Inventory Endpoints

### Purchase Sweet

Purchases a sweet and decreases its quantity.

**Endpoint:** `POST /sweets/:id/purchase`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `id` (string, required): Sweet's MongoDB ObjectId

**Request Body:**
```json
{
  "quantity": 2
}
```

**Parameters:**
- `quantity` (number, required): Quantity to purchase (must be >= 1)

**Response (200 OK):**
```json
{
  "message": "Purchase successful",
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Chocolate Cake",
    "category": "Cake",
    "price": 50,
    "quantity": 8,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:02.000Z"
  }
}
```

**Error Responses:**

```json
{
  "message": "Sweet not found"
}
```

```json
{
  "message": "Insufficient quantity in stock"
}
```

```json
{
  "message": "Valid quantity is required"
}
```

```json
{
  "message": "Access token required"
}
```

---

### Restock Sweet

Increases a sweet's quantity (Admin only).

**Endpoint:** `POST /sweets/:id/restock`

**Authentication:** Required (Bearer token, Admin only)

**URL Parameters:**
- `id` (string, required): Sweet's MongoDB ObjectId

**Request Body:**
```json
{
  "quantity": 5
}
```

**Parameters:**
- `quantity` (number, required): Quantity to add (must be >= 1)

**Response (200 OK):**
```json
{
  "message": "Restock successful",
  "sweet": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Chocolate Cake",
    "category": "Cake",
    "price": 50,
    "quantity": 13,
    "description": "Delicious chocolate cake",
    "image": "https://example.com/cake.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:03.000Z"
  }
}
```

**Error Responses:**

```json
{
  "message": "Sweet not found"
}
```

```json
{
  "message": "Admin access required"
}
```

```json
{
  "message": "Valid quantity is required"
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Access denied (e.g., not admin) |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common error messages:
- `"Access token required"` - No token provided
- `"Invalid or expired token"` - Token is invalid or expired
- `"Admin access required"` - User is not an admin
- `"User not found"` - User doesn't exist
- `"Sweet not found"` - Sweet doesn't exist
- `"Insufficient quantity in stock"` - Not enough stock to purchase
- `"User with this email or username already exists"` - Registration conflict

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, implement rate limiting on:
- `/auth/login` - 5 attempts per 15 minutes
- `/auth/register` - 3 attempts per hour
- All other endpoints - Configurable per user tier

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get All Sweets:**
```bash
curl http://localhost:5000/api/sweets
```

**Purchase Sweet:**
```bash
curl -X POST http://localhost:5000/api/sweets/{sweet_id}/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "quantity": 1
  }'
```

### Using Postman

1. Import API requests into Postman
2. Set `{{base_url}}` to `http://localhost:5000/api`
3. Set `{{token}}` variable after login
4. Use token in Authorization header: `Bearer {{token}}`

---

## Best Practices

1. **Always validate input**: Check all parameters before processing
2. **Use appropriate HTTP methods**: GET for retrieval, POST for creation, PUT for updates, DELETE for deletion
3. **Include authentication**: Always include token for protected endpoints
4. **Handle errors gracefully**: Check response status and error messages
5. **Test endpoints**: Use Postman or curl before integrating into frontend

---

**API Version:** 1.0.0  
**Last Updated:** December 2024
