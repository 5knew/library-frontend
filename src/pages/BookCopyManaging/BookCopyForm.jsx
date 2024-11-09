import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import BookService from '../../Services/BookService/BookService';
import { useParams, useNavigate } from 'react-router-dom';

function BookCopyForm() {
    const { id } = useParams();
    const [bookCopy, setBookCopy] = useState({
        book: '',
        price: '',
        publicationDate: '',
        language: '',
        fullPdf: null
    });
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            BookCopyService.getBookCopyById(id).then((data) => {
                setBookCopy({
                    ...data,
                    publicationDate: data.publicationDate ? data.publicationDate.split('T')[0] : ''
                });
            });
        }
        BookService.getAllBooks().then(setBooks);
    }, [id]);

    const handleFileChange = (e) => {
        setBookCopy({ ...bookCopy, fullPdf: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('bookId', bookCopy.book);
        formData.append('price', bookCopy.price);
        formData.append('publicationDate', bookCopy.publicationDate);
        formData.append('language', bookCopy.language);
        if (bookCopy.fullPdf) formData.append('fullPdf', bookCopy.fullPdf);

        if (id) {
            await BookCopyService.updateBookCopy(id, formData);
        } else {
            await BookCopyService.createBookCopy(formData);
        }
        navigate('/book-copies');
    };

    const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                {id ? 'Edit Book Copy' : 'Add New Book Copy'}
            </h2>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a book..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={bookCopy.book}
                    onChange={(e) => setBookCopy({ ...bookCopy, book: e.target.value })}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none"
                    required
                >
                    <option value="">Select Book</option>
                    {filteredBooks.map(book => (
                        <option key={book.id} value={book.id}>
                            {book.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                type="number"
                placeholder="Price"
                value={bookCopy.price}
                onChange={(e) => setBookCopy({ ...bookCopy, price: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="date"
                placeholder="Publication Date"
                value={bookCopy.publicationDate}
                onChange={(e) => setBookCopy({ ...bookCopy, publicationDate: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="Language"
                value={bookCopy.language}
                onChange={(e) => setBookCopy({ ...bookCopy, language: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Save
            </button>
        </form>
    );
}

export default BookCopyForm;
