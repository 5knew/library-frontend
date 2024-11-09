import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import BookService from '../../Services/BookService/BookService';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBookCopy = () => {
    const [bookCopy, setBookCopy] = useState({
        book: '',
        price: '',
        publicationDate: '',
        language: '',
        fullPdf: null,
    });
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const { bookCopyId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookCopy();
        fetchBooks();
    }, [bookCopyId]);

    const fetchBookCopy = async () => {
        try {
            const response = await BookCopyService.getBookCopyById(bookCopyId);
            setBookCopy({
                ...response,
                book: response.book.id,
            });
        } catch (error) {
            console.error('Error fetching book copy:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            const booksData = await BookService.getAllBooks();
            setBooks(booksData);
            setFilteredBooks(booksData);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleBookSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredBooks(books.filter(book => book.name.toLowerCase().includes(searchTerm)));
    };

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
        formData.append('bookId', bookCopy.book);  // 'book' should hold the book ID
        formData.append('price', bookCopy.price);
        formData.append('publicationDate', bookCopy.publicationDate);  // Should be in 'yyyy-MM-dd' format
        formData.append('language', bookCopy.language);
        if (bookCopy.fullPdf) formData.append('fullPdf', bookCopy.fullPdf);  // file field
    
        try {
            await BookCopyService.updateBookCopy(bookCopyId, formData);
            alert('Book copy updated successfully');
            navigate('/book-copies');
        } catch (error) {
            console.error('Error updating book copy:', error);
        }
    };
    

    return (
        <div className="max-w-lg mx-auto my-10 p-8 shadow-lg border border-gray-200 rounded-lg bg-white">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Update Book Copy</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                Search for a Book
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Search Book"
                    onChange={handleBookSearch}
                />
                <select
                    className="w-full p-3 border border-gray-300 rounded-md"
                    name="book"
                    value={bookCopy.book}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Book</option>
                    {filteredBooks.map(book => (
                        <option key={book.id} value={book.id}>
                            {book.name}
                        </option>
                    ))}
                </select>
                Price
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="number"
                    name="price"
                    value={bookCopy.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                Publication Date
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="date"
                    name="publicationDate"
                    value={bookCopy.publicationDate}
                    onChange={handleChange}
                    placeholder="Publication Date"
                    required
                />
                Language of pdf
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    name="language"
                    value={bookCopy.language}
                    onChange={handleChange}
                    placeholder="Language"
                    required
                />
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="fullPdf"
                    onChange={handleFileChange}
                    placeholder="Upload PDF"
                />
                Upload full of pdf
                <button
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    type="submit"
                >
                    Update Book Copy
                </button>
            </form>
        </div>
    );
};

export default UpdateBookCopy;
