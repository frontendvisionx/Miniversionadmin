# Admin Panel - Backend Integration Guide

## Backend SQL/Database Information

### Current Admin Database Model

Located in: `backend/models/Admin.js`

```javascript
{
  _id: MongoDB ObjectId,
  name: String (required),           // Full name of admin
  email: String (required, unique),  // Email address
  username: String (required, unique), // Login username
  password: String (required, hashed), // Password (hashed with bcrypt)
  
  // Role determines permissions
  role: 'admin' | 'super_admin',     // User role
  
  isActive: Boolean (default: true),   // Account status
  lastLogin: Date,                     // Last login timestamp
  
  permissions: {                       // Permission flags
    users: Boolean (default: true),
    vendors: Boolean (default: true),
    affiliates: Boolean (default: true),
    transactions: Boolean (default: true),
    settings: Boolean (default: false)
  },
  
  profileImage: String (nullable),     // Profile picture URL
  createdAt: Date,                     // Creation timestamp
  updatedAt: Date                      // Last update timestamp
}
```

## Super Admin Configuration

### How Super Admin Works

The system supports two types of Super Admin:

#### 1. **Environment-Based Super Admin (Default)**

Configured in backend via `.env`:

```env
# Backend .env file
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=superadmin123
JWT_SECRET=your-secret-key
```

**Database Entry:**
Super admin may or may not be stored in the database. It's accessed via `.env` variables.

#### 2. **Database Super Admin**

When a Super Admin is created via the database, it has:
```javascript
{
  name: "Super Administrator",
  username: "superadmin",
  email: "superadmin@company.com",
  role: "super_admin",
  isActive: true,
  // ... other fields
}
```

## Current Super Admin Credentials

### Default Testing Credentials

```
Username: superadmin
Password: superadmin123
```

⚠️ **IMPORTANT FOR PRODUCTION:**
1. Change these credentials immediately
2. Store in secure environment variables
3. Never hardcode in the application
4. Implement password rotation policy

## Backend Routes (Already Implemented)

### Location: `backend/routes/adminAuthRoutes.js`

```javascript
// Login API
POST /api/admin/auth/login
Body: {
  username: string,
  password: string
}
Response: {
  success: true,
  data: {
    token: string,        // JWT token
    admin: { ... }       // Admin user object
  }
}

// Get Current Admin Profile
GET /api/admin/auth/me
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: { ... }  // Current admin details
}

// Logout
POST /api/admin/auth/logout
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  message: "Logged out successfully"
}

// Create New Admin (Super Admin Only)
POST /api/admin/auth/create-admin
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  username: string,
  email: string,
  password: string
}
Response: {
  success: true,
  data: { ... }  // Created admin object
}

// Get All Admins (Super Admin Only)
GET /api/admin/auth/admins
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: [
    { ... },  // Admin object 1
    { ... }   // Admin object 2
  ]
}
```

## Backend Middleware (Already Implemented)

### Location: `backend/middlewares/adminAuth.js`

```javascript
// authenticateAdmin
// ✓ Verifies JWT token
// ✓ Checks if user is admin or super_admin
// ✓ Handles token expiration
// ✓ Attaches user to req.user

// isSuperAdmin
// ✓ Checks if user role is 'super_admin'
// ✓ Returns 403 if not super admin
```

## Admin Creation Flow

### Step 1: Frontend Creates Admin Request
```
User fills form → Frontend validation → API call
```

### Step 2: Backend Creates Admin
```
Receive request → Authenticate (token) → Check if Super Admin → Validate data → Hash password → Save to DB
```

### Step 3: Response to Frontend
```
Success: Send created admin object + message
Error: Send error message + code
```

## Querying Admins from Database

### Find Super Admin
```javascript
// MongoDB Query
db.admins.findOne({ role: "super_admin" })

// Mongoose Query (in backend)
const superAdmin = await Admin.findOne({ role: 'super_admin' });
```

### Find All Admins
```javascript
// MongoDB Query
db.admins.find({ isActive: true })

// Mongoose Query
const admins = await Admin.find({ isActive: true });
```

### Find by Username
```javascript
// MongoDB Query
db.admins.findOne({ username: "superadmin" })

// Mongoose Query
const admin = await Admin.findOne({ username: 'superadmin' });
```

## Password Hashing

Passwords are hashed using bcryptjs with salt rounds = 10:

```javascript
// Hashing (backend)
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Comparison (backend)
const isPasswordCorrect = await bcrypt.compare(inputPassword, hashedPassword);
```

**Frontend knows:** Password is hashed securely (Never store plain password)

## JWT Token Details

### Token Structure
```javascript
// Payload
{
  _id: adminId,
  username: adminUsername,
  role: 'admin' | 'super_admin'
}

// Secret: process.env.JWT_SECRET
// Expiry: Typically 24 hours (configurable)
```

