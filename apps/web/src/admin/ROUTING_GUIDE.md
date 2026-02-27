# Admin Panel Routing Guide

This document explains the routing infrastructure for the enhanced admin panel.

## Architecture Overview

The admin panel is now a self-contained React application with its own routing, authentication, and layout system.

### Main Entry Point

**File**: `apps/web/src/App.jsx`

The main application routes all `/admin/*` paths to the admin app:

```jsx
<Route path="/admin/*" element={<AdminApp />} />
```

### Admin Application

**File**: `apps/web/src/admin/App.jsx`

The admin app provides:
- Authentication context (AuthProvider)
- Notification system (NotificationProvider)
- Protected routing
- Admin layout (Sidebar + Header)

## Route Structure

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/login` | LoginPage | Admin login form |

### Protected Routes

All protected routes require authentication and use the AdminLayout wrapper.

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/dashboard` | Dashboard | Admin dashboard with stats and quick actions |
| `/admin/content` | ContentList | List of all content items |
| `/admin/content/new` | ServiceEditor | Create new content |
| `/admin/content/:id` | ServiceEditor | Edit existing content |
| `/admin/media` | MediaLibrary | Media library (full page) |
| `/admin/settings` | SettingsForm | Global settings management |
| `/admin/navigation` | NavigationManager | Navigation menu editor |

### Default Behavior

- `/admin` and `/admin/*` (unmatched) redirect to `/admin/dashboard`
- Unauthenticated users are redirected to `/admin/login`

## Authentication

### AuthContext

**File**: `apps/web/src/admin/context/AuthContext.jsx`

Provides authentication state and methods:

```jsx
const { user, token, login, logout, isAuthenticated } = useAuth();
```

#### Methods

- `login(username, password)` - Authenticate user and store JWT token
- `logout()` - Clear authentication and redirect to login
- `isAuthenticated()` - Check if user is authenticated

#### Token Storage

JWT tokens are stored in localStorage as `adminToken`:

```javascript
localStorage.getItem('adminToken')
localStorage.setItem('adminToken', token)
localStorage.removeItem('adminToken')
```

#### API Integration

- Login endpoint: `POST /api/auth/login`
- Verify endpoint: `GET /api/auth/verify`
- All authenticated requests include: `Authorization: Bearer ${token}`

### ProtectedRoute Component

**File**: `apps/web/src/admin/components/ProtectedRoute.jsx`

Wraps protected routes and redirects to login if not authenticated.

## Layout Components

### AdminLayout

**File**: `apps/web/src/admin/components/AdminLayout.jsx`

Provides the main admin layout structure:
- Sidebar navigation
- Header with user info and logout
- Main content area

### Sidebar

**File**: `apps/web/src/admin/components/Sidebar.jsx`

Features:
- Navigation links with active state highlighting
- Collapsible on desktop
- Responsive mobile behavior
- Icons for each section

### Header

**File**: `apps/web/src/admin/components/Header.jsx`

Features:
- Page title
- User information display
- Logout button

## Notification System

### NotificationContainer

**File**: `apps/web/src/admin/components/NotificationContainer.jsx`

Provides toast notifications throughout the admin panel.

#### Usage

```jsx
import { useNotification } from '../components/NotificationContainer';

const { showSuccess, showError, showWarning, showInfo } = useNotification();

// Show notifications
showSuccess('Content saved successfully');
showError('Failed to save content');
showWarning('Please review your changes');
showInfo('Loading data...');
```

#### Features

- Auto-dismiss after 5 seconds
- Fixed position at top-right
- Color-coded by type (success, error, warning, info)
- Manual dismiss option
- Responsive design

## API Integration

### Base URL

The API base URL is configured via environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

### Authentication Headers

All authenticated API requests should include:

```javascript
const token = localStorage.getItem('adminToken');

fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Styling

All admin components use SCSS modules with design tokens from:

**File**: `apps/web/src/admin/styles/base.scss`

### Design Tokens

- Colors (primary gold, neutrals, status colors)
- Typography (Inter font family, sizes, weights)
- Spacing (consistent spacing scale)
- Borders & radius
- Shadows
- Transitions & animations

### Responsive Breakpoints

- xs: 480px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Migration from Old Admin

The old admin pages in `apps/web/src/pages/Admin/` are no longer used. The new admin panel provides:

1. **Better authentication** - JWT-based with proper token management
2. **Modern UI** - Consistent design system with SCSS modules
3. **Enhanced features** - WYSIWYG editor, image uploads, media library
4. **Better UX** - Toast notifications, loading states, error handling
5. **Responsive design** - Mobile-friendly layout

## Development

### Adding New Routes

1. Create the page component in `apps/web/src/admin/pages/`
2. Add the route in `apps/web/src/admin/App.jsx`
3. Wrap with `ProtectedRoute` if authentication is required
4. Add navigation link in `Sidebar.jsx` if needed

### Using Notifications

Import and use the notification hook in any component:

```jsx
import { useNotification } from '../components/NotificationContainer';

const MyComponent = () => {
  const { showSuccess, showError } = useNotification();
  
  const handleSave = async () => {
    try {
      // ... save logic
      showSuccess('Saved successfully');
    } catch (error) {
      showError(error.message);
    }
  };
};
```

### Accessing Auth State

Import and use the auth hook in any component:

```jsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, token, logout } = useAuth();
  
  // Use auth state and methods
};
```

## Testing

When testing admin routes:

1. Navigate to `/admin/login`
2. Enter credentials (configured in backend)
3. Upon successful login, redirected to `/admin/dashboard`
4. Token stored in localStorage
5. All protected routes accessible
6. Logout clears token and redirects to login

## Security Considerations

1. **Token Storage** - JWT stored in localStorage (consider httpOnly cookies for production)
2. **Token Verification** - Backend should verify token on all protected endpoints
3. **Token Expiration** - Implement token refresh or re-authentication
4. **HTTPS** - Always use HTTPS in production
5. **CORS** - Configure CORS properly on backend
6. **Input Validation** - Validate all user inputs on frontend and backend
