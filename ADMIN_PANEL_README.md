# Admin Panel - Documentation

## Overview

This is a production-level admin panel application built with React and Vite. It provides secure authentication, role-based access control (RBAC), and admin management capabilities.

## Features

✨ **Key Features:**

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Super Admin and Admin roles
- 📱 **Responsive Design** - Mobile-first responsive UI
- 🎨 **Modern UI Components** - Clean, reusable components
- ⚡ **Modular Architecture** - Clean, well-organized codebase
- 📊 **Admin Dashboard** - Quick overview and statistics
- 👤 **Admin Management** - Create and view administrators (Super Admin only)
- 🔒 **Protected Routes** - Route-level access control
- 💾 **Local Storage** - Persistent user session
- ❌ **Error Handling** - Comprehensive error management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AdminLayout.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── ProtectedRoute.jsx
│   ├── Sidebar.jsx
│   └── UI.jsx
├── config/             # Configuration files
│   ├── constants.js    # App-wide constants
│   └── theme.js        # Color and style configuration
├── context/            # React Context
│   └── AuthContext.jsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useForm.js      # Form handling and validation
├── pages/              # Page components
│   ├── AdminLoginPage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── CreateAdminPage.jsx
│   ├── AdminListPage.jsx
│   └── AdminSettingsPage.jsx
├── services/           # API services
│   └── api.js         # API communication
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── App.jsx            # Main app with routing
└── main.jsx           # Entry point
```

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

## Default Credentials

For testing purposes, use these credentials to login:

**Super Admin:**
- Username: `superadmin`
- Password: `superadmin123`

**Note:** These are development credentials and should be changed in production.

## Authentication Flow

### 1. Login
```
Admin/Super Admin → Login Page → API Verification → JWT Token → Dashboard
```

### 2. Protected Routes
```
Token Validation → Role Check → Access Granted/Denied
```

### 3. Logout
```
Logout Request → Clear Local Storage → Clear Session → Login Page
```

## API Integration

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Authentication
- `POST /admin/auth/login` - Login admin
- `POST /admin/auth/logout` - Logout admin
- `GET /admin/auth/me` - Get current admin profile

#### Admin Management (Super Admin Only)
- `POST /admin/auth/create-admin` - Create new admin
- `GET /admin/auth/admins` - Get all admins

## Component Structure

### Pages

#### 1. **AdminLoginPage** (`/admin/login`)
- Login form with validation
- Error handling
- Redirect on success

#### 2. **AdminDashboardPage** (`/admin/dashboard`)
- Dashboard overview
- Quick statistics
- Action shortcuts (Super Admin)

#### 3. **CreateAdminPage** (`/admin/create-admin`) - *Super Admin Only*
- Create new admin form
- Input validation
- Success/error handling

#### 4. **AdminListPage** (`/admin/admins`) - *Super Admin Only*
- View all admins
- Admin statistics
- Admin details modal

#### 5. **AdminSettingsPage** (`/admin/settings`)
- Profile management
- Security settings
- Preferences

### Components

#### Core Components
- **AdminLayout** - Main layout wrapper
- **Sidebar** - Navigation sidebar
- **MobileMenuToggle** - Mobile menu button

#### UI Components
- **Button** - Reusable button
- **Input** - Reusable input field
- **Card** - Container component
- **Alert** - Alert/notification component
- **Badge** - Status badge
- **Separator** - Divider component

#### Route Protection
- **ProtectedRoute** - Requires authentication
- **SuperAdminRoute** - Requires Super Admin role
- **AdminRoute** - Requires Admin role
- **PublicRoute** - Redirect authenticated users

## Form Validation

### Validation Rules

| Field | Rules |
|-------|-------|
| **Username** | 3-20 chars, alphanumeric + underscore/hyphen |
| **Password** | Minimum 6 characters |
| **Email** | Valid email format |
| **Full Name** | 2-50 chars, letters + space/hyphen/apostrophe |

### Custom Hook: useForm

```javascript
const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
  { initialValues },
  async (values) => {
    // Handle submission
  }
);
```

## Styling & Theme

### Color Palette

**Primary (Teal/Ocean)**
```javascript
phish-50:  '#e8f5f9',
phish-500: '#189ab3',
phish-900: '#041a23',
```

**Secondary (Yellow)**
```javascript
secondary-500: '#f59e0b',
```

**Neutral**
```javascript
neutral-50:  '#f9fafb',
neutral-900: '#111827',
```

**Status**
- Success: `#10b981`
- Error: `#ef4444`
- Warning: `#f59e0b`
- Info: `#3b82f6`

