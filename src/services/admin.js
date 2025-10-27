// src/services/admin.js
const API_BASE_URL = 'https://econet-webstore-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/admin`;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Get Dashboard Overview
export const getDashboardOverview = async (token) => {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (token, productId) => {
  try {
    const response = await fetch(`${ADMIN_API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleAdminResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getProductById = async (token, productId) => {
  try {
    const response = await fetch(`${ADMIN_API_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleAdminResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (token, productId, productData) => {
  try {
    const response = await fetch(`${ADMIN_API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleAdminResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createProduct = async (token, productData) => {
  try {
    const response = await fetch(`${ADMIN_API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleAdminResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getProducts = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${ADMIN_API_URL}/products?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleAdminResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all orders for admin with filters
export const getAdminOrders = async (token, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/orders${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get single order (Admin)
export const getAdminOrderById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update order status (Admin)
export const updateAdminOrder = async (token, id, updateData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete order (Admin)
export const deleteAdminOrder = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};
