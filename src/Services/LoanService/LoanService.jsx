import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/admin/loans'; // Make sure the port and path match your Loan service

const loanBook = (loanData) => {
    return axios.post(`${BASE_URL}/loans`, loanData);
};

const updateLoan = (loanId, loanData) => {
    return axios.put(`${BASE_URL}/${loanId}`, loanData);
};

const getLoanById = (loanId) => {
    return axios.get(`${BASE_URL}/${loanId}`);
};

const deleteLoan = (loanId) => {
    return axios.delete(`${BASE_URL}/${loanId}`);
};

const getAllLoans = () => {
    return axios.get(BASE_URL);
};

const returnBook = (loanId, returnDate) => {
    return axios.post(`${BASE_URL}/${loanId}/return`, null, { params: { returnDate } });
};

const extendLoan = (loanId, newDueDate) => {
    return axios.post(`${BASE_URL}/${loanId}/extend`, null, { params: { newDueDate } });
};

const getLoansByUserId = (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`);
};

const getLoansByBookId = (bookId) => {
    return axios.get(`${BASE_URL}/book/${bookId}`);
};

const getOverdueLoans = () => {
    return axios.get(`${BASE_URL}/overdue`);
};

const searchLoans = (criteria) => {
    return axios.post(`${BASE_URL}/search`, criteria);
};

const getActiveLoans = () => {
    return axios.get(`${BASE_URL}/active`);
};

export const LoanService = {
    loanBook,
    updateLoan,
    getLoanById,
    deleteLoan,
    getAllLoans,
    returnBook,
    extendLoan,
    getLoansByUserId,
    getLoansByBookId,
    getOverdueLoans,
    searchLoans,
    getActiveLoans
};
