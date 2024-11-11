import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChevronDown, faChevronUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import UserDetailService from '@/Services/UserManagingService/UserDetailService';
import BookService from '@/Services/BookService/BookService';
import { BookCopyService } from '@/Services/BookCopyService/BookCopyService';
import AdvancedSearchBookWithCopies from '@/components/AdvancedSearchBookWithCopies';
import { CartItemService } from '@/Services/CartItemService/CartItemService';

import { FaHeart, FaChevronDown, FaChevronUp, FaCartPlus } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

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
            const booksData = await BookService.getAllBooks();
            const bookCopiesData = await BookCopyService.getAllBookCopies();
            console.log('booksData: ', booksData);
            console.log('bookCopiesData: ', bookCopiesData);
            
            const booksArray = Array.isArray(booksData) ? booksData : [];
            const copiesArray = Array.isArray(bookCopiesData) ? bookCopiesData : [];

            console.log('Books array: ', booksArray);
            console.log('Books Instances array: ', copiesArray);
            
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
                userId,
                bookCopyId: copyId,
                quantity: 1
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
                // "OR" Logic: Include books even if no copies match and vice versa
                booksWithCopies = booksData.map((book) => ({
                    ...book,
                    copies: bookCopiesData.filter((copy) => copy.book?.id === book.id)
                }));
    
                // Include additional book copies without matching books
                const bookIds = new Set(booksWithCopies.map((book) => book.id));
                const additionalCopies = bookCopiesData
                    .filter((copy) => !bookIds.has(copy.book?.id))
                    .map((copy) => ({
                        ...copy.book,
                        copies: [copy]
                    }));
                
                // Merge all results
                booksWithCopies = [...booksWithCopies, ...additionalCopies];
                
            } else {
                // "AND" Logic: Only include books with matching copies
                booksWithCopies = booksData.map((book) => {
                    const matchingCopies = bookCopiesData.filter((copy) => copy.book?.id === book.id);
                    return matchingCopies.length > 0 ? { ...book, copies: matchingCopies } : null;
                }).filter(Boolean); // Remove null entries for books without matching copies
                
            }
    
            // Log for debugging purposes
            console.log("Books with copies after search:", booksWithCopies);
    
            setBooks(booksWithCopies);
        } catch (error) {
            console.error("Error performing advanced search:", error);
        }
    };
    
    

    return (
        <div className="container mx-auto p-6 max-w-5xl">
          <Label asChild>
            <h1 className="text-xl font-extrabold text-center my-10">Books and its Instances</h1>
          </Label>
          <AdvancedSearchBookWithCopies onSearch={handleAdvancedSearch} />
          
          {books.length > 0 ? (
            books.map((book) => (
              <Card key={book.id} className="mb-6 shadow-lg transition">
                <div className="flex flex-col sm:flex-row items-start">
                  {book.photos && book.photos.length > 0 && (
                    <img
                      src={book.photos[0]}
                      alt={`Book ${book.name}`}
                      className="rounded-lg object-cover mb-4 sm:mb-0 sm:mr-6"
                      style={{
                        width: '12rem',
                        height: '16rem',
                        border: '2px solid #ccc',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                  )}

                  <CardContent className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <CardHeader>
                        <CardTitle>{book.name}</CardTitle>
                      </CardHeader>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={() => handleFavoriteToggle(book.id)} variant="link">
                                <FontAwesomeIcon icon={faHeart} color={favoriteBookIds.includes(book.id) ? 'red' : 'gray'} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{favoriteBookIds.includes(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button onClick={() => toggleBookExpansion(book.id)} variant="link">
                          <FontAwesomeIcon icon={expandedBookId === book.id ? faChevronUp : faChevronDown} />
                        </Button>
                      </div>
                    </div>
    
                    <p><strong>Authors:</strong> {book.authors?.map((author) => author.name).join(', ')}</p>
                    <p><strong>Categories:</strong> {book.categories?.map((category) => category.name).join(', ')}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    
                    {expandedBookId === book.id && (
                      <div className="mt-6">
                        <h4>BookInstance Details</h4>
                        {book.copies && book.copies.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Publication Date</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {book.copies.map((copy) => (
                                <TableRow key={copy.id}>
                                  <TableCell>{new Date(copy.publicationDate).toLocaleDateString()}</TableCell>
                                  <TableCell>{copy.language}</TableCell>
                                  <TableCell>{copy.price} tg</TableCell>
                                  <TableCell>
                                    <Button variant="outline" onClick={() => handleAddToCart(copy.id)}>
                                      <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p>No copies available for this book.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </div>
    );
}

export default BooksWithCopies;