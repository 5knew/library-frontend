import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChevronDown, faChevronUp, faCopy, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BookService from '@/Services/BookService/BookService';
import { BookCopyService } from '@/Services/BookCopyService/BookCopyService';
import UserDetailService from '@/Services/UserManagingService/UserDetailService';

function FavoritesPage() {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [favoriteBookIds, setFavoriteBookIds] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFavoriteBookIds(storedUserId);
            fetchFavoriteBooks(storedUserId);
        } else {
            console.error("User ID is missing.");
        }
    }, []);

    const fetchFavoriteBookIds = async (userId) => {
        try {
            const ids = await UserDetailService.getUserFavorites(userId);
            setFavoriteBookIds(ids);
        } catch (error) {
            console.error("Error fetching favorite book IDs:", error);
        }
    };

    const fetchFavoriteBooks = async (userId) => {
        try {
            const favoriteBookIds = await UserDetailService.getUserFavorites(userId);
            const booksWithCopies = await Promise.all(favoriteBookIds.map(async (bookId) => {
                const bookData = await BookService.getBookById(bookId);
                const copiesData = await BookCopyService.getCopiesByBookId(bookId) || [];
                return { ...bookData, copies: copiesData };
            }));
            setFavoriteBooks(booksWithCopies);
        } catch (error) {
            console.error("Error fetching favorite books:", error);
        }
    };

    const handleFavoriteToggle = async (bookId) => {
        try {
            if (favoriteBookIds.includes(bookId)) {
                await UserDetailService.deleteUserFavorite(userId, bookId);
                setFavoriteBookIds(favoriteBookIds.filter(id => id !== bookId));
            } else {
                await UserDetailService.addUserFavorite(userId, bookId);
                setFavoriteBookIds([...favoriteBookIds, bookId]);
            }
        } catch (error) {
            console.error("Error toggling favorite status:", error);
        }
    };

    const toggleBookExpansion = (bookId) => {
        setExpandedBookId(expandedBookId === bookId ? null : bookId);
    };

    const handleAddToCart = async (copyId) => {
        try {
            await UserDetailService.addUserFavorite(userId, copyId);
            alert("Item added to cart!");
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Favorite Books</h1>

            {favoriteBooks.length > 0 ? (
                favoriteBooks.map((book) => (
                    <div key={book.id} className="flex flex-col sm:flex-row items-start mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition transform hover:scale-105 hover:shadow-xl">
                        {book.photos && book.photos.length > 0 && (
                            <img src={book.photos[0]} alt={`Book ${book.name}`} className="h-64 w-48 rounded-lg object-cover mb-4 sm:mb-0 sm:mr-6" />
                        )}
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-gray-800">{book.name}</h3>
                                <div className="flex items-center">
                                    {/* Favorite Icon */}
                                    <button onClick={() => handleFavoriteToggle(book.id)} className="text-red-500 mr-4">
                                        <FontAwesomeIcon icon={faHeart} style={{ color: favoriteBookIds.includes(book.id) ? 'red' : 'gray' }} />
                                    </button>
                                    {/* Expand/Collapse Icon */}
                                    <button onClick={() => toggleBookExpansion(book.id)} className="text-gray-500 hover:text-blue-500">
                                        <FontAwesomeIcon icon={expandedBookId === book.id ? faChevronUp : faChevronDown} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="text-lg text-gray-600 mb-2"><strong>Authors:</strong> {book.authors?.map((author) => author.name).join(', ')}</p>
                                <p className="text-lg text-gray-600 mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                                <p className="text-lg text-gray-600 mb-4"><strong>Description:</strong> {book.description}</p>
                                {book.previewPdf && (
                                    <div className="flex items-center space-x-4 mt-4">
                                        <a href={book.previewPdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Preview PDF
                                        </a>
                                        <button onClick={() => copyToClipboard(book.previewPdf)} className="text-gray-500 hover:text-blue-500">
                                            <FontAwesomeIcon icon={faCopy} /> Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>

                            {expandedBookId === book.id && (
                                <div className="mt-6">
                                    <h4 className="text-xl font-semibold mb-4">Copy Details</h4>
                                    {book.copies && book.copies.length > 0 ? (
                                        <table className="w-full table-auto bg-white rounded-lg shadow-md">
                                            <thead className="bg-blue-500 text-white rounded-lg">
                                                <tr>
                                                    <th className="p-4 text-left rounded-tl-lg">Price</th>
                                                    <th className="p-4 text-left">Publication Date</th>
                                                    <th className="p-4 text-left">Language</th>
                                                    <th className="p-4 text-center rounded-tr-lg">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {book.copies.map((copy) => (
                                                    <tr key={copy.id} className="border-b hover:bg-gray-50 transition">
                                                        <td className="p-4">${copy.price}</td>
                                                        <td className="p-4">{new Date(copy.publicationDate).toLocaleDateString()}</td>
                                                        <td className="p-4">{copy.language}</td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => handleAddToCart(copy.id)}
                                                                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition"
                                                            >
                                                                <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-gray-500 mt-2">No copies available for this book.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 mt-6">No favorite books found.</p>
            )}
        </div>
    );
}

export default FavoritesPage;