### Using Theme Colors

```jsx
import { COLORS } from '../config/theme.js';

<div className="bg-phish-500 text-white">
  Primary colored content
</div>
```

## State Management

### AuthContext

Provides authentication state globally:

```javascript
const {
  user,              // Current admin user
  loading,           // Loading state
  error,             // Error message
  login,             // Login function
  logout,            // Logout function
  isAuthenticated,   // Check if authenticated
  isSuperAdmin,      // Check if super admin
  hasPermission,     // Check specific permission
} = useAuth();
```

## API Service

### Creating API Calls

```javascript
import { adminAuthAPI } from '../services/api.js';

// Login
const response = await adminAuthAPI.login(username, password);

// Create Admin
const response = await adminAuthAPI.createAdmin({
  name,
  username,
  email,
  password,
});

// Get All Admins
const response = await adminAuthAPI.getAllAdmins();
```

### Error Handling

All API errors are standardized:

```javascript
{
  message: 'Error description',
  code: 'ERROR_CODE',
  error: originalError
}
```

## Local Storage

### Keys

- `admin_auth_token` - JWT authentication token
- `admin_user` - Current admin user object
- `admin_sidebar_state` - Sidebar open/close state

## Permissions System

### Super Admin
- Full system access
- Can create new admins
- Can view all admins
- Can access all features

### Admin
- Limited dashboard access
- Cannot create admins
- Cannot view admin list
- Can only access assigned features

## Security Considerations

✅ **Implemented:**
- JWT token-based authentication
- Password hashing and bcrypt
- Protected routes with role checking
- Token expiration handling
- Account deactivation support
- Secure logout

⚠️ **Best Practices:**
- Never store sensitive data in localStorage
- Always use HTTPS in production
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

## Development Guidelines

### Code Style

- Use functional components with hooks
- Use arrow functions
- Destructure props
- Use meaningful variable names
- Add JSDoc comments

### Component Example

```javascript
/**
 * Example Component
 * Component description
 */

import React from 'react';

export const ExampleComponent = ({ prop1, prop2 }) => {
  const [state, setState] = React.useState(null);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ExampleComponent;
```

## Debugging

### Enable Debug Logs

Set `DEBUG=true` in `.env`:

```bash
VITE_DEBUG=true
```

### Browser DevTools

- React DevTools
- Redux DevTools (if implemented)
- Network tab for API calls

## Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory

### Environment Variables

Create `.env.production`:

```
VITE_API_URL=https://your-api.com/api
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy --prod --dir=dist
```

## Troubleshooting

### Login Issues

1. Check API URL in `.env`
2. Verify backend is running
3. Check network tab for errors
4. Verify credentials

### Route Not Found

1. Check route paths in `App.jsx`
2. Verify page component exists
3. Check route protection logic

### Styling Issues

1. Verify Tailwind CSS is configured
2. Check class names
3. Clear cache: `npm run dev`

## Performance Optimization

- Code splitting by route
- Lazy loading components
- Image optimization
- Minification on build
- Tree shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

### Pull Request Process

1. Create feature branch
2. Make changes following code style
3. Test thoroughly
4. Submit PR with description

## License

This project is private and confidential.

## Support

For issues and questions:
- Check documentation
- Review code comments
- Contact development team

---

**Last Updated:** 2024
**Version:** 1.0.0
