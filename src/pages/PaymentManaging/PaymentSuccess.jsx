import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PaymentService } from '@/Services/PaymentService/PaymentService';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('paymentId');
  const payerId = searchParams.get('PayerID');

  useEffect(() => {
    if (paymentId && payerId) {
      PaymentService.handlePaymentNotification(paymentId, payerId)
        .then(() => {
          console.log("Payment notification processed successfully.");
        })
        .catch(error => {
          console.error("Error processing payment notification:", error);
        });
    }
  }, [paymentId, payerId]);

  const handleGoBack = () => {
    navigate('/account');
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-4">Thank you for your payment. Your transaction was successful.</p>
      {paymentId && (
        <p className="text-gray-700 mb-4">
          <strong>Payment ID:</strong> {paymentId}
        </p>
      )}
      <Button onClick={handleGoBack} className="bg-green-500 hover:bg-green-600 text-white">
        Go to My Account
      </Button>
    </div>
  );
};

export default PaymentSuccess;
