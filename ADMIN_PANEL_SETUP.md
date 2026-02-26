# Admin Panel - Quick Start Guide

## Setup & Installation

### Step 1: Install Dependencies

```bash
cd phisinglandingpage
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the `phisinglandingpage` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_DEBUG=false
```

### Step 3: Start Development Server

```bash
npm run dev
```

The admin panel will be available at: `http://localhost:5173/admin/login`

### Step 4: Backend Setup

Make sure the backend is running on port 5000:

```bash
cd backend
npm install
npm start
```

## Default Login Credentials

**Super Admin Account:**
- **Username:** `superadmin`
- **Password:** `superadmin123`

⚠️ **Security Note:** Change these credentials in production!

## File Structure Overview

```
src/
├── components/              # Reusable UI components
│   ├── AdminLayout.jsx     # Main layout with sidebar
│   ├── Button.jsx          # Generic button component
│   ├── Input.jsx           # Form input field
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── ProtectedRoute.jsx  # Route protection logic
│   └── UI.jsx              # Additional UI components (Card, Alert, Badge)
│
├── config/                 # Configuration files
│   ├── theme.js            # Color schemes and typography
│   └── constants.js        # App constants and endpoints
│
├── context/                # State management
│   └── AuthContext.jsx     # Authentication provider
│
├── hooks/                  # Custom React hooks
│   └── useForm.js          # Form handling and validation
│
├── pages/                  # Page components
│   ├── AdminLoginPage.jsx        # Login page
│   ├── AdminDashboardPage.jsx    # Main dashboard
│   ├── CreateAdminPage.jsx       # Create new admin
│   ├── AdminListPage.jsx         # View all admins
│   └── AdminSettingsPage.jsx     # Admin settings
│
├── services/               # API communication
│   └── api.js             # API client and endpoints
│
├── utils/                  # Utility functions
│   └── helpers.js          # Helper functions (format, validate, etc.)
│
└── App.jsx                # Main app with routing
```

## Key Features Implemented

### ✅ Authentication System
- JWT token-based authentication
- Secure password hashing (bcrypt)
- Session persistence in localStorage
- Automatic token validation

### ✅ Authorization (RBAC)
- **Super Admin**: Full access, can create admins
- **Admin**: Dashboard access only, no admin creation

### ✅ Pages & Routes

| Route | Page | Role Required | Description |
|-------|------|---------------|-------------|
| `/admin/login` | AdminLoginPage | Public | Login form |
| `/admin/dashboard` | AdminDashboardPage | Any Admin | Main dashboard |
| `/admin/create-admin` | CreateAdminPage | Super Admin | Create new admin |
| `/admin/admins` | AdminListPage | Super Admin | View all admins |
| `/admin/settings` | AdminSettingsPage | Any Admin | User settings |

### ✅ UI Features
- Responsive sidebar (collapsible on mobile)
- Clean, modern design with Tailwind CSS
- Consistent color theme (Teal/Ocean + Yellow)
- Icons using lucide-react
- Toast notifications with react-hot-toast

### ✅ User Management (Super Admin)
- Create new admin accounts
- View list of all admins
- See admin details (name, email, status, created date)
- Admin status indicators

### ✅ Security Features
- Protected routes with authentication checks
- Role-based access control
- Token expiration handling
- Secure logout
- Activity tracking (last login)

## How to Use

### Login to Admin Panel

1. Go to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Username: `superadmin`
   - Password: `superadmin123`
3. Click "Sign In"

### Create New Admin (Super Admin Only)

1. After login, click "Create Admin" in sidebar or dashboard
2. Fill in the form:
   - Full Name: Enter admin's full name
   - Username: 3-20 characters
   - Email: Valid email address
   - Password: Minimum 6 characters
3. Click "Create Admin" button
4. Success message will appear

### View Admin List (Super Admin Only)

1. Click "Admin List" in sidebar
2. See statistics of admins
3. View all admins in table
4. Click eye icon to view admin details

