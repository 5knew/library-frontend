import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import BookService from '../../Services/BookService/BookService';
import AuthorService from '../../Services/AuthorService/AuthorService';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import customSelectStyles from '@/components/ui/customSelectStyles';

function AddBook() {
    const [book, setBook] = useState({
        name: '',
        description: '',
        isbn: '',
        previewPdf: null,
        fullPdf: null,
        image: null,
    });

    const [authorsOptions, setAuthorsOptions] = useState([]);
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchAuthors();
        fetchCategories();
    }, []);

    const fetchAuthors = async () => {
        try {
            const authorsData = await AuthorService.getAllAuthors();
            setAuthorsOptions(authorsData.map(author => ({ value: author.id, label: author.name })));
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategoriesOptions(categoriesData.map(category => ({ value: category.id, label: category.name })));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setBook({ ...book, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!book.image) {
            alert("Please upload an image for the book.");
            return;
        }

        const formData = new FormData();
        formData.append('name', book.name);
        formData.append('description', book.description);
        formData.append('isbn', book.isbn);
        selectedAuthors.forEach(author => formData.append('authorIds', author.value));
        selectedCategories.forEach(category => formData.append('categoryIds', category.value));
        if (book.fullPdf) formData.append('fullPdfFile', book.fullPdf);
        if (book.previewPdf) formData.append('previewPdfFile', book.previewPdf);
        formData.append('imageFile', book.image);

        try {
            await BookService.createBook(formData);
            alert('Book added successfully');
            navigate('/');
        } catch (error) {
            console.error("Error adding book:", error);
            setError('Failed to add the book. Please try again.');
        }
    };

    return (
        <Card className="container max-w-lg mx-auto my-10 shadow-lg border rounded-lg">
            <CardHeader>
                <CardTitle>Add New Book</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <Label>Book Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={book.name}
                        onChange={handleChange}
                        placeholder="Book Name"
                        required
                    />

                    <Label>Description</Label>
                    <Textarea
                        name="description"
                        value={book.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    />

                    <Label>ISBN</Label>
                    <Input
                        type="text"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleChange}
                        placeholder="ISBN"
                        required
                    />

                    <Label>Search Category in a list</Label>
                    <Select
                        isMulti
                        options={categoriesOptions}
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        placeholder="Select Categories"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customSelectStyles}
                    />

                    <Label>Search Author in a list</Label>
                    <Select
                        isMulti
                        options={authorsOptions}
                        value={selectedAuthors}
                        onChange={setSelectedAuthors}
                        placeholder="Select Authors"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customSelectStyles}
                    />

                    <Label>Upload Preview Pdf</Label>
                    <Input type="file" name="previewPdf" onChange={handleFileChange} />

                    <Label>Upload Full Pdf</Label>
                    <Input type="file" name="fullPdf" onChange={handleFileChange} />

                    <Label>Upload Image</Label>
                    <Input type="file" name="image" onChange={handleFileChange} required />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Add Book
                    </Button>
                </CardFooter>
            </form>
            {error && <div className="text-center text-red-500 font-medium mt-4">{error}</div>}
        </Card>
    );
}

export default AddBook;
