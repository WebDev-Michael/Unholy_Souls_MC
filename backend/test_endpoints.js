import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to log test results
function logTest(name, success, response = null, error = null) {
  if (success) {
    console.log(`✅ ${name} - PASSED`);
    testResults.passed++;
  } else {
    console.log(`❌ ${name} - FAILED`);
    testResults.failed++;
    if (error) {
      console.log(`   Error: ${error}`);
      testResults.errors.push({ name, error, response });
    }
  }
}

// Helper function to make requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.text();
    let jsonData = null;
    
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      // Response might not be JSON
    }
    
    return {
      status: response.status,
      data: jsonData || data,
      headers: response.headers
    };
  } catch (error) {
    return {
      status: 0,
      data: null,
      error: error.message
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  
  const response = await makeRequest(`${BASE_URL}/health`);
  const success = response.status === 200 && response.data && response.data.status === 'OK';
  
  logTest('Health Check', success, response.data, success ? null : `Status: ${response.status}`);
}

async function testAuthentication() {
  console.log('\n🔍 Testing Authentication...');
  
  // Test login
  const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const loginSuccess = loginResponse.status === 200 && loginResponse.data && loginResponse.data.token;
  logTest('Admin Login', loginSuccess, loginResponse.data, loginSuccess ? null : `Status: ${loginResponse.status}`);
  
  if (loginSuccess) {
    authToken = loginResponse.data.token;
    console.log(`   Token received: ${authToken.substring(0, 20)}...`);
  }
  
  // Test invalid login
  const invalidLoginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'invalid',
      password: 'wrongpassword'
    })
  });
  
  const invalidLoginSuccess = invalidLoginResponse.status === 401;
  logTest('Invalid Login (401)', invalidLoginSuccess, invalidLoginResponse.data);
  
  // Test registration
  const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    })
  });
  
  const registerSuccess = registerResponse.status === 201;
  logTest('User Registration', registerSuccess, registerResponse.data, registerSuccess ? null : `Status: ${registerResponse.status}`);
  
  // Test duplicate registration
  const duplicateRegisterResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin',
      email: 'admin@unholysoulsmc.com',
      password: 'admin123'
    })
  });
  
  const duplicateRegisterSuccess = duplicateRegisterResponse.status === 400;
  logTest('Duplicate Registration (400)', duplicateRegisterSuccess, duplicateRegisterResponse.data);
}

