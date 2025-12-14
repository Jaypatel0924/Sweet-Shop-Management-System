# Sweet Shop Management System - Admin Guide

## 👑 Admin Login Credentials

When the backend starts, it automatically creates an admin user with the following credentials:

### Default Admin Account
- **Email:** `admin@sweetshop.com`
- **Password:** `admin123456`
- **Role:** Administrator (Full Access)

### Demo Customer Accounts
- **Email:** `customer@example.com` / **Password:** `password123`
- **Email:** `user@example.com` / **Password:** `password123`

---

## 🔐 How to Login as Admin

### Step 1: Go to Login Page
Navigate to: `http://localhost:3002` (or `http://localhost:3001`)

### Step 2: Select Admin Tab
You'll see two tabs on the login form:
- 👤 **Customer** - For regular users
- ⚙️ **Admin** - For administrators

Click on the **⚙️ Admin** tab

### Step 3: Enter Admin Credentials
- **Email:** `admin@sweetshop.com`
- **Password:** `admin123456`

### Step 4: Click Admin Login
The button will show: **🔓 Admin Login**

---

## 🎯 What Admin Can Do

After logging in, admins can:

### 1. **Manage Inventory** 📦
- Add new sweet products
- Edit existing products
- Delete products
- Update stock quantities

### 2. **View Statistics** 📊
- Total products count
- Total inventory value (₹)
- Low stock items alert
- Quick inventory overview

### 3. **Product Management** ✨
- Set product names, prices, categories
- Upload product images
- Add custom emojis
- Write detailed descriptions

### 4. **Access Admin Dashboard**
- Professional inventory management interface
- Product cards grid view
- Real-time product updates
- Delete with confirmation

---

## 🔄 Admin Portal Features

### Inventory Statistics
- **📦 Total Products** - Count of all products in inventory
- **💰 Total Inventory Value** - Total ₹ value of all stock
- **⚠️ Low Stock Items** - Alert for items below 10 units

### Product Management
- Add new sweets/namkeens with modal form
- View all products in card grid
- Edit product details
- Delete products safely
- Real-time stock status

### Product Information
- Product name & category
- Price in rupees (₹)
- Stock quantity
- Stock status badge
- Description
- Custom emoji display

---

## 🔒 Security Features

- **JWT Token Authentication** - Secure API access
- **Admin-only routes** - Protected endpoints require admin role
- **Password hashing** - Bcrypt encryption
- **Authorization checks** - Middleware validates admin status

---

## 📝 First Time Setup

1. **Start Backend Server**
   ```bash
   cd backend
   npm install
   npm start
   ```
   
   You'll see:
   ```
   📊 Seeding database...
   ✓ Admin user created successfully!
   📧 Email: admin@sweetshop.com
   🔐 Password: admin123456
   💡 Change password after first login!
   
   🚀 Server is running on port 5000
   📍 API: http://localhost:5000
   🔐 Admin Portal: http://localhost:3002 (Tab: Admin)
   ```

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Login as Admin**
   - Go to login page
   - Click on **⚙️ Admin** tab
   - Use credentials above
   - Access inventory dashboard

---

## 🛠️ Change Admin Password

To change the admin password:

1. Login with current credentials
2. (Future feature: Add profile settings)
3. For now, contact database administrator

---

## 📧 Reset Admin Account

If you need to reset the admin account:

1. Stop the server
2. Delete the MongoDB collection: `users`
3. Restart the server - it will recreate the admin user

---

## 💡 Tips

✓ Keep admin credentials secure
✓ Change default password after first login
✓ Use strong passwords for admin accounts
✓ One admin account can manage entire inventory
✓ Multiple admins can be created by updating seeds

---

## 🆘 Troubleshooting

**Q: Admin login not working?**
- Verify backend is running on port 5000
- Check email is exactly: `admin@sweetshop.com`
- Ensure password is: `admin123456`

**Q: Can't access admin dashboard?**
- Make sure you're logged in as admin
- Check the ⚙️ Admin button in header
- Admin button only shows for admin users

**Q: Products not showing?**
- Click "Add Product" to create first product
- Make sure you have admin access
- Check backend is connected

---

## 🚀 Next Steps

1. Login as admin with credentials above
2. Navigate to Admin dashboard
3. Start adding your sweet products
4. View real-time statistics
5. Manage inventory effectively

Enjoy managing your sweet shop! 🍬✨
