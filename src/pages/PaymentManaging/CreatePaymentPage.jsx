// src/pages/CreatePaymentPage.js
import React, { useState } from 'react';
import { PaymentService } from '../../Services/PaymentService/PaymentService';

const CreatePaymentPage = () => {
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    const handleCreatePayment = async () => {
        const paymentData = {
            amount: parseFloat(amount),
            transactionId,
            paymentStatus,
        };

        try {
            await PaymentService.createPayment(orderId, paymentData);
            alert('Платеж создан');
        } catch (error) {
            console.error("Ошибка создания платежа:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-3xl font-bold text-center mb-8">Создание платежа</h1>
            <div className="mb-4">
                <label>Order ID:</label>
                <input 
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label>Сумма:</label>
                <input 
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label>Статус платежа:</label>
                <input 
                    type="text"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label>Транзакция ID:</label>
                <input 
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <button onClick={handleCreatePayment} className="bg-green-500 text-white p-2 rounded">Создать платеж</button>
        </div>
    );
};

export default CreatePaymentPage;
