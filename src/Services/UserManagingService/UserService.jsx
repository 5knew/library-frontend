import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/admin/users'; // Adjust the base URL as per your configuration

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Assuming the token is stored in local storage after login
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

const UserService = {
  addUser: async (user) => {
    return axios.post(API_URL, user, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  getAllUsers: async () => {
    return axios.get(API_URL, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  updateUser: async (userId, user) => {
    return axios.put(`${API_URL}/${userId}`, user, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },
  
  deleteUser: async (userId) => {
    return axios.delete(`${API_URL}/${userId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  changeUserRole: async (userId, newRole) => {
    return axios.patch(`${API_URL}/${userId}/role`, { role: newRole }, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  activateUser: async (userId) => {
    return axios.patch(`${API_URL}/${userId}/activate`, {}, { headers: getAuthHeader() }) // Note the empty body `{}` for PATCH requests without a body
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  deactivateUser: async (userId) => {
    return axios.patch(`${API_URL}/${userId}/deactivate`, {}, { headers: getAuthHeader() }) // Note the empty body `{}` for PATCH requests without a body
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  },

  getUser: async (userId) => {
    return axios.get(`${API_URL}/${userId}`, { headers: getAuthHeader() })
      .then(response => response.data)
      .catch(error => Promise.reject(error.response.data));
  }
  
};

export default UserService;
