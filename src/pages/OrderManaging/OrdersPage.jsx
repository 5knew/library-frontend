import React, { useEffect, useState } from 'react';
import { OrderService } from '../../Services/OrderService/OrderService';
import UserService from '../../Services/UserManagingService/UserService';
import { CartItemService } from '../../Services/CartItemService/CartItemService';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import BookService from '../../Services/BookService/BookService';
import AuthorService from '../../Services/AuthorService/AuthorService';
import CategoryService from '../../Services/CategoryService/CategoryService';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, User, Package, Calendar, DollarSign, Book, Hash, Globe } from 'lucide-react'

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchOrders(page, size);
    }, [page]);

    const fetchOrders = async (page, size) => {
        try {
            const response = await OrderService.getAllOrders(page, size);
            const ordersData = response.data.content || [];

            const ordersWithDetails = await Promise.all(
                ordersData.map(async (order) => {
                    let userData = null;
                    if (order.user && order.user.id) {
                        userData = await UserService.getUser(order.user.id);
                    }

                    const cartItems = await CartItemService.getCartItemsByOrderId(order.id);
                    const cartItemsArray = Array.isArray(cartItems.data) ? cartItems.data : [];

                    const cartItemsWithDetails = await Promise.all(
                        cartItemsArray.map(async (cartItem) => {
                            const bookCopy = await BookCopyService.getBookCopyById(cartItem.bookCopy.id);
                            const bookDetails = await BookService.getBookById(bookCopy.book.id);

                            // Fetch author and category names
                            const authorNames = await Promise.all(
                                bookDetails.authors.map(async (author) => {
                                    const authorId = author.id; // Ensure this is an ID
                                    const authorData = await AuthorService.getAuthorById(authorId);
                                    return authorData.name;
                                })
                                
                            );

                            const categoryNames = await Promise.all(
                                bookDetails.categories.map(async (category) => {
                                    const categoryId = category.id; // Ensure this is an ID
                                    const categoryData = await CategoryService.getCategoryById(categoryId);
                                    return categoryData.name;
                                })                                
                            );

                            return {
                                ...cartItem,
                                bookCopy,
                                book: {
                                    id: bookDetails.id,
                                    name: bookDetails.name,
                                    isbn: bookDetails.isbn,
                                    authorNames,
                                    categoryNames,
                                },
                            };
                        })
                    );

                    return { ...order, user: userData, cartItems: cartItemsWithDetails };
                })
            );

            setOrders(ordersWithDetails);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(0, page - 2);
        const endPage = Math.min(totalPages - 1, page + 2);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="orders-page">
            <h1>Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <h2>Order ID: {order.id}</h2>
                        {order.user && (
                            <>
                                <p>User ID: {order.user.id}</p>
                                <p>Name: {order.user.firstName} {order.user.lastName}</p>
                                <p>Email: {order.user.email}</p>
                                <p>Phone: {order.user.phoneNumber || "N/A"}</p>
                            </>
                        )}
                        <p>Total Amount: {order.totalAmount || "N/A"}</p>
                        <p>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</p>

                        {/* Display Cart Items with Book Copy and Book Details */}
                        <h3>Cart Items</h3>
                        <ul>
                            {order.cartItems && order.cartItems.map(cartItem => (
                                <li key={cartItem.id}>
                                    <p>Book Copy ID: {cartItem.bookCopy.id}</p>
                                    <p>Quantity: {cartItem.quantity}</p>
                                    <p>Book ID: {cartItem.book.id}</p>
                                    <p>Book Name: {cartItem.book.name}</p>
                                    <p>ISBN: {cartItem.book.isbn}</p>
                                    <p>Price: {cartItem.bookCopy.price}</p>
                                    <p>Publication Date: {new Date(cartItem.bookCopy.publicationDate).toLocaleDateString()}</p>
                                    <p>Language: {cartItem.bookCopy.language}</p>
                                    <p>Categories: {cartItem.book.categoryNames.join(", ")}</p>
                                    <p>Authors: {cartItem.book.authorNames.join(", ")}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    Previous
                </button>
                {generatePageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={pageNumber === page ? 'active' : ''}
                    >
                        {pageNumber + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrdersPage;
