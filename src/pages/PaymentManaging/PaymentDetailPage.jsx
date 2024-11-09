// src/pages/PaymentDetailPage.js
import React, { useState, useEffect } from 'react';
import { PaymentService } from '../../Services/PaymentService/PaymentService';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentDetailPage = () => {
    const { id } = useParams();
    const [payment, setPayment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPayment();
    }, [id]);

    const fetchPayment = async () => {
        try {
            const data = await PaymentService.getPaymentById(id);
            setPayment(data);
        } catch (error) {
            console.error("Ошибка загрузки информации о платеже:", error);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await PaymentService.updatePaymentStatus(id, newStatus);
            alert('Статус платежа обновлен');
            fetchPayment(); // Обновляем информацию после изменения
        } catch (error) {
            console.error("Ошибка обновления статуса:", error);
        }
    };

    const handleDeletePayment = async () => {
        try {
            await PaymentService.deletePayment(id);
            alert('Платеж удален');
            navigate('/payments');
        } catch (error) {
            console.error("Ошибка удаления платежа:", error);
        }
    };

    if (!payment) return <p>Загрузка информации...</p>;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-3xl font-bold mb-4">Детали платежа</h1>
            <p><strong>Дата:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
            <p><strong>Сумма:</strong> {payment.amount} ₽</p>
            <p><strong>Статус:</strong> {payment.paymentStatus}</p>
            <p><strong>Номер транзакции:</strong> {payment.transactionId}</p>

            <div className="mt-4">
                <label>Новый статус:</label>
                <input 
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border p-2 rounded"
                />
                <button onClick={handleUpdateStatus} className="ml-2 p-2 bg-blue-500 text-white rounded">Обновить статус</button>
                <button onClick={handleDeletePayment} className="ml-2 p-2 bg-red-500 text-white rounded">Удалить</button>
            </div>
        </div>
    );
};

export default PaymentDetailPage;
