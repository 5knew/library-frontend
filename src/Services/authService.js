import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth/';

export const authService = {
  signIn: async (email, password) => {
    const response = await axios.post(`${API_URL}signin`, { email, password });
    return response.data;
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_URL}refresh`, { token: refreshToken });
    
    // Сохранение новых токенов
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    return response.data.token;
  },
};
