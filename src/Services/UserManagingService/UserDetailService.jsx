import axios from 'axios';

// Base URL for API (update the URL as per your backend configuration)
const API_URL = 'http://localhost:8080/api/v1/user';

// Function to get Authorization Header
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

const UserDetailService = {

  // Get a specific user by ID
  getUser: async (userId) => {
    return axios.get(`${API_URL}/${userId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },
  

  // Update a specific user by ID
  updateUser: async (userId, user) => {
    return axios.put(`${API_URL}/${userId}`, user, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },

  // Delete a user by ID
  deleteUser: async (userId) => {
    return axios.delete(`${API_URL}/${userId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },

  // Get user's favorite books
  getUserFavorites: async (userId) => {
    return axios.get(`${API_URL}/${userId}/favorites`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },

  // Add a book to user's favorites
  addUserFavorite: async (userId, bookId) => {
    return axios.post(`${API_URL}/${userId}/favorites/${bookId}`, {}, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },

  // Remove a book from user's favorites
  deleteUserFavorite: async (userId, bookId) => {
    return axios.delete(`${API_URL}/${userId}/favorites/${bookId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },

  // Search user's favorite books
  searchUserFavorites: async (userId, { name, authorId, categoryId } = {}) => {
    const params = {};
    if (name) params.name = name;
    if (authorId) params.authorId = authorId;
    if (categoryId) params.categoryId = categoryId;

    return axios.get(`${API_URL}/${userId}/favorites/search`, { params, headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response?.data || error));
  },
};

export default UserDetailService;
