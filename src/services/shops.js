// src/services/shops.js
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
// SHOPS
// ============================================

// Get all shops
// GET /admin/shops
export const getShops = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/shops?${query}`, {
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

// Create new shop
// POST /admin/shops
export const createShop = async (token, shopData) => {
    try {
        const response = await fetch(`${API_URL}/shops`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shopData),
        });
        return await handleResponse(response);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Update shop
// PUT /admin/shops/:shopId
export const updateShop = async (token, shopId, shopData) => {
    try {
        const response = await fetch(`${API_URL}/shops/${shopId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shopData),
        });
        return await handleResponse(response);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Assign staff to shop
// POST /admin/shops/:shopId/staff
export const assignStaffToShop = async (token, shopId, staffData) => {
    try {
        const response = await fetch(`${API_URL}/shops/${shopId}/staff`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(staffData),
        });
        return await handleResponse(response);
    } catch (error) {
        return { success: false, message: error.message };
    }
};
