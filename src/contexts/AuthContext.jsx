import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Utility function to validate token and extract user info
const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return null;
    }
    
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      memberId: payload.memberId
    };
  } catch (err) {
    console.error('Error parsing token:', err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Function to force logout (used when token is invalid)
  const forceLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    
    // Dispatch custom event for notification
    window.dispatchEvent(new CustomEvent('forceLogout'));
  };

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userInfo = validateToken(token);
        if (userInfo) {
          setIsAuthenticated(true);
          setUser(userInfo);
        } else {
          // Token is invalid, force logout
          forceLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Set up global fetch interceptor to handle 401 responses
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // If we get a 401 response and we're authenticated, logout the user
      if (response.status === 401 && isAuthenticated) {
        console.log('Received 401 response, logging out user');
        forceLogout();
      }
      
      return response;
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, [isAuthenticated]);

  // Set up periodic token validation
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userInfo = validateToken(token);
        if (!userInfo) {
          console.log('Token validation failed during session, logging out user');
          forceLogout();
        }
      } else {
        console.log('No token found during session, logging out user');
        forceLogout();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (username, password) => {
    try {
      const result = await authAPI.login(username, password);
      localStorage.setItem('authToken', result.token);
      const userInfo = validateToken(result.token);
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      forceLogout();
    }
  };

  // Function to manually check if current token is still valid
  const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      if (isAuthenticated) {
        console.log('No token found, logging out user');
        forceLogout();
      }
      return false;
    }
    
    const userInfo = validateToken(token);
    if (!userInfo && isAuthenticated) {
      console.log('Token validation failed, logging out user');
      forceLogout();
      return false;
    }
    
    return true;
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    forceLogout,
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for use in other files
export { AuthContext };
