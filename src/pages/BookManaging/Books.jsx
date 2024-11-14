// Books.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import BookService from '../../Services/BookService/BookService'
import AdvancedSearch from '../../components/AdvancedSearch'
import CategoryService from '@/Services/CategoryService/CategoryService'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function Books() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [userRole, setUserRole] = useState('')

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
        fetchAllBooks(page); // Fetch books with pagination
        fetchCategories();
    }, [page]);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchAllBooks = async (page) => {
        try {
            const response = await BookService.getAllBooks(page, 10); // Pass page and size
            setBooks(response.content || []);
            setTotalPages(response.totalPages || 0);
            setIsEmpty(response.content?.length === 0);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleCategoryChange = async (value) => {
        setSelectedCategory(value);
        if (value === 'all') {
            fetchAllBooks(0); // Reset to the first page
        } else {
            try {
                const booksData = await BookService.getBooksByCategoryId(value);
                setBooks(booksData || []);
            } catch (error) {
                console.error("Error filtering books by category:", error);
            }
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
            setBooks(Array.isArray(booksData) ? booksData : []); // Ensure booksData is an array
            setIsEmpty((booksData || []).length === 0);
        } catch (error) {
            console.error("Error searching books:", error);
            setBooks([]); // Fallback to empty array on error
            setIsEmpty(true);
        }
    };
    const handleAdvancedSearch = async (filters) => {
        if (!filters || Object.keys(filters).length === 0) {
            fetchAllBooks(); // Fetch all books if filters are empty
            return;
        }
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
            await BookService.deleteBook(bookId)
            setBooks(books.filter(book => book.id !== bookId))
            toast({
                title: "Book deleted",
                description: "The book has been successfully deleted.",
            })
        } catch (error) {
            console.error("Error deleting book:", error)
            toast({
                title: "Error",
                description: "Failed to delete the book. Please try again.",
                variant: "destructive",
            })
        }
    };

    const handleEditBook = (bookId) => {
        navigate(`/update-book/${bookId}`)
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
        toast({
            title: "Link copied",
            description: "The link has been copied to your clipboard.",
        })
    }

    // const handleCategoryChange = async (value) => {
    //     setSelectedCategory(value);
    //     if (value === 'all') {
    //         fetchAllBooks();
    //     } else {
    //         try {
    //             const booksData = await BookService.getBooksByCategoryId(value);
    //             setBooks(booksData || []);
    //         } catch (error) {
    //             console.error("Error filtering books by category:", error);
    //         }
    //     }
    // };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Label className='text-5xl'>Books</Label>
            <div className="flex justify-between items-center">
                <form onSubmit={handleBasicSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search books..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button>Search</Button>
                </form>
                <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                variant="outline"
            >
                {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
            </Button>

            {showAdvancedSearch && <AdvancedSearch onSearch={handleAdvancedSearch} />}

            {isEmpty ? (
                <p className="text-center text-muted-foreground mt-6">Nothing found</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>
                                    <div className="flex items-center">
                                        {book.photos && book.photos.length > 0 && (
                                            <img 
                                                src={book.photos[0]} 
                                                alt={`Book ${book.name}`} 
                                                className="h-16 w-12 rounded-md object-cover mr-4"
                                            />
                                        )}
                                        <span>{book.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{book.name}</TableCell>
                                <TableCell>{book.description}</TableCell>
                                <TableCell>{book.authors?.map(author => author.name).join(', ')}</TableCell>
                                <TableCell>{book.categories?.map(category => category.name).join(', ')}</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleEditBook(book.id)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <div className="flex justify-center items-center space-x-2 mt-6">
                <Button variant="outline" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>Page {page + 1} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default Books;
