// src/services/auth.js

// Determine the API URL based on environment
const API_BASE_URL = 'https://econet-webstore-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/auth`;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'An error occurred');
  }

  return data;
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Admin login - uses the regular auth endpoint with admin credentials
// API Response: { success: true, data: { user: {...}, accessToken: "...", refreshToken: "..." } }
export const login = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    // Extract user and token from the response
    // API returns: { success: true, data: { user: {...}, accessToken: "..." } }
    const user = data.data?.user;
    const token = data.data?.accessToken;

    // Ensure we return the expected format
    return {
      success: data.success !== false,
      token: token,
      user: user,
      message: data.message
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

// Get user profile - uses the /me endpoint
// API Response: { success: true, data: { user: {...} } }
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);

    // API returns: { success: true, data: { user: {...} } }
    const user = data.data?.user || data.data;

    return {
      success: data.success !== false,
      data: user
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, message: error.message };
  }
};

export const verifyEmail = async (data) => {
  try {
    const response = await fetch(`${API_URL}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const resendVerification = async (token) => {
  try {
    const response = await fetch(`${API_URL}/resend-verification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const changePassword = async (passwords, token) => {
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};