# 🍬 Sweet Shop Management System - Quick Start Guide

## 🚀 Get Running in 5 Minutes!

Your Sweet Shop system is **fully set up** with automatic admin account creation!

---

## ⚡ Quick Start (5 Steps)

### Step 1: Start Backend
```bash
cd backend
npm start
```

**Look for this output:**
```
📊 Seeding database...
✓ Admin user created successfully!
📧 Email: admin@sweetshop.com
🔐 Password: admin123456

🚀 Server is running on port 5000
```

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

**You should see:**
```
➜  Local:   http://localhost:3002/
```

### Step 3: Open Browser
Go to: **http://localhost:3002**

### Step 4: Click Admin Tab
1. You'll see two tabs: "👤 Customer" and "⚙️ Admin"
2. Click **⚙️ Admin** tab
3. Enter credentials (see below)

### Step 5: Manage Inventory
- Click "Add Product" to start adding sweets
- View statistics at top
- Manage products in grid

---

## 🔐 Admin Login Credentials

These are **automatically created** when backend starts:

```
📧 Email:    admin@sweetshop.com
🔐 Password: admin123456
```

---

## 👤 Demo Customer Accounts

Test the customer side:

```
📧 customer@example.com    🔐 password123
📧 user@example.com        🔐 password123
```

---

## 🎯 Admin Dashboard Features

### 📊 Three Key Statistics
- **📦 Total Products** - How many sweets in inventory
- **💰 Inventory Value** - Total ₹ worth of all stock
- **⚠️ Low Stock** - Products with less than 10 units

### ➕ Add New Product
Fill in:
- Product name
- Category (sweets, namkeen, cookies, dry-fruits, mathi)
- Price (₹)
- Stock quantity
- Image URL
- Description
- Custom emoji

### 📦 Inventory Grid
- View all products as beautiful cards
- See stock status
- Edit or delete products
- Real-time updates

### 🆘 Help Button
- Click "Help" in top right
- Complete admin guide opens
- All features explained

---

## 🎨 Login Interface

### Two Clear Modes:

**👤 Customer Mode**
- Regular user login
- Browse sweets
- Purple theme

**⚙️ Admin Mode**
- Admin inventory management
- Add/edit/delete products
- Gold theme with lock icon

---

## ✨ What You Can Do

### As Admin:
✅ Add unlimited sweet products
✅ View real-time inventory stats
✅ Update product details
✅ Delete products safely
✅ Monitor stock levels
✅ Custom emojis per product
✅ Professional dashboard interface

### As Customer:
✅ Browse all sweets
✅ Search by name/category
✅ Filter by price
✅ View product details
✅ See stock availability
✅ Beautiful product cards

---

## 📱 Design Features

- **Responsive** - Works on mobile, tablet, desktop
- **Modern** - Glassmorphism, gradients, animations
- **Professional** - Production-ready interface
- **Accessible** - Clean, intuitive navigation

---

## 🔧 Troubleshooting

**Q: Admin login not working?**
- ✓ Backend running on port 5000?
- ✓ Using ⚙️ Admin tab?
- ✓ Email is: admin@sweetshop.com

**Q: "Add Product" button not showing?**
- ✓ Logged in as admin?
- ✓ ⚙️ Admin badge in header?

**Q: Products not loading?**
- ✓ Backend connected?
- ✓ Try refreshing page
- ✓ Check browser console for errors

---

## 📚 Full Documentation

For detailed setup, see:
- `backend/ADMIN_GUIDE.md` - Complete admin instructions
- `README.md` - Full project documentation
- `SETUP.md` - Detailed setup guide (if exists)

---

## 🎉 You're All Set!

Your Sweet Shop Management System is ready! 

**Next:** Login as admin and add some sweets! 🍬✨

---

## Quick Reference

| Item | Value |
|------|-------|
| Backend | http://localhost:5000 |
| Frontend | http://localhost:3002 |
| Admin Email | admin@sweetshop.com |
| Admin Password | admin123456 |
| API Health | http://localhost:5000/health |