### Token Usage
```javascript
// Frontend stores: Authorization: Bearer <token>
// Each request includes token in headers
// Backend validates token and extracts user info
```

## Viewing Created Admins

### Method 1: Via Admin Panel
1. Login as Super Admin
2. Go to "Admin List" page
3. See all created admins with stats

### Method 2: Via Database Query
```javascript
// Using MongoDB Compass or mongosh
use minidb  // Your database name
db.admins.find({})
```

### Method 3: Via API Direct Call
```javascript
// Using Postman or curl
GET http://localhost:5000/api/admin/auth/admins
Headers: Authorization: Bearer <super-admin-token>
```

## Admin Status and Permissions

### Activation/Deactivation
```javascript
// Admin can be deactivated
Admin.findByIdAndUpdate(adminId, { isActive: false })
```

When deactivated:
- Cannot login
- Existing tokens still work but will be rejected on middleware check

### Permissions Field
```javascript
permissions: {
  users: true,           // Can manage users
  vendors: true,         // Can manage vendors
  affiliates: true,      // Can manage affiliates
  transactions: true,    // Can view transactions
  settings: false        // Cannot change settings (default for regular admin)
}
```

## Creating a New Super Admin from Database

```javascript
// Backend command to create super admin
const Admin = require('./models/Admin');

const newSuperAdmin = new Admin({
  name: "New Super Admin",
  email: "newsuperadmin@company.com",
  username: "newsuperadmin",
  password: "securepassword123",  // Will be hashed automatically
  role: "super_admin",
  isActive: true,
  permissions: {
    users: true,
    vendors: true,
    affiliates: true,
    transactions: true,
    settings: true
  }
});

await newSuperAdmin.save();
console.log("Super admin created!");
```

## Security Best Practices

### For Development
- ✓ Keep default credentials in `.env`
- ✓ Never commit `.env` to git
- ✓ Use `http://localhost` for local testing

### For Production
- ✓ Change all default credentials
- ✓ Use HTTPS only
- ✓ Implement rate limiting
- ✓ Add account lockout after failed attempts
- ✓ Enable 2FA
- ✓ Rotate JWT secrets regularly
- ✓ Store passwords securely (never plain text)
- ✓ Audit all admin actions
- ✓ Use strong password requirements

## Troubleshooting

### Issue: Cannot create admin
**Check:**
1. Are you logged in as Super Admin?
2. Is your token valid?
3. Check backend logs for errors
4. Verify all required fields are provided

### Issue: Admin created but cannot login
**Check:**
1. Username is correct (case-sensitive)
2. Password matches what was set
3. Admin is active (isActive: true)
4. No typos in username

### Issue: Admins list is empty
**Check:**
1. Are you logged in as Super Admin?
2. Check database for admin records
3. Run: `db.admins.countDocuments()`
4. Check if admins were actually created

### Issue: Login token expired
**Solution:**
1. Login again to get new token
2. Token refresh will be automatic in frontend

## API Response Examples

### Successful Login
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Super Admin",
      "username": "superadmin",
      "email": "admin@company.com",
      "role": "super_admin",
      "isActive": true,
      "permissions": {
        "users": true,
        "vendors": true,
        "affiliates": true,
        "transactions": true,
        "settings": true
      }
    }
  }
}
```

### Failed Login
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Get All Admins (Super Admin)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin One",
      "username": "admin1",
      "email": "admin1@company.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-02-14T10:00:00Z",
      "lastLogin": "2024-02-14T12:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin Two",
      "username": "admin2",
      "email": "admin2@company.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-02-13T10:00:00Z",
      "lastLogin": "2024-02-14T11:00:00Z"
    }
  ]
}
```

## Database Connection Info

### MongoDB Connection
- **Default Host:** `localhost:27017`
- **Database Name:** `minidb` (or configured in `.env`)
- **Connection String:** `mongodb://localhost:27017/minidb`

### Collections Used
- `admins` - Store admin user data
- Other user, vendor, product collections

## Frontend-Backend Communication

### Using the API Service
```javascript
// Frontend sends request to backend
import { adminAuthAPI } from '../services/api.js';

// Login
const response = await adminAuthAPI.login('superadmin', 'superadmin123');

// Create Admin
const response = await adminAuthAPI.createAdmin({
  name: "New Admin",
  username: "newadmin",
  email: "newadmin@company.com",
  password: "password123"
});

// Get All Admins
const response = await adminAuthAPI.getAllAdmins();
```

### Token Handling (Automatic)
```javascript
// Frontend automatically includes token in all requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Backend validates token before processing request
// If token invalid/expired, returns 401 Unauthorized
```

---

**Backend Integration v1.0** | Ready for Development ✅

For backend controller implementation details, see:
- `backend/controllers/adminAuthController.js`
- `backend/models/Admin.js`
- `backend/middlewares/adminAuth.js`
