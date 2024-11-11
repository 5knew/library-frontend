import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faChevronDown, faChevronUp, faCopy, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BookService from '@/Services/BookService/BookService';
import { BookCopyService } from '@/Services/BookCopyService/BookCopyService';
import UserDetailService from '@/Services/UserManagingService/UserDetailService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CartItemService } from '@/Services/CartItemService/CartItemService';


function FavoritesPage() {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [expandedBookId, setExpandedBookId] = useState(null);
    const [favoriteBookIds, setFavoriteBookIds] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFavoriteBookIds(storedUserId);
            fetchFavoriteBooks(storedUserId);
        } else {
            console.error("User ID is missing.");
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

    const fetchFavoriteBooks = async (userId) => {
        try {
            const favoriteBookIds = await UserDetailService.getUserFavorites(userId);
            const booksWithCopies = await Promise.all(favoriteBookIds.map(async (bookId) => {
                const bookData = await BookService.getBookById(bookId);
                const copiesData = await BookCopyService.getCopiesByBookId(bookId) || [];
                return { ...bookData, copies: copiesData };
            }));
            setFavoriteBooks(booksWithCopies);
        } catch (error) {
            console.error("Error fetching favorite books:", error);
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

    const handleAddToCart = async (copyId) => {
      if (!userId) {
          alert("You need to be logged in to add items to the cart.");
          return;
      }
  
      try {
          const cartItemData = {
              userId,  // Use the user's ID
              bookCopyId: copyId,  // Pass the book copy ID instead of the book ID
              quantity: 1  // Default quantity
          };
          
          await CartItemService.createCartItem(cartItemData);
          alert("Item added to cart successfully!");
      } catch (error) {
          console.error("Error adding item to cart:", error);
          alert("Failed to add item to cart. Please try again.");
      }
  };
  

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
          <Label asChild>
            <h1 className="text-5xl font-extrabold text-center my-10">
                My Favorite Books
            </h1>
            </Label>

    
          {favoriteBooks.length > 0 ? (
            favoriteBooks.map((book) => (
              <Card key={book.id} className="mb-6 hover:scale-105 shadow-lg transition transform">
                <div className="flex flex-col sm:flex-row items-start">
                {book.photos && book.photos.length > 0 && (
            <img
                src={book.photos[0]}
                alt={`Book ${book.name}`}
                className="rounded-lg object-cover mb-4 sm:mb-0 sm:mr-6"
                style={{
                width: '12rem',
                height: '16rem',
                border: '2px solid #ccc', // Light gray border to match both themes
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                backgroundColor: '#f8f9fa' // Light background color that works in both modes
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
                            <TooltipContent>
                              {favoriteBookIds.includes(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                            </TooltipContent>
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
                    
                    {book.previewPdf && (
                      <div className="flex items-center mt-4">
                        <a href={book.previewPdf} target="_blank" rel="noopener noreferrer">
                          Preview PDF
                        </a>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={() => copyToClipboard(book.previewPdf)} variant="link">
                                <FontAwesomeIcon icon={faCopy} /> Copy Link
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy PDF Link</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
    
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
            <p>No favorite books found.</p>
          )}
        </div>
      );
    }
    
    export default FavoritesPage;