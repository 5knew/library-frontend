// src/pages/PaymentsListPage.js
import React, { useState, useEffect } from 'react';
import { PaymentService } from '../../Services/PaymentService/PaymentService';
import { useNavigate } from 'react-router-dom';

const PaymentsListPage = () => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await PaymentService.getAllPayments();
            setPayments(data);
        } catch (error) {
            console.error("Ошибка загрузки списка платежей:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-3xl font-bold text-center mb-8">Список платежей</h1>
            {payments.length > 0 ? (
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th>Дата платежа</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id}>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                <td>{payment.amount} ₽</td>
                                <td>{payment.paymentStatus}</td>
                                <td>
                                    <button 
                                        onClick={() => navigate(`/payments/${payment.id}`)} 
                                        className="text-blue-500 hover:underline">
                                        Подробнее
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Список платежей пуст.</p>
            )}
        </div>
    );
};

export default PaymentsListPage;
