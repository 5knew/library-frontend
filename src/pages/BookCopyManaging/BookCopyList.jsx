import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import { useNavigate } from 'react-router-dom';

function BookCopyList() {
    const [bookCopies, setBookCopies] = useState([]);
    const [searchParams, setSearchParams] = useState({
        minPrice: '',
        maxPrice: '',
        language: '',
        startDate: '',
        endDate: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllBookCopies();
    }, []);

    const fetchAllBookCopies = async () => {
        const data = await BookCopyService.getAllBookCopies();
        setBookCopies(data || []);
    };

    const handleSearch = async () => {
        const params = {
            minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
            maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
            startDate: searchParams.startDate ? new Date(searchParams.startDate) : undefined,
            endDate: searchParams.endDate ? new Date(searchParams.endDate) : undefined,
        };

        try {
            const data = await BookCopyService.searchBookCopies(params);
            setBookCopies(data || []);
        } catch (error) {
            console.error("Error during book copy search:", error);
        }
    };

    const handleDelete = async (id) => {
        await BookCopyService.deleteBookCopy(id);
        fetchAllBookCopies();
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Book Copies</h1>
            
            {/* Search Filters */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
                <input 
                    type="number" 
                    placeholder="Min Price" 
                    value={searchParams.minPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })} 
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="number" 
                    placeholder="Max Price" 
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })} 
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text" 
                    placeholder="Language" 
                    value={searchParams.language}
                    onChange={(e) => setSearchParams({ ...searchParams, language: e.target.value })} 
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="date" 
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })} 
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="date" 
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })} 
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button 
                    onClick={handleSearch} 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none transition duration-150"
                >
                    Search
                </button>
            </div>
            
            {/* BookCopy Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-4 text-left font-semibold">Book</th>
                            <th className="p-4 text-left font-semibold">Price</th>
                            <th className="p-4 text-left font-semibold">Publication Date</th>
                            <th className="p-4 text-left font-semibold">Language</th>
                            <th className="p-4 text-left font-semibold">Full PDF</th>
                            <th className="p-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookCopies.length > 0 ? bookCopies.map((copy) => (
                            <tr key={copy.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-4">{copy.book?.name || 'N/A'}</td>
                                <td className="p-4">${copy.price}</td>
                                <td className="p-4">{new Date(copy.publicationDate).toLocaleDateString()}</td>
                                <td className="p-4">{copy.language || 'N/A'}</td>
                                <td className="p-4">
                                    {copy.fullPdf ? (
                                        <a href={copy.fullPdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            View PDF
                                        </a>
                                    ) : 'N/A'}
                                </td>
                                <td className="p-4 flex justify-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/update-book-copy/${copy.id}`)}
                                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                                    >
                                        Edit
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(copy.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No book copies found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookCopyList;
