import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/orders';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Создание нового заказа
// Вызов функции createOrder с userId как параметром и cartItemIds в теле запроса
const createOrder = (userId, cartItemIds) => {
    return axios.post(`${BASE_URL}`, cartItemIds, {
        headers: getAuthHeader(),
        params: { userId }, // userId как параметр запроса
    });
};



// Получить заказ по ID
const getOrderById = (id) => {
    return axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() })
        .catch(error => console.error("Ошибка получения заказа по ID:", error));
};
// Fetch paginated orders
// const getOrders = (page = 0, size = 10) => {
//     return axios.get(`${BASE_URL}`, {
//         params: { page, size },
//     });
// };


// Получить все заказы
const getAllOrders = (page = 0, size = 10) => {
    return axios.get(BASE_URL, { 
        headers: getAuthHeader(),
        params: { page, size },
    })
    .catch(error => console.error("Ошибка получения всех заказов:", error));
};


// Получить заказы по ID пользователя
const getOrdersByUserId = (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`, { headers: getAuthHeader() })
        .catch(error => console.error("Ошибка получения заказов по ID пользователя:", error));
};

// Обновить заказ по ID
const updateOrder = (id, orderData) => {
    return axios.put(`${BASE_URL}/${id}`, orderData, { headers: getAuthHeader() })
        .catch(error => console.error("Ошибка обновления заказа:", error));
};

// Удалить заказ по ID
const deleteOrder = (id) => {
    return axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() })
        .catch(error => console.error("Ошибка удаления заказа:", error));
};

export const OrderService = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
};
