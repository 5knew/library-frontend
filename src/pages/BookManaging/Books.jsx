import React, { useState, useEffect } from 'react';
import BookService from '../../Services/BookService/BookService';
import AdvancedSearch from '../../components/AdvancedSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faTrashAlt, faEdit, faCopy } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from 'jwt-decode';

function Books() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
        fetchAllBooks();
    }, []);
    
    const fetchAllBooks = async () => {
        try {
            const booksData = await BookService.getAllBooks();
            setBooks(booksData || []);
            setIsEmpty((booksData || []).length === 0);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleBasicSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            fetchAllBooks();
            return;
        }

        try {
            const booksData = await BookService.searchBooks(query);
            setBooks(booksData || []);
            setIsEmpty((booksData || []).length === 0);
        } catch (error) {
            console.error("Error searching books:", error);
            setIsEmpty(true);
        }
    };

    const handleAdvancedSearch = async (filters) => {
    try {
        const booksData = await BookService.advancedSearch(filters);
        setBooks(booksData || []);
        setIsEmpty((booksData || []).length === 0);
    } catch (error) {
        console.error("Error performing advanced search:", error);
        setIsEmpty(true);
    }
};

    

    
    
    

    const handleDeleteBook = async (bookId) => {
        try {
            await BookService.deleteBook(bookId);
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };
    

    const handleEditBook = (bookId) => {
        navigate(`/update-book/${bookId}`);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Books</h1>

            {/* Basic Search */}
            <form onSubmit={handleBasicSearch} className="flex mb-6 max-w-md mx-auto">
                <input
                    className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Search books..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="p-3 px-5 bg-blue-500 text-white font-semibold rounded-r-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150">
                    Search
                </button>
            </form>

            {/* Toggle Advanced Search */}
            <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="block mb-6 mx-auto py-2 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-150"
            >
                {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
            </button>

            {/* Conditionally Render Advanced Search */}
            {showAdvancedSearch && <AdvancedSearch onSearch={handleAdvancedSearch} />}

            {/* Display "Nothing found" if search results are empty */}
            {isEmpty ? (
                <p className="text-center text-gray-500 mt-6">Nothing found</p>
            ) : (
                <div className="space-y-8">
                    {books.map((book) => (
                        <div key={book.id} className="flex p-6 shadow-lg rounded-lg bg-white border border-gray-200 transition transform hover:scale-105 hover:shadow-xl duration-150">
                            {book.photos && book.photos.length > 0 && (
                                <img src={book.photos[0]} alt={`Book ${book.name}`} className="h-64 w-48 rounded-md object-cover mr-8" />
                            )}
                            <div className="flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-3xl font-semibold text-gray-800 mb-4">{book.name}</h3>
                                    {book.authors && book.authors.length > 0 && (
                                        <p className="text-lg text-gray-600 mb-2">
                                            <strong>Authors:</strong> {book.authors.map((author, index) => (
                                                <span key={index}>{author.name}{index < book.authors.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </p>
                                    )}
                                    {book.categories && book.categories.length > 0 && (
                                        <p className="text-lg text-gray-600 mb-2">
                                            <strong>Categories:</strong> {book.categories.map((category, index) => (
                                                <span key={index}>{category.name}{index < book.categories.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </p>
                                    )}
                                    {book.description && (
                                        <p className="text-lg text-gray-600 mb-2">
                                            <strong>Description:</strong> <span className="line-clamp-3">{book.description}</span>
                                        </p>
                                    )}
                                    {book.isbn && (
                                        <p className="text-lg text-gray-600 mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                                    )}
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

                                {userRole === 'ROLE_LIBRARIAN' && (
                                    <div className="flex items-center space-x-4 mt-4">
                                        <span onClick={() => handleEditBook(book.id)} className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-150">
                                            <FontAwesomeIcon icon={faEdit} size="lg" />
                                        </span>
                                        <span onClick={() => handleDeleteBook(book.id)} className="cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-150">
                                            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Books;
