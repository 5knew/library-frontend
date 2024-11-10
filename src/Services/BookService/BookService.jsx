import axios from 'axios';
import qs from 'qs';

const BASE_URL = 'http://localhost:8080/api/v1/admin/books';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split('T')[0] : '';
};

const BookService = {
  createBook: async (formData) => {
    try {
      const response = await axios.post(BASE_URL, formData, {
          headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      });
      
        return response.data;
    } catch (error) {
        console.error("Error creating book:", error.response || error);
        throw error;
    }
},


  getBookById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error fetching book by ID:", error.response || error);
      throw error;
    }
  },

  getAllBooks: async () => {
    try {
      const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error fetching all books:", error.response || error);
      throw error;
    }
  },

  updateBook: async (id, formData) => {
    try {
      
      const response = await axios.put(`${BASE_URL}/${id}`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error.response || error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error deleting book:", error.response || error);
      throw error;
    }
  },

  // Search books by query
  searchBooks: async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search-basic?q=${query}`);
        return response.data || []; // Return empty array if data is not defined
    } catch (error) {
        console.error("Error searching books:", error);
        return []; // Return empty array on error
    }
},


advancedSearch: async (filters) => {
  try {
      const response = await axios.get(`${BASE_URL}/search-advanced`, {
          headers: getAuthHeader(),
          params: filters,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),  // Serialize arrays correctly
      });
      return response.data || []; // Return empty array if data is not defined
  } catch (error) {
      console.error("Error performing advanced search:", error);
      return []; // Return empty array on error
  }
},

getBooksByCategoryId: async (categoryId) => {
  try {
      const response = await axios.get(`${BASE_URL}/category/${categoryId}`, { headers: getAuthHeader() });
      return response.data || [];
  } catch (error) {
      console.error("Error fetching books by category ID:", error);
      throw error;
  }
}
  
};

export default BookService;
