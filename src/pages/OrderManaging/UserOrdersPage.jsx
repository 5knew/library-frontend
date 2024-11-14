import React, { useEffect, useState } from 'react';
import { OrderService } from '../../Services/OrderService/OrderService';
import { PaymentService } from '../../Services/PaymentService/PaymentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const idOfUser = localStorage.getItem('userId');
        setUserId(idOfUser);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchOrdersByUser(userId, page);
        }
    }, [userId, page]);

    const fetchOrdersByUser = async (userId, page) => {
        try {
            const response = await OrderService.getOrdersByUserId(userId, page, 10); // Page size of 10
            const ordersData = response.data.content || [];

            // Fetch payment details for each order
            const ordersWithPayment = await Promise.all(
                ordersData.map(async (order) => {
                    const paymentResponse = await PaymentService.getPaymentByOrderId(order.id);
                    return { ...order, payment: paymentResponse.data };
                })
            );

            setOrders(ordersWithPayment);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await OrderService.cancelOrder(orderId);
            fetchOrdersByUser(userId, page);  // Refresh orders after cancellation
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.map(order => (
                <div key={order.id} className="mb-6 p-4 border rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Order ID: {order.id}</h2>
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>

                    {/* Payment Details */}
                    {order.payment ? (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Payment Details:</h3>
                            <p>Payment Status: {order.payment.paymentStatus}</p>
                            <p>Payment Date: {new Date(order.payment.paymentDate).toLocaleDateString()}</p>
                            <p>Amount: ${order.payment.amount.toFixed(2)}</p>
                            <p>Transaction ID: {order.payment.transactionId}</p>
                            
                            {/* Cancel Order Button */}
                            {order.payment.paymentStatus === 'PENDING' && (
                                <Button 
                                    variant="outline" 
                                    color="red" 
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    ) : (
                        <p className="text-red-500 mt-4">No Payment Information Available</p>
                    )}

                    {/* Cart Items */}
                    <h3 className="text-lg font-semibold mt-4">Items:</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.cartItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.bookCopy.book.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.bookCopy.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>Page {page + 1} of {totalPages}</span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default UserOrdersPage;