async function testPublicEndpoints() {
  console.log('\n🔍 Testing Public Endpoints...');
  
  // Test get all members
  const membersResponse = await makeRequest(`${BASE_URL}/api/members`);
  const membersSuccess = membersResponse.status === 200 && Array.isArray(membersResponse.data);
  logTest('Get All Members', membersSuccess, membersResponse.data, membersSuccess ? null : `Status: ${membersResponse.status}`);
  
  // Test get member by ID
  const memberResponse = await makeRequest(`${BASE_URL}/api/members/1`);
  const memberSuccess = memberResponse.status === 200 && memberResponse.data && memberResponse.data.id;
  logTest('Get Member by ID', memberSuccess, memberResponse.data, memberSuccess ? null : `Status: ${membersResponse.status}`);
  
  // Test get members by rank
  const rankResponse = await makeRequest(`${BASE_URL}/api/members?rank=President`);
  const rankSuccess = rankResponse.status === 200 && Array.isArray(rankResponse.data);
  logTest('Get Members by Rank', rankSuccess, rankResponse.data, rankSuccess ? null : `Status: ${rankResponse.status}`);
  
  // Test get members by chapter
  const chapterResponse = await makeRequest(`${BASE_URL}/api/members?chapter=Main`);
  const chapterSuccess = chapterResponse.status === 200 && Array.isArray(chapterResponse.data);
  logTest('Get Members by Chapter', chapterSuccess, chapterResponse.data, chapterSuccess ? null : `Status: ${chapterResponse.status}`);
  
  // Test search members
  const searchResponse = await makeRequest(`${BASE_URL}/api/members?search=Don`);
  const searchSuccess = searchResponse.status === 200 && Array.isArray(searchResponse.data);
  logTest('Search Members', searchSuccess, searchResponse.data, searchSuccess ? null : `Status: ${searchResponse.status}`);
  
  // Test get ranks
  const ranksResponse = await makeRequest(`${BASE_URL}/api/members/ranks`);
  const ranksSuccess = ranksResponse.status === 200 && Array.isArray(ranksResponse.data);
  logTest('Get Ranks', ranksSuccess, ranksResponse.data, ranksSuccess ? null : `Status: ${ranksResponse.status}`);
  
  // Test get chapters
  const chaptersResponse = await makeRequest(`${BASE_URL}/api/members/chapters`);
  const chaptersSuccess = chaptersResponse.status === 200 && Array.isArray(chaptersResponse.data);
  logTest('Get Chapters', chaptersSuccess, chaptersResponse.data, chaptersSuccess ? null : `Status: ${chaptersResponse.status}`);
  
  // Test get all gallery images
  const galleryResponse = await makeRequest(`${BASE_URL}/api/gallery`);
  const gallerySuccess = galleryResponse.status === 200 && Array.isArray(galleryResponse.data);
  logTest('Get All Gallery Images', gallerySuccess, galleryResponse.data, gallerySuccess ? null : `Status: ${galleryResponse.status}`);
  
  // Test get gallery image by ID
  const galleryImageResponse = await makeRequest(`${BASE_URL}/api/gallery/1`);
  const galleryImageSuccess = galleryImageResponse.status === 200 && galleryImageResponse.data && galleryImageResponse.data.id;
  logTest('Get Gallery Image by ID', galleryImageSuccess, galleryImageResponse.data, galleryImageSuccess ? null : `Status: ${galleryImageResponse.status}`);
  
  // Test get images by category
  const categoryResponse = await makeRequest(`${BASE_URL}/api/gallery?category=Events`);
  const categorySuccess = categoryResponse.status === 200 && Array.isArray(categoryResponse.data);
  logTest('Get Images by Category', categorySuccess, categoryResponse.data, categorySuccess ? null : `Status: ${categoryResponse.status}`);
  
  // Test get featured images
  const featuredResponse = await makeRequest(`${BASE_URL}/api/gallery?featured=true`);
  const featuredSuccess = featuredResponse.status === 200 && Array.isArray(featuredResponse.data);
  logTest('Get Featured Images', featuredSuccess, featuredResponse.data, featuredSuccess ? null : `Status: ${featuredResponse.status}`);
  
  // Test search images
  const searchImagesResponse = await makeRequest(`${BASE_URL}/api/gallery?search=party`);
  const searchImagesSuccess = searchImagesResponse.status === 200 && Array.isArray(searchImagesResponse.data);
  logTest('Search Images', searchImagesSuccess, searchImagesResponse.data, searchImagesSuccess ? null : `Status: ${searchImagesResponse.status}`);
  
  // Test get categories
  const categoriesResponse = await makeRequest(`${BASE_URL}/api/gallery/categories`);
  const categoriesSuccess = categoriesResponse.status === 200 && Array.isArray(categoriesResponse.data);
  logTest('Get Categories', categoriesSuccess, categoriesResponse.data, categoriesSuccess ? null : `Status: ${categoriesResponse.status}`);
  
  // Test get featured images endpoint
  const featuredEndpointResponse = await makeRequest(`${BASE_URL}/api/gallery/featured`);
  const featuredEndpointSuccess = featuredEndpointResponse.status === 200 && Array.isArray(featuredEndpointResponse.data);
  logTest('Get Featured Images Endpoint', featuredEndpointSuccess, featuredEndpointResponse.data, featuredEndpointSuccess ? null : `Status: ${featuredEndpointResponse.status}`);
}

