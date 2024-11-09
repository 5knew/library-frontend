import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import BookService from '../../Services/BookService/BookService';

function AddBookCopy() {
    const [bookCopy, setBookCopy] = useState({
        bookId: '',
        price: '',
        publicationDate: '',
        language: '',
        fullPdf: null
    });
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchBooks() {
            try {
                const bookList = await BookService.getAllBooks();
                setBooks(bookList);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookCopy({ ...bookCopy, [name]: value });
    };

    const handleFileChange = (e) => {
        setBookCopy({ ...bookCopy, fullPdf: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bookId', bookCopy.bookId);  // Correctly add bookId here
        formData.append('price', bookCopy.price);
        formData.append('publicationDate', bookCopy.publicationDate);
        formData.append('language', bookCopy.language);
        if (bookCopy.fullPdf) {
            formData.append('fullPdf', bookCopy.fullPdf);  // Use 'fullPdf' as key
        }
    
        try {
            await BookCopyService.createBookCopy(formData);
            alert('Book copy added successfully');
        } catch (error) {
            console.error('Error adding book copy:', error);
        }
    };
    

    // Filter books based on search term
    const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Book Copy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Searchable Dropdown */}
                Search for a book
                <div className="relative">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search for a book..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                
                    <select
                        name="bookId"
                        value={bookCopy.bookId}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none"
                    >
                        <option value="">Select Book</option>
                        {filteredBooks.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.name}
                            </option>
                        ))}
                    </select>
                </div>
                Price
                <input
                    type="number"
                    name="price"
                    value={bookCopy.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                Publication Date
                <input
                    type="date"
                    name="publicationDate"
                    value={bookCopy.publicationDate}
                    onChange={handleChange}
                    placeholder="Publication Date"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                Language of pdf
                <input
                    type="text"
                    name="language"
                    value={bookCopy.language}
                    onChange={handleChange}
                    placeholder="Language"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* File Upload for Full PDF */}
                <input
                    type="file"
                    name="fullPdf"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                Upload full of Pdf

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Add Book Copy
                </button>
            </form>
        </div>
    );
}

export default AddBookCopy;
