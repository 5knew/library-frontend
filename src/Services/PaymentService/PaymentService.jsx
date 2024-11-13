import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/payments';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Process payment for the order
const processPayment = (userEmail, userId, cartItemIds,) => {
    return axios.post(`${BASE_URL}/process`, cartItemIds, {
        params: { userEmail, userId },
        headers: getAuthHeader(),
    }).catch(error => console.error("Error processing payment:", error));
};

// Handle payment notification with paymentId and payerId for PayPal
const handlePaymentNotification = (paymentId, payerId) => {
    return axios.post(`${BASE_URL}/notification`, null, {
        params: { paymentId, payerId },
        headers: getAuthHeader(),
    }).catch(error => console.error("Error processing payment notification:", error));
};

// Manually create a payment
const createPayment = (orderId, paymentData) => {
    return axios.post(BASE_URL, paymentData, {
        params: { orderId },
        headers: getAuthHeader(),
    }).catch(error => console.error("Error creating payment:", error));
};

// Get payment by ID
const getPaymentById = (id) => {
    return axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() })
        .catch(error => console.error("Error fetching payment by ID:", error));
};

// Get payment by transaction ID
const getPaymentByTransactionId = (transactionId) => {
    return axios.get(`${BASE_URL}/transaction/${transactionId}`, { headers: getAuthHeader() })
        .catch(error => console.error("Error fetching payment by transaction ID:", error));
};

// Get payment by order ID
const getPaymentByOrderId = (orderId) => {
    return axios.get(`${BASE_URL}/order/${orderId}`, { headers: getAuthHeader() })
        .catch(error => console.error("Error fetching payment by order ID:", error));
};

// Get all payments
const getAllPayments = async () => {
    try {
        const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
        console.log("Payments response:", response.data);
        return response.data;  // Ensure this matches the expected structure
    } catch (error) {
        console.error("Error fetching all payments:", error);
        throw error;
    }
};


// Update payment status
const updatePaymentStatus = (id, paymentStatus) => {
    return axios.put(`${BASE_URL}/${id}`, null, {
        params: { paymentStatus },
        headers: getAuthHeader(),
    }).catch(error => console.error("Error updating payment status:", error));
};

// Delete payment by ID
const deletePayment = (id) => {
    return axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() })
        .catch(error => console.error("Error deleting payment by ID:", error));
};

export const PaymentService = {
    processPayment,
    handlePaymentNotification,
    createPayment,
    getPaymentById,
    getPaymentByTransactionId,
    getPaymentByOrderId,
    getAllPayments,
    updatePaymentStatus,
    deletePayment,
};
