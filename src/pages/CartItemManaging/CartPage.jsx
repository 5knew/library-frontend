import React, { useState, useEffect } from 'react';
import { CartItemService } from '../../Services/CartItemService/CartItemService';
import { OrderService } from '../../Services/OrderService/OrderService';
import { PaymentService } from '../../Services/PaymentService/PaymentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faShoppingCart, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        setEmail(storedEmail);

        if (token && storedUserId) {
            setUserId(storedUserId);
            fetchCartItems(storedUserId);
        } else {
            setError("User ID or token is missing.");
        }
    }, []);

    const fetchCartItems = async (userId) => {
        try {
            const response = await CartItemService.getCartItemsByUserId(userId);
            setCartItems(response.data || []);
            calculateTotalPrice(response.data || []);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setError("Failed to fetch cart items.");
        }
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.bookCopy.price, 0);
        setTotalPrice(total);
    };

    const handleDeleteCartItem = async (id) => {
        try {
            await CartItemService.deleteCartItem(id);
            const updatedCart = cartItems.filter(item => item.id !== id);
            setCartItems(updatedCart);
            calculateTotalPrice(updatedCart);
        } catch (error) {
            console.error("Error deleting cart item:", error);
            setError("Failed to delete cart item.");
        }
    };

    const handleProceedToPayment = async () => {
        try {
            const cartItemIds = cartItems.map(item => item.id);
            const orderResponse = await OrderService.createOrder(userId, cartItemIds);
    
            if (orderResponse.status === 201 && orderResponse.data) {
                const orderId = orderResponse.data.id;
                const userEmail = email;
                const paymentResponse = await PaymentService.processPayment(orderId, userEmail);
    
                if (paymentResponse.status === 201) {
                    const approvalUrl = paymentResponse.data.approvalUrl;
                    if (approvalUrl) {
                        window.location.href = approvalUrl;  // Перенаправляем на PayPal
                    } else {
                        alert("Failed to retrieve payment approval URL. Please try again.");
                    }
                }
            } else {
                alert("Failed to create order. Please try again.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            setError("An error occurred while processing payment. Please try again.");
        }
    };
    

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Cart</h1>

            {error && <div className="text-center text-red-500 mb-4">{error}</div>}

            {cartItems.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">{item.bookCopy.book.name}</h2>
                                    <p className="text-gray-600"><strong>Authors:</strong> {item.bookCopy.book.authors.map(author => author.name).join(', ')}</p>
                                    <p className="text-gray-600"><strong>Price:</strong> {item.bookCopy.price} tg </p>
                                    <p className="text-gray-600"><strong>Condition:</strong> {item.bookCopy.condition}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteCartItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-xl font-semibold text-center">
                        Total Price: {totalPrice} tg
                    </div>
                    <button 
                        onClick={handleProceedToPayment} 
                        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                        Proceed to Payment
                    </button>
                </>
            ) : (
                <div className="text-center text-gray-500 mt-8">
                    <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-4" />
                    <p className="mb-4">Your cart is empty.</p>
                    <a href="/books-with-copies" className="text-blue-500 hover:underline">Browse books</a>
                </div>
            )}
        </div>
    );
};

export default CartPage;
