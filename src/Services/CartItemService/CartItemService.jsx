import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/cart-items';

// Function to get authorization header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new cart item
const createCartItem = (cartItemData) => {
    return axios.post(BASE_URL, cartItemData, {
        headers: getAuthHeader()
    });
};

// Get a cart item by ID
const getCartItemById = (id) => {
    return axios.get(`${BASE_URL}/${id}`, {
        headers: getAuthHeader()
    });
};

// Get cart items by Order ID
const getCartItemsByOrderId = (orderId) => {
    return axios.get(`${BASE_URL}/order/${orderId}`, {
        headers: getAuthHeader()
    });
};

// Get all cart items
const getAllCartItems = () => {
    return axios.get(BASE_URL, {
        headers: getAuthHeader()
    });
};

const getCartItemsByUserId = (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

// Update a cart item by ID
const updateCartItem = (id, cartItemData) => {
    return axios.put(`${BASE_URL}/${id}`, cartItemData, {
        headers: getAuthHeader()
    });
};

// Delete a cart item by ID
const deleteCartItem = (id) => {
    return axios.delete(`${BASE_URL}/${id}`, {
        headers: getAuthHeader()
    });
};

// Search for cart items with optional filters for user ID and book copy ID
const searchCartItems = (filters) => {
    return axios.get(`${BASE_URL}/search`, {
        headers: getAuthHeader(),
        params: filters
    });
};

export const CartItemService = {
    createCartItem,
    getCartItemById,
    getAllCartItems,
    updateCartItem,
    deleteCartItem,
    searchCartItems,
    getCartItemsByUserId,
    getCartItemsByOrderId
};