### Sidebar Navigation

**Always Available:**
- Dashboard
- Settings

**Super Admin Only:**
- Create Admin
- Admin List

**Logout:**
- Click logout button in sidebar footer

## API Endpoints Used

### Authentication
```
POST   /api/admin/auth/login          → Login
POST   /api/admin/auth/logout         → Logout
GET    /api/admin/auth/me             → Get current user
```

### Admin Management
```
POST   /api/admin/auth/create-admin   → Create new admin (Super Admin)
GET    /api/admin/auth/admins         → Get all admins (Super Admin)
```

## Theme & Styling

### Color Palette

**Primary Teal/Ocean Colors:**
- phish-500: `#189ab3` (Main color)
- phish-700: `#0e5a6b` (Darker shade)
- phish-100: `#d1ecf3` (Light shade)

**Secondary Yellow:**
- secondary-500: `#f59e0b`

**Neutrals:**
- Backgrounds: `#ffffff`, `#f9fafb`
- Text: `#111827`, `#6b7280`
- Borders: `#e5e7eb`

### Using Tailwind Classes

```jsx
// Use phish colors
<div className="bg-phish-500 text-white">Content</div>

// Use secondary colors
<button className="bg-secondary-500">Button</button>

// Responsive classes
<div className="text-xs md:text-sm lg:text-base">Responsive text</div>
```

## Error Handling

The system handles errors gracefully:

1. **Network Errors**: Shows error message
2. **Authentication Errors**: Redirects to login
3. **Authorization Errors**: Shows forbidden message
4. **Validation Errors**: Shows field-specific errors

## Troubleshooting

### Issue: Cannot login

**Solution:**
- Verify backend is running on port 5000
- Check `.env` file has correct API URL
- Verify credentials (superadmin/superadmin123)
- Check browser console for errors

### Issue: Routes not working

**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Restart dev server

### Issue: Styling looks broken

**Solution:**
- Verify Tailwind CSS is configured
- Ensure `index.css` is imported
- Clear Tailwind cache: `npm run dev`

### Issue: Icons not showing

**Solution:**
- Verify lucide-react is installed
- Check icon name spelling
- Icons use: `<Icon className="w-5 h-5" />`

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Output files will be in `dist/` directory.

## Development Tips

### Form Validation
```javascript
import { useForm } from '../hooks/useForm.js';

const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
  { field1: '', field2: '' },
  async (values) => {
    // Handle form submission
  }
);
```

### Making API Calls
```javascript
import { adminAuthAPI } from '../services/api.js';

try {
  const response = await adminAuthAPI.login(username, password);
  if (response.success) {
    // Handle success
  }
} catch (error) {
  // Handle error
}
```

### Using Auth Context
```javascript
import { useAuth } from '../context/AuthContext.jsx';

const { user, isSuperAdmin, logout } = useAuth();
```

### Toast Notifications
```javascript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

## Database Models Reference

### Admin Model
```javascript
{
  _id: ObjectId,
  name: String,              // Admin's full name
  email: String,             // Unique email
  username: String,          // Unique username
  password: String,          // Hashed password
  role: 'admin' | 'super_admin',
  isActive: Boolean,
  lastLogin: Date,
  permissions: {
    users: Boolean,
    vendors: Boolean,
    affiliates: Boolean,
    transactions: Boolean,
    settings: Boolean
  },
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. **Customize Branding**: Update logo and colors in components
2. **Add More Features**: Extend admin management with edit/delete
3. **Dashboard Analytics**: Add charts and statistics
4. **Audit Logging**: Track all admin actions
5. **Two-Factor Authentication**: Add 2FA support

## Support & Documentation

- See `ADMIN_PANEL_README.md` for full documentation
- Check inline code comments for implementation details
- Refer to component PropTypes for component usage

---

**Admin Panel v1.0.0** | Production Ready ✅
