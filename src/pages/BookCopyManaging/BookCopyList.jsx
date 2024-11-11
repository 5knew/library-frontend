import React, { useState, useEffect } from 'react';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import { useNavigate } from 'react-router-dom';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";


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
    const [userRole, setUserRole] = useState('')

    useEffect(() => {
        fetchAllBookCopies();
        role = localStorage.getItem('userRole');
        if(role){
            setUserRole(role);
        }
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
                <Input 
                    type="number" 
                    placeholder="Min Price" 
                    value={searchParams.minPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })} 
                />
                <Input 
                    type="number" 
                    placeholder="Max Price" 
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })} 
                />
                <Input 
                    type="text" 
                    placeholder="Language" 
                    value={searchParams.language}
                    onChange={(e) => setSearchParams({ ...searchParams, language: e.target.value })} 
                />
                <Input 
                    type="date" 
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })} 
                />
                <Input 
                    type="date" 
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })} 
                />
                <Button onClick={handleSearch} className=" transition duration-150">
                    Search
                </Button>
            </div>
            
            {/* BookCopy Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg shadow-md border">
                    <thead className="">
                        <tr>
                            <th className="p-4 text-left font-semibold">Book</th>
                            <th className="p-4 text-left font-semibold">Price</th>
                            <th className="p-4 text-left font-semibold">Publication Date</th>
                            <th className="p-4 text-left font-semibold">Language</th>
                            <th className="p-4 text-left font-semibold">Full PDF</th>
                            <th className="p-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <TableBody className="border">
                        {bookCopies.length > 0 ? bookCopies.map((copy) => (
                            <TableRow key={copy.id} className="border-b hover:bg-gray-100 transition">
                                <TableCell className="p-4">{copy.book?.name || 'N/A'}</TableCell>
                                <TableCell className="p-4">{copy.price} tg</TableCell>
                                <TableCell className="p-4">{new Date(copy.publicationDate).toLocaleDateString()}</TableCell>
                                <TableCell className="p-4">{copy.language || 'N/A'}</TableCell>
                                <TableCell className="p-4">
                                    {copy.fullPdf ? (
                                        <a href={copy.fullPdf} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View PDF
                                        </a>
                                    ) : 'N/A'}
                                </TableCell>
                                <TableCell className="p-4 flex justify-center gap-3">
                                    <Button 
                                        onClick={() => navigate(`/update-book-copy/${copy.id}`)}
                                        className=" flex items-center gap-1"
                                    >
                                        <FaEdit /> Edit
                                    </Button>
                                    <Button 
                                        onClick={() => handleDelete(copy.id)}
                                        className="bg-red-500 hover:bg-red-600 flex items-center gap-1"
                                    >
                                        <FaTrashAlt /> Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan="6" className="p-4 text-center text-gray-500">
                                    No book copies found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}

export default BookCopyList;