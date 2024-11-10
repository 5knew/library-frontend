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
import { Pencil, Trash2, Copy } from 'lucide-react';

function Books() {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([]); // State for categories
    const [query, setQuery] = useState('')
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const navigate = useNavigate()
    const [userRole, setUserRole] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    // ... (keep existing useEffect, fetchAllBooks, handleBasicSearch, handleAdvancedSearch)
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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []); // Ensure categoriesData is an array
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
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

    const handleCategoryChange = async (value) => {
        setSelectedCategory(value);
        if (value === 'all') {
            fetchAllBooks();
        } else {
            try {
                const booksData = await BookService.getBooksByCategoryId(value);
                setBooks(booksData || []);
            } catch (error) {
                console.error("Error filtering books by category:", error);
            }
        }
    };




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
                
                {/* Category Filter */}
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
                                    <div className="flex items-center space-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditBook(book.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Book</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                                    <Button variant="destructive" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        {book.previewPdf && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(book.previewPdf)}>
                                                            <Copy className="h-4 w-4" /> Preview PDF
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy Preview Link</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {book.fullPdf && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(book.fullPdf)}>
                                                            <Copy className="h-4 w-4" /> Full PDF
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy Full PDF Link</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default Books;