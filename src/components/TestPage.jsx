import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI, adminAPI, galleryAPI } from '../services/api';

function TestPage() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Health check
      addTestResult('Health Check', 'running', 'Testing backend health...');
      try {
        const health = await fetch('http://localhost:5000/health').then(r => r.json());
        addTestResult('Health Check', 'success', `Backend is running: ${health.status}`);
      } catch (error) {
        addTestResult('Health Check', 'error', `Backend health check failed: ${error.message}`);
        return;
      }

      // Test 2: Login
      addTestResult('Login', 'running', 'Testing admin login...');
      try {
        const loginResult = await login('admin', 'admin123');
        if (loginResult.success) {
          addTestResult('Login', 'success', `Logged in as ${user?.username} (${user?.role})`);
        } else {
          addTestResult('Login', 'error', `Login failed: ${loginResult.error}`);
          return;
        }
      } catch (error) {
        addTestResult('Login', 'error', `Login error: ${error.message}`);
        return;
      }

      // Test 3: Gallery API
      addTestResult('Gallery API', 'running', 'Testing gallery endpoints...');
      try {
        const categories = await galleryAPI.getCategories();
        addTestResult('Gallery API', 'success', `Found ${categories.length} categories`);
      } catch (error) {
        addTestResult('Gallery API', 'error', `Gallery API failed: ${error.message}`);
      }

      // Test 4: Admin API
      addTestResult('Admin API', 'running', 'Testing admin endpoints...');
      try {
        const gallery = await adminAPI.getGallery();
        addTestResult('Admin API', 'success', `Found ${gallery.length} gallery images`);
      } catch (error) {
        addTestResult('Admin API', 'error', `Admin API failed: ${error.message}`);
      }

      // Test 5: Create Image
      addTestResult('Create Image', 'running', 'Testing image creation...');
      try {
        const newImage = await adminAPI.createGalleryImage({
          title: 'Test Image from Frontend',
          category: 'Club',
          description: 'This is a test image created from the frontend test page',
          imageUrl: 'https://picsum.photos/800/600',
          tags: ['test', 'frontend'],
          featured: false,
          location: 'Test Location',
          members: ['Test Member'],
          date: new Date().toISOString().split('T')[0]
        });
        addTestResult('Create Image', 'success', `Created image: ${newImage.title} (ID: ${newImage.id})`);
      } catch (error) {
        addTestResult('Create Image', 'error', `Image creation failed: ${error.message}`);
      }

    } catch (error) {
      addTestResult('Test Suite', 'error', `Test suite failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/80 rounded-lg p-6 border border-amber-500/30">
          <h1 className="text-3xl font-bold text-white mb-6">🔧 Frontend Test Page</h1>
          
          <div className="mb-6">
            <div className="text-white mb-4">
              <p><strong>Authentication Status:</strong> {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}</p>
              {user && (
                <p><strong>User:</strong> {user.username} ({user.role})</p>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={runTests}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={clearResults}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Clear Results
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => login('admin', 'admin123')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Quick Login
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' :
                  result.status === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
                  result.status === 'running' ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' :
                  'bg-gray-900/20 border-gray-500/30 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{result.test}:</strong> {result.message}
                  </div>
                  <span className="text-xs opacity-70">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {testResults.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p>No test results yet. Click "Run All Tests" to start testing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestPage;