async function testProtectedEndpoints() {
  console.log('\n🔍 Testing Protected Endpoints...');
  
  if (!authToken) {
    console.log('   Skipping protected endpoints - no auth token available');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${authToken}`
  };
  
  // Test get profile
  const profileResponse = await makeRequest(`${BASE_URL}/api/profile`, { headers });
  const profileSuccess = profileResponse.status === 200 && profileResponse.data && profileResponse.data.user;
  logTest('Get Profile', profileSuccess, profileResponse.data, profileSuccess ? null : `Status: ${profileResponse.status}`);
  
  // Test update profile
  const updateProfileResponse = await makeRequest(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      email: 'newemail@example.com'
    })
  });
  const updateProfileSuccess = updateProfileResponse.status === 200;
  logTest('Update Profile', updateProfileSuccess, updateProfileResponse.data, updateProfileSuccess ? null : `Status: ${updateProfileResponse.status}`);
  
  // Test create member
  const createMemberResponse = await makeRequest(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Test Member',
      roadname: 'Test',
      rank: 'Prospect',
      chapter: 'Main',
      bio: 'This is a test member bio.',
      image: 'test-image.jpg'
    })
  });
  const createMemberSuccess = createMemberResponse.status === 201;
  logTest('Create Member', createMemberSuccess, createMemberResponse.data, createMemberSuccess ? null : `Status: ${createMemberResponse.status}`);
  
  // Test create gallery image
  const createImageResponse = await makeRequest(`${BASE_URL}/api/gallery`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'Test Image',
      category: 'Events',
      description: 'This is a test gallery image.',
      imageUrl: 'test-image.jpg',
      tags: ['test', 'event'],
      featured: false,
      location: 'Test Location',
      members: ['Test Member'],
      date: '2024-01-01'
    })
  });
  const createImageSuccess = createImageResponse.status === 201;
  logTest('Create Gallery Image', createImageSuccess, createImageResponse.data, createImageSuccess ? null : `Status: ${createImageResponse.status}`);
}

async function testAdminEndpoints() {
  console.log('\n🔍 Testing Admin Endpoints...');
  
  if (!authToken) {
    console.log('   Skipping admin endpoints - no auth token available');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${authToken}`
  };
  
  // Test get dashboard stats
  const dashboardResponse = await makeRequest(`${BASE_URL}/api/admin/dashboard`, { headers });
  const dashboardSuccess = dashboardResponse.status === 200 && dashboardResponse.data;
  logTest('Get Dashboard Stats', dashboardSuccess, dashboardResponse.data, dashboardSuccess ? null : `Status: ${dashboardResponse.status}`);
  
  // Test get all users
  const usersResponse = await makeRequest(`${BASE_URL}/api/admin/users`, { headers });
  const usersSuccess = usersResponse.status === 200 && Array.isArray(usersResponse.data);
  logTest('Get All Users', usersSuccess, usersResponse.data, usersSuccess ? null : `Status: ${usersResponse.status}`);
  
  // Test get user by ID
  const userResponse = await makeRequest(`${BASE_URL}/api/admin/users/1`, { headers });
  const userSuccess = userResponse.status === 200 && userResponse.data && userResponse.data.id;
  logTest('Get User by ID', userResponse.status === 200, userResponse.data, userSuccess ? null : `Status: ${userResponse.status}`);
  
  // Test create user
  const createUserResponse = await makeRequest(`${BASE_URL}/api/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username: 'newadmin',
      email: 'newadmin@example.com',
      password: 'adminpass123',
      role: 'admin',
      memberId: null
    })
  });
  const createUserSuccess = createUserResponse.status === 201;
  logTest('Create User', createUserSuccess, createUserResponse.data, createUserSuccess ? null : `Status: ${createUserResponse.status}`);
}

async function testErrorHandling() {
  console.log('\n🔍 Testing Error Handling...');
  
  // Test invalid route (404)
  const invalidRouteResponse = await makeRequest(`${BASE_URL}/api/invalid`);
  const invalidRouteSuccess = invalidRouteResponse.status === 404;
  logTest('Invalid Route (404)', invalidRouteSuccess, invalidRouteResponse.data, invalidRouteSuccess ? null : `Status: ${invalidRouteResponse.status}`);
  
  // Test unauthorized access (401)
  const unauthorizedResponse = await makeRequest(`${BASE_URL}/api/profile`);
  const unauthorizedSuccess = unauthorizedResponse.status === 401;
  logTest('Unauthorized Access (401)', unauthorizedSuccess, unauthorizedResponse.data, unauthorizedSuccess ? null : `Status: ${unauthorizedResponse.status}`);
  
  // Test forbidden access (403) - try to access admin without admin role
  if (authToken) {
    const forbiddenResponse = await makeRequest(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    const forbiddenSuccess = forbiddenResponse.status === 401 || forbiddenResponse.status === 403;
    logTest('Forbidden Access (401/403)', forbiddenSuccess, forbiddenResponse.data, forbiddenSuccess ? null : `Status: ${forbiddenResponse.status}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Unholy Souls MC API Endpoint Testing...\n');
  
  try {
    await testHealthCheck();
    await testAuthentication();
    await testPublicEndpoints();
    await testProtectedEndpoints();
    await testAdminEndpoints();
    await testErrorHandling();
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.errors.length > 0) {
      console.log('\n🚨 Errors Found:');
      testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.name}: ${error.error}`);
      });
    }
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! No errors found.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
  }
}

// Run the tests
runAllTests();
