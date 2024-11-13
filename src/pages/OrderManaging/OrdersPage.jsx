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
    }, [page]);  // only depend on `page`

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
                                    const authorId = author.id;
                                    const authorData = await AuthorService.getAuthorById(authorId);
                                    return authorData.name;
                                })
                            );

                            const categoryNames = await Promise.all(
                                bookDetails.categories.map(async (category) => {
                                    const categoryId = category.id;
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
        setPage(newPage); // Update `page` directly to trigger a re-fetch
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
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {orders.map(order => (
                <Card key={order.id} className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Order ID: {order.id}</span>
                            <Badge variant="outline">
                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <User className="mr-2" /> Customer Information
                                </h3>
                                {order.user && (
                                    <div className="space-y-1">
                                        <p>User ID: {order.user.id}</p>
                                        <p>Name: {order.user.firstName} {order.user.lastName}</p>
                                        <p>Email: {order.user.email}</p>
                                        <p>Phone: {order.user.phoneNumber || "N/A"}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <Package className="mr-2" /> Order Details
                                </h3>
                                <div className="space-y-1">
                                    <p className="flex items-center">
                                        <Calendar className="mr-2" size={16} />
                                        Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                                    </p>
                                    <p className="flex items-center">
                                        <DollarSign className="mr-2" size={16} />
                                        Total Amount: {order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Book className="mr-2" /> Cart Items
                        </h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Publication Date</TableHead>
                                    <TableHead>Language</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.cartItems && order.cartItems.map(cartItem => (
                                    <TableRow key={cartItem.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{cartItem.book.name}</p>
                                                <p className="text-sm text-muted-foreground">ISBN: {cartItem.book.isbn}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{cartItem.quantity}</TableCell>
                                        <TableCell>${cartItem.bookCopy.price.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(cartItem.bookCopy.publicationDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{cartItem.bookCopy.language}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 space-y-2">
                            <p className="flex items-center">
                                <Hash className="mr-2" size={16} />
                                Categories: {order.cartItems && order.cartItems[0] ? order.cartItems[0].book.categoryNames.join(", ") : "N/A"}
                            </p>
                            <p className="flex items-center">
                                <User className="mr-2" size={16} />
                                Authors: {order.cartItems && order.cartItems[0] ? order.cartItems[0].book.authorNames.join(", ") : "N/A"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {generatePageNumbers().map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === page ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber + 1}
                    </Button>
                ))}
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

export default OrdersPage;
