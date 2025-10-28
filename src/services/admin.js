// src/services/admin.js
const API_BASE_URL = 'https://econet-webstore-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/admin`;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'An error occurred');
  }

  return data;
};

// ============================================
// DASHBOARD
// ============================================

// Get Dashboard Overview
// GET /admin/dashboard
// API Response: { success: true, dashboard: { orders: {...}, revenue: {...}, users: {...}, products: {...}, ... } }
export const getDashboardOverview = async (token) => {
  try {
    console.log('Fetching dashboard from:', `${API_URL}/dashboard`);
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Dashboard response status:', response.status);
    const data = await handleResponse(response);
    console.log('Dashboard raw data received:', data);

    // Transform the API response to match the component's expected structure
    // API returns: { success: true, dashboard: { orders: {...}, revenue: {...}, ... } }
    // Component expects: { success: true, data: { summary: {...}, recentOrders: [...], topProducts: [...] } }
    const transformedData = {
      success: data.success,
      data: {
        summary: {
          totalRevenue: data.dashboard?.revenue?.total || 0,
          currency: data.dashboard?.revenue?.currency || 'USD',
          totalOrders: data.dashboard?.orders?.total || 0,
          pendingOrders: data.dashboard?.orders?.pending || 0,
          completedOrders: data.dashboard?.orders?.completed || 0,
          totalCustomers: data.dashboard?.users?.total || 0,
          activeCustomers: data.dashboard?.users?.active || 0,
          activeProducts: data.dashboard?.products?.total || 0,
          lowStockProducts: data.dashboard?.products?.lowStock || 0,
          completedPayments: data.dashboard?.payments?.completed || 0,
          failedPayments: data.dashboard?.payments?.failed || 0,
          totalReturns: data.dashboard?.returns?.total || 0,
          pendingReturns: data.dashboard?.returns?.pending || 0
        },
        recentOrders: data.dashboard?.recentOrders || [],
        topProducts: data.dashboard?.topProducts || [],
        period: 'last_30_days'
      }
    };

    console.log('Dashboard transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return { success: false, message: error.message };
  }
};

// ============================================
// PRODUCTS
// ============================================

// Get all products (Admin View)
// GET /admin/products
export const getProducts = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products?${query}`, {
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

// Create new product
// POST /admin/products
export const createProduct = async (token, productData) => {
  try {
    const isFormData = productData instanceof FormData;
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers,
      body: isFormData ? productData : JSON.stringify(productData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update product
// PUT /admin/products/:productId
export const updateProduct = async (token, productId, productData) => {
  try {
    const isFormData = productData instanceof FormData;
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers,
      body: isFormData ? productData : JSON.stringify(productData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete product
// DELETE /admin/products/:productId
export const deleteProduct = async (token, productId) => {
  try {
    const url = `${API_URL}/products/${productId}`;
    console.log('Deleting product:', { productId, url });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Delete response status:', response.status);
    const result = await handleResponse(response);
    console.log('Delete result:', result);

    return result;
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, message: error.message };
  }
};

// Bulk update products
// PUT /admin/products/bulk-update
export const bulkUpdateProducts = async (token, productIds, updates) => {
  try {
    const response = await fetch(`${API_URL}/products/bulk-update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productIds, updates }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ============================================
// ORDERS
// ============================================

// Get all orders (Admin)
// GET /admin/orders
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

// Get single order details (Admin)
// GET /admin/orders/:orderId
export const getAdminOrderById = async (token, orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
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

// Update order status
// PUT /admin/orders/:orderId/status
export const updateOrderStatus = async (token, orderId, statusData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Assign order to staff
// POST /admin/orders/:orderId/assign
export const assignOrderToStaff = async (token, orderId, staffId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ staffId }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Cancel order
// POST /admin/orders/:orderId/cancel
export const cancelOrder = async (token, orderId, cancelData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ============================================
// USERS
// ============================================

// Get all users (Admin)
// GET /admin/users
export const getUsers = async (token, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/users${queryString ? `?${queryString}` : ''}`, {
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

// Get user details
// GET /admin/users/:userId
export const getUserById = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
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

// Update user status
// PUT /admin/users/:userId/status
export const updateUserStatus = async (token, userId, statusData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update user role
// PUT /admin/users/:userId/role
export const updateUserRole = async (token, userId, roleData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Create admin/staff user
// POST /admin/users
export const createUser = async (token, userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};
