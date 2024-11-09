import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import { useParams, useNavigate } from 'react-router-dom';

function BookCopyDetail() {
    const { id } = useParams();
    const [bookCopy, setBookCopy] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        BookCopyService.getBookCopyById(id)
            .then(setBookCopy)
            .catch(error => console.error("Error loading book copy:", error));
    }, [id]);

    const handleDelete = async () => {
        try {
            await BookCopyService.deleteBookCopy(id);
            navigate('/book-copies');
        } catch (error) {
            console.error("Error deleting book copy:", error);
        }
    };

    return bookCopy ? (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-6">{bookCopy.book?.name} - Book Copy Details</h1>
            
            
            <p><strong>Language:</strong> {bookCopy.language}</p>
            <p><strong>Publication Date:</strong> {new Date(bookCopy.publicationDate).toLocaleDateString()}</p>
            <p><strong>Price:</strong> ${bookCopy.price}</p>
            
            {bookCopy.fullPdf && (
                <p>
                    <strong>Full PDF:</strong> <a href={bookCopy.fullPdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>
                </p>
            )}

            <div className="mt-4">
                <button 
                    onClick={() => navigate(`/book-copies/${id}/edit`)} 
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Edit
                </button>
                <button 
                    onClick={handleDelete} 
                    className="bg-red-500 text-white p-2 rounded ml-2"
                >
                    Delete
                </button>
            </div>
        </div>
    ) : (
        <p>Loading book copy...</p>
    );
}

export default BookCopyDetail;
