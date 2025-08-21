import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function AuthNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Listen for storage events to detect when token is removed
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' && e.newValue === null && e.oldValue) {
        setNotificationMessage('Your session has expired. Please log in again.');
        setShowNotification(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    };

    // Listen for custom logout events
    const handleForceLogout = () => {
      setNotificationMessage('You have been logged out. Please log in again.');
      setShowNotification(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('forceLogout', handleForceLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-700">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{notificationMessage}</span>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="absolute top-1 right-2 text-white hover:text-red-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default AuthNotification;
