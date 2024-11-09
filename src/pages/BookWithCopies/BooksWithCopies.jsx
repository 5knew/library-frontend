import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChevronDown, faChevronUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import UserDetailService from '@/Services/UserManagingService/UserDetailService';
import BookService from '@/Services/BookService/BookService';
import { BookCopyService } from '@/Services/BookCopyService/BookCopyService';
import AdvancedSearchBookWithCopies from '@/components/AdvancedSearchBookWithCopies';
import { CartItemService } from '@/Services/CartItemService/CartItemService';

function BooksWithCopies() {
    const [books, setBooks] = useState([]);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [favoriteBookIds, setFavoriteBookIds] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFavoriteBookIds(storedUserId);
            fetchBooksAndCopies();
        } else {
            console.error("UserId is missing in localStorage.");
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

    const fetchBooksAndCopies = async () => {
        try {
            // Fetch all books and book copies
            const booksData = await BookService.getAllBooks();
            const bookCopiesData = await BookCopyService.getAllBookCopies();
    
            // Ensure booksData and bookCopiesData are arrays
            const booksArray = Array.isArray(booksData) ? booksData : [];
            const copiesArray = Array.isArray(bookCopiesData) ? bookCopiesData : [];
    
            if (!Array.isArray(booksData)) {
                console.error("Error: booksData is not an array:", booksData);
            }
    
            if (!Array.isArray(bookCopiesData)) {
                console.error("Error: bookCopiesData is not an array:", bookCopiesData);
            }
    
            // Map books with their respective copies
            const booksWithCopies = booksArray.map((book) => ({
                ...book,
                copies: copiesArray.filter((copy) => copy.book?.id === book.id),
            }));
    
            setBooks(booksWithCopies);
        } catch (error) {
            console.error("Error fetching books or book copies:", error);
        }
    };

    const handleAddToCart = async (copyId) => {
        if (!userId) {
            alert("You need to be logged in to add items to the cart.");
            return;
        }
        
        try {
            const cartItemData = {
                userId,  // From the state, set when the component loads
                bookCopyId: copyId,  // Passed in when the button is clicked
                quantity: 1  // Default quantity, can be adjusted if needed
            };
            
            await CartItemService.createCartItem(cartItemData);
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            alert("Failed to add item to cart. Please try again.");
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

    const handleAdvancedSearch = async (filters, isAndSearch = true) => {
        try {
            const booksData = await BookService.advancedSearch(filters);
            const bookCopiesData = await BookCopyService.searchBookCopies(filters);
    
            let booksWithCopies;
    
            if (isAndSearch) {
                // "AND" Logic: Only include books with matching copies
                booksWithCopies = booksData.map(book => {
                    const matchingCopies = bookCopiesData.filter(copy => copy.book?.id === book.id);
                    return matchingCopies.length > 0 ? { ...book, copies: matchingCopies } : null;
                }).filter(Boolean); // Remove null entries for books with no matching copies
            } else {
                // "OR" Logic: Include books even if no copies match, and vice versa
                booksWithCopies = booksData.map(book => ({
                    ...book,
                    copies: bookCopiesData.filter(copy => copy.book?.id === book.id)
                }));
    
                // Add copies without matching books if not already included
                const booksWithIds = new Set(booksWithCopies.map(book => book.id));
                const additionalCopies = bookCopiesData
                    .filter(copy => !booksWithIds.has(copy.book?.id))
                    .map(copy => ({
                        ...copy.book,
                        copies: [copy],
                    }));
                
                booksWithCopies = [...booksWithCopies, ...additionalCopies];
            }
    
            setBooks(booksWithCopies);
        } catch (error) {
            console.error("Error performing advanced search:", error);
        }
    };
    

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Books and Their Copies</h1>

            {/* Advanced Search Form */}
            <AdvancedSearchBookWithCopies onSearch={handleAdvancedSearch} />

            {books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className="mb-6 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
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

                        {/* Book Details */}
                        <div className="flex mt-4">
                            <div>
                            {book.categories && book.categories.length > 0 && (
                                        <p className="text-lg text-gray-600 mb-2">
                                            <strong>Categories:</strong> {book.categories.map((category, index) => (
                                                <span key={index}>{category.name}{index < book.categories.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </p>
                                    )}
                                <p className="text-lg text-gray-600 mb-2"><strong>Authors:</strong> {book.authors?.map(author => author.name).join(', ')}</p>
                                <p className="text-lg text-gray-600 mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                                <p className="text-lg text-gray-600 mb-4"><strong>Description:</strong> {book.description}</p>
                            </div>
                        </div>

                        {/* Book Copies */}
                        {expandedBookId === book.id && (
                            <div className="mt-4">
                                <h4 className="text-xl font-semibold mb-2">Copies</h4>
                                {book.copies.length > 0 ? (
                                    <table className="w-full table-auto bg-white rounded-lg shadow-md">
                                        <thead className="bg-blue-500 text-white">
                                            <tr>
                                                <th className="p-4 text-left">Price</th>
                                                <th className="p-4 text-left">Publication Date</th>
                                                <th className="p-4 text-left">Language</th>
                                                <th className="p-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {book.copies.map(copy => (
                                                <tr key={copy.id} className="border-b hover:bg-gray-100">
                                                    <td className="p-4">${copy.price}</td>
                                                    <td className="p-4">{new Date(copy.publicationDate).toLocaleDateString()}</td>
                                                    <td className="p-4">{copy.language}</td>
                                                    <td className="p-4 text-center">
                                                        <button onClick={() => handleAddToCart(copy.id)} className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600">
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
                ))
            ) : (
                <p className="text-center text-gray-500 mt-6">No books found.</p>
            )}
        </div>
    );
}

export default BooksWithCopies;
