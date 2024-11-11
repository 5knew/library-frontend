import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { BookCopyService } from '../../Services/BookCopyService/BookCopyService';
import BookService from '../../Services/BookService/BookService';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function AddBookCopy() {
    const [bookCopy, setBookCopy] = useState({
        bookId: '',
        price: '',
        publicationDate: '',
        language: '',
        fullPdf: null
    });
    const [books, setBooks] = useState([]);

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

    const handleBookSelect = (selectedOption) => {
        setBookCopy({ ...bookCopy, bookId: selectedOption ? selectedOption.value : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bookId', bookCopy.bookId);
        formData.append('price', bookCopy.price);
        formData.append('publicationDate', bookCopy.publicationDate);
        formData.append('language', bookCopy.language);
        if (bookCopy.fullPdf) {
            formData.append('fullPdf', bookCopy.fullPdf);
        }
    
        try {
            await BookCopyService.createBookCopy(formData);
            alert('Book copy added successfully');
            navigate('/book-copies');
        } catch (error) {
            alert('Error adding book copy: ', error);
            console.error('Error adding book copy:', error);
        }
    };

    // Convert books to options for react-select
    const bookOptions = books.map(book => ({
        value: book.id,
        label: book.name
    }));

    return (
        <Card className="max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Add Book Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book">Select a book</Label>
                <Select
                    options={bookOptions}
                    onChange={handleBookSelect}
                    value={bookOptions.find(option => option.value === bookCopy.bookId) || null}
                    placeholder="Search and select a book..."
                    isClearable
                />
              </div>
    
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={bookCopy.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                />
              </div>
    
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  name="publicationDate"
                  value={bookCopy.publicationDate}
                  onChange={handleChange}
                  required
                />
              </div>
    
              <div className="space-y-2">
                <Label htmlFor="language">Language of PDF</Label>
                <Input
                  id="language"
                  type="text"
                  name="language"
                  value={bookCopy.language}
                  onChange={handleChange}
                  placeholder="Language"
                  required
                />
              </div>
    
              <div className="space-y-2">
                <Label htmlFor="fullPdf">Upload full PDF</Label>
                <Input
                  id="fullPdf"
                  type="file"
                  name="fullPdf"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
    
              <Button type="submit" className="w-full">
                Add Book Copy
              </Button>
            </form>
          </CardContent>
        </Card>
    )
}

export default AddBookCopy;
