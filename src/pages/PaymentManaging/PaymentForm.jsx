import React, { useState } from 'react';
import axios from 'axios';

function PaymentForm() {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [description, setDescription] = useState('');

    const handlePayment = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/payment/create', {
                amount,
                currency,
                description
            });
            window.location.href = response.data.approval_url;  // Redirect to PayPal
        } catch (error) {
            console.error("Error creating payment", error);
        }
    };

    return (
        <form onSubmit={handlePayment}>
            <h2>Pay with PayPal</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
            </select>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <button type="submit">Pay Now</button>
        </form>
    );
}

export default PaymentForm;
