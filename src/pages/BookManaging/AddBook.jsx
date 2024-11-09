import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import BookService from '../../Services/BookService/BookService';
import AuthorService from '../../Services/AuthorService/AuthorService';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { useNavigate } from 'react-router-dom';

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
        <div className="max-w-lg mx-auto my-10 p-8 shadow-xl border border-gray-200 rounded-lg bg-white">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Add New Book</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                Book Name
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    name="name"
                    value={book.name}
                    onChange={handleChange}
                    placeholder="Book Name"
                    required
                />
                Description
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    name="description"
                    value={book.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                ISBN
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    placeholder="ISBN"
                    required
                />

                {/* Select Categories with react-select */}
                Search Category in a list
                <Select
                    isMulti
                    options={categoriesOptions}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    placeholder="Select Categories"
                    className="basic-multi-select"
                    classNamePrefix="select"
                />

                {/* Select Authors with react-select */}
                Search Author in a list
                <Select
                    isMulti
                    options={authorsOptions}
                    value={selectedAuthors}
                    onChange={setSelectedAuthors}
                    placeholder="Select Authors"
                    className="basic-multi-select"
                    classNamePrefix="select"
                />

                {/* File Uploads */}
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="previewPdf"
                    onChange={handleFileChange}
                />
                Upload Preview Pdf
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="fullPdf"
                    onChange={handleFileChange}
                />
                Upload Full Pdf
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    required
                />
                Upload Image

                <button
                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    type="submit"
                >
                    Add Book
                </button>
            </form>

            {error && (
                <div className="mt-4 text-center text-red-500 font-medium">
                    {error}
                </div>
            )}
        </div>
    );
}

export default AddBook;
