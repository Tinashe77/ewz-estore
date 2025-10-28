// src/services/products.js - COMPLETE FIX
const API_BASE_URL = 'https://econet-webstore-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/products`;
const SEARCH_URL = `${API_BASE_URL}/api/search`;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

export const getProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/related`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const searchProducts = async (query, params = {}) => {
  try {
    const allParams = { q: query, ...params };
    const queryString = new URLSearchParams(allParams).toString();
    const response = await fetch(`${API_URL}/search?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    const response = await fetch(`${SEARCH_URL}/suggestions?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// FIXED: Proper FormData handling with boolean conversion
export const createProduct = async (token, productData) => {
  try {
    // Ensure boolean fields are properly sent as strings for FormData
    if (productData.has('featured')) {
      const featured = productData.get('featured');
      productData.set('featured', featured === true || featured === 'true' ? 'true' : 'false');
    }
    if (productData.has('isActive')) {
      const isActive = productData.get('isActive');
      productData.set('isActive', isActive === true || isActive === 'true' ? 'true' : 'false');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // DO NOT set Content-Type - browser will set it with boundary for FormData
      },
      body: productData, // FormData object
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// FIXED: Proper FormData handling with boolean conversion
export const updateProduct = async (token, id, productData) => {
  try {
    // Ensure boolean fields are properly sent as strings for FormData
    if (productData.has('featured')) {
      const featured = productData.get('featured');
      productData.set('featured', featured === true || featured === 'true' ? 'true' : 'false');
    }
    if (productData.has('isActive')) {
      const isActive = productData.get('isActive');
      productData.set('isActive', isActive === true || isActive === 'true' ? 'true' : 'false');
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // DO NOT set Content-Type - browser will set it with boundary for FormData
      },
      body: productData, // FormData object
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
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

/**
 * Bulk import products from CSV file
 * API Documentation: POST /admin/bulk-import/products/import
 * @param {string} token - Authentication token
 * @param {File} csvFile - CSV file to import
 * @param {Object} options - Import options
 * @param {boolean} options.updateExisting - Whether to update existing products (default: true)
 * @returns {Promise<Object>} Import results
 */
export const bulkImportProducts = async (token, csvFile, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile); // Field name is 'file' per API docs

    // Add updateExisting option
    if (options.updateExisting !== undefined) {
      formData.append('updateExisting', options.updateExisting.toString());
    }

    // Correct endpoint from API documentation
    const response = await fetch(`${API_BASE_URL}/api/admin/bulk-import/products/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // CRITICAL: NO Content-Type header for FormData!
        // Browser will automatically set multipart/form-data with boundary
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Validate CSV before import (dry run)
 * API Documentation: POST /admin/bulk-import/products/validate
 */
export const validateProductCSV = async (token, csvFile, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);

    if (options.updateExisting !== undefined) {
      formData.append('updateExisting', options.updateExisting.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/bulk-import/products/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Download product template CSV
 * API Documentation: GET /admin/bulk-import/products/template
 */
export const downloadSampleCSV = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bulk-import/products/template`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download product template');
    }

    return await response.blob();
  } catch (error) {
    console.error('Failed to download product template:', error);
    return null;
  }
};

/**
 * Download update sample CSV (using same template endpoint)
 * Contains all fields - users can choose which to update
 */
export const downloadUpdateSampleCSV = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bulk-import/products/template`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download product template');
    }

    return await response.blob();
  } catch (error) {
    console.error('Failed to download product template:', error);
    return null;
  }
};
