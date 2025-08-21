# Authentication System Documentation

## Overview
The Unholy Souls MC application implements a comprehensive authentication system with automatic logout functionality when tokens are invalid, expired, or missing.

## Features

### 1. Automatic Token Validation
- **Startup Validation**: When the app starts, it automatically validates any stored authentication token
- **Periodic Validation**: Tokens are validated every 5 minutes during active sessions
- **API Call Validation**: Tokens are validated before making authenticated API calls
- **Real-time Validation**: Global fetch interceptor catches 401 responses and automatically logs out users

### 2. Automatic Logout Scenarios
The system automatically logs out users in the following cases:
- **No Token Found**: When localStorage doesn't contain an authToken
- **Invalid Token**: When the JWT token cannot be parsed or decoded
- **Expired Token**: When the token's expiration time has passed
- **Server Rejection**: When the backend returns a 401 Unauthorized response
- **Storage Events**: When the token is removed from localStorage by other means

### 3. User Experience
- **Immediate Feedback**: Users are automatically redirected to the login page
- **Notification System**: Red notification banner appears when automatic logout occurs
- **Seamless Navigation**: Navigation component automatically updates to show login/logout options
- **Protected Routes**: Access to admin and member management is automatically restricted

## Implementation Details

### Frontend Components

#### AuthContext (`src/contexts/AuthContext.jsx`)
- Manages authentication state (isAuthenticated, user, isLoading)
- Provides login, logout, and forceLogout functions
- Implements token validation logic
- Sets up global fetch interceptor for 401 responses
- Runs periodic token validation every 5 minutes

#### useAuth Hook (`src/hooks/useAuth.js`)
- Custom hook for accessing authentication context
- Provides type-safe access to auth functions and state
- Separated from AuthContext to fix React fast refresh issues

#### AuthNotification (`src/components/AuthNotification.jsx`)
- Shows notification when users are automatically logged out
- Listens for storage events and custom logout events
- Auto-hides after 5 seconds
- Provides clear messaging about session expiration

#### Navigation (`src/components/Navigation.jsx`)
- Dynamically shows login/logout options based on authentication state
- Displays user information when logged in
- Shows admin and member management links for authorized users
- Handles logout functionality

#### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
- Wraps protected components
- Redirects unauthenticated users to login page
- Shows loading state during authentication checks

### API Service (`src/services/api.js`)
- Implements `validateTokenBeforeRequest()` function
- Validates tokens before making authenticated API calls
- Automatically dispatches logout events for invalid tokens
- All admin API calls include token validation

### Backend Integration
- JWT tokens expire after 24 hours
- Backend middleware validates tokens on protected routes
- Returns 401 status for invalid/expired tokens
- Frontend automatically handles 401 responses

## Security Features

### Token Security
- JWT tokens stored in localStorage
- Automatic expiration handling
- Secure token validation on both frontend and backend
- No sensitive data stored in tokens

### Rate Limiting
- Stricter limits on authentication endpoints
- Admin endpoints have appropriate rate limiting
- Public endpoints have permissive limits

### CORS Configuration
- Restricted to specific origins
- Credentials enabled for authentication
- Proper headers allowed

## Usage Examples

### Using the useAuth Hook
```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user.username}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```jsx
import ProtectedRoute from './ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

### Manual Token Validation
```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { checkTokenValidity } = useAuth();
  
  const handleAction = () => {
    if (checkTokenValidity()) {
      // Proceed with action
    } else {
      // User will be automatically logged out
    }
  };
}
```

## Error Handling

### Automatic Logout Events
- `forceLogout`: Dispatched when token validation fails
- `storage`: Listens for localStorage changes
- Custom events for specific logout scenarios

### User Notifications
- Clear error messages for authentication failures
- Automatic redirection to login page
- Consistent user experience across the application

## Best Practices

### For Developers
1. Always use the `useAuth` hook for authentication state
2. Wrap protected components with `ProtectedRoute`
3. Use `checkTokenValidity()` before critical operations
4. Handle authentication errors gracefully

### For Users
1. Tokens automatically expire after 24 hours
2. Re-login required after token expiration
3. Clear notifications when sessions end
4. Secure access to protected features

## Troubleshooting

### Common Issues
1. **User logged out unexpectedly**: Check token expiration and validation
2. **401 errors**: Verify token is valid and not expired
3. **Navigation issues**: Ensure authentication state is properly managed

### Debug Information
- Check browser console for authentication logs
- Verify localStorage contains valid authToken
- Check network tab for 401 responses
- Monitor authentication state changes

## Future Enhancements
- Implement refresh token functionality
- Add remember me functionality
- Implement multi-factor authentication
- Add session management dashboard
- Implement token blacklisting on logout
