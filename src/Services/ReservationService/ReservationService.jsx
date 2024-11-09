import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/reservations';

export const ReservationService = {
  createReservation: (reservationData) => {
    return axios.post(BASE_URL, reservationData);
  },

  updateReservation: (id, reservationData) => {
    return axios.put(`${BASE_URL}/${id}`, reservationData);
  },

  getReservationById: (id) => {
    return axios.get(`${BASE_URL}/${id}`);
  },

  deleteReservation: (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
  },

  getAllReservations: () => {
    return axios.get(BASE_URL);
  },

  getReservationsByUserId: (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`);
  },

  getReservationsByBookId: (bookId) => {
    return axios.get(`${BASE_URL}/book/${bookId}`);
  },

  getReservationsByStatus: (status) => {
    return axios.get(`${BASE_URL}/status/${status}`);
  },

  searchReservations: (searchCriteria) => {
    return axios.post(`${BASE_URL}/search`, searchCriteria);
  }
};
