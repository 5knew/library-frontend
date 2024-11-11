// src/pages/PaymentFailure.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/checkout'); // Adjust the path as needed to retry
  };

  const handleContactSupport = () => {
    navigate('/support'); // Adjust to your support/contact page
  };

  return (
    <div className="container mx-auto p-6 bg-red-50 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Failed</h1>
      <p className="text-lg mb-4">Unfortunately, your payment could not be processed.</p>
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={handleRetryPayment} className="bg-red-500 hover:bg-red-600 text-white">
          Retry Payment
        </Button>
        <Button onClick={handleContactSupport} className="bg-gray-500 hover:bg-gray-600 text-white">
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailure;
