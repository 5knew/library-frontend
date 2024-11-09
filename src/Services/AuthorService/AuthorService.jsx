import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/authors';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AuthorService = {
  createAuthor: async (author) => {
    try {
      const response = await axios.post(API_URL, author, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error creating author:", error.response || error);
      throw error;
    }
  },

  getAllAuthors: async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("API response data:", response.data); // Должен быть массив
        return response.data;
    } catch (error) {
        console.error("Error fetching authors:", error.response || error);
        throw error;
    }
},



  updateAuthor: async (authorId, author) => {
    try {
      const response = await axios.put(`${API_URL}/${authorId}`, author, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error updating author:", error.response || error);
      throw error;
    }
  },

  deleteAuthor: async (authorId) => {
    try {
      const response = await axios.delete(`${API_URL}/${authorId}`, { headers: getAuthHeader() });
      console.log("Delete response:", response);
      return response.data;
    } catch (error) {
      console.error("Error deleting author:", error.response || error);
      throw error;
    }
  },

  getAuthorById: async (authorId) => {
    try {
      const response = await axios.get(`${API_URL}/${authorId}`, { headers: getAuthHeader() });
      return response.data;
    } catch (error) {
      console.error("Error fetching author by ID:", error.response || error);
      throw error;
    }
  }
};

export default AuthorService;
