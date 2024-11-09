import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/categories';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const CategoryService = {
  createCategory: async (category) => {
    return axios.post(API_URL, category, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  getAllCategories: async () => {
    return axios.get(API_URL, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  updateCategory: async (categoryId, category) => {
    return axios.put(`${API_URL}/${categoryId}`, category, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  deleteCategory: async (categoryId) => {
    return axios.delete(`${API_URL}/${categoryId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  getCategoryById: async (categoryId) => {
    return axios.get(`${API_URL}/${categoryId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  }
};

export default CategoryService;
