import React, { useState, useEffect } from 'react';
import BookService from '../../Services/BookService/BookService';
import AuthorService from '../../Services/AuthorService/AuthorService';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateBook() {
    const [book, setBook] = useState({
        name: '',
        description: '',
        isbn: '',
        category: '',
    });
    const [allAuthors, setAllAuthors] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [previewPdf, setPreviewPdf] = useState(null);
    const [fullPdf, setFullPdf] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { bookId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllAuthors();
        fetchAllCategories();
        fetchBookDetails();
    }, [bookId]);

    const fetchAllAuthors = async () => {
        try {
            const authorsData = await AuthorService.getAllAuthors();
            setAllAuthors(authorsData);
            setFilteredAuthors(authorsData);
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setAllCategories(categoriesData);
            setFilteredCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchBookDetails = async () => {
        try {
            const fetchedBook = await BookService.getBookById(bookId);
            
            // Убедимся, что fetchedBook содержит ожидаемые данные
            if (fetchedBook) {
                setBook({
                    name: fetchedBook.name || '',
                    description: fetchedBook.description || '',
                    isbn: fetchedBook.isbn || '',
                    category: fetchedBook.category?.id || '',
                });

                setSelectedAuthors(fetchedBook.authors.map(author => author.id));
                setSelectedCategories(fetchedBook.categories.map(category => category.id));
            } else {
                console.warn("Fetched book is empty or undefined");
            }
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    };

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'previewPdf') setPreviewPdf(files[0]);
        if (name === 'fullPdf') setFullPdf(files[0]);
        if (name === 'image') setImageFile(files[0]);
    };

    const handleCategorySearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredCategories(allCategories.filter(cat => cat.name.toLowerCase().includes(searchTerm)));
    };

    const handleAuthorSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredAuthors(allAuthors.filter(auth => auth.name.toLowerCase().includes(searchTerm)));
    };

    const handleAuthorSelect = (authorId) => {
        if (!selectedAuthors.includes(authorId)) {
            setSelectedAuthors([...selectedAuthors, authorId]);
        }
    };

    const handleCategorySelect = (categoryId) => {
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const removeAuthor = (authorId) => {
        setSelectedAuthors(selectedAuthors.filter(id => id !== authorId));
    };

    const removeCategory = (categoryId) => {
        setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', book.name);
        formData.append('description', book.description);
        formData.append('isbn', book.isbn);
    
        selectedCategories.forEach(id => formData.append('categoryIds', id));
        selectedAuthors.forEach(id => formData.append('authorIds', id));
    
        if (previewPdf) formData.append('previewPdfFile', previewPdf);
        if (fullPdf) formData.append('fullPdfFile', fullPdf);
        if (imageFile) formData.append('imageFile', imageFile);
    
        try {
            await BookService.updateBook(bookId, formData);
            alert('Book updated successfully');
            navigate('/');
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };
    

    return (
        <div className="max-w-lg mx-auto my-10 p-8 shadow-lg border border-gray-200 rounded-lg bg-white">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Update Book</h1>

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

                {/* Category Selection with Search */}
                Search category in a list
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Search Category"
                    onChange={handleCategorySearch}
                />
                <div className="border border-gray-300 rounded-md p-3">
                    {filteredCategories.map(category => (
                        <div
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className="cursor-pointer p-1 hover:bg-gray-200"
                        >
                            {category.name}
                        </div>
                    ))}
                </div>

                {/* Display selected categories */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map(categoryId => {
                        const category = allCategories.find(c => c.id === categoryId);
                        return (
                            <span
                                key={categoryId}
                                className="bg-green-200 text-green-700 p-2 rounded-md"
                                onClick={() => removeCategory(categoryId)}
                            >
                                {category?.name} ✕
                            </span>
                        );
                    })}
                </div>

                {/* Author Multi-Selection with Search */}
                Search Author in a list
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Search Authors"
                    onChange={handleAuthorSearch}
                />
                <div className="border border-gray-300 rounded-md p-3">
                    {filteredAuthors.map(author => (
                        <div
                            key={author.id}
                            onClick={() => handleAuthorSelect(author.id)}
                            className="cursor-pointer p-1 hover:bg-gray-200"
                        >
                            {author.name}
                        </div>
                    ))}
                </div>

                {/* Display selected authors */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAuthors.map(authorId => {
                        const author = allAuthors.find(a => a.id === authorId);
                        return (
                            <span
                                key={authorId}
                                className="bg-blue-200 text-blue-700 p-2 rounded-md"
                                onClick={() => removeAuthor(authorId)}
                            >
                                {author?.name} ✕
                            </span>
                        );
                    })}
                </div>

                {/* File Uploads */}
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="previewPdf"
                    onChange={handleFileChange}
                />
                Upload preview pdf
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="fullPdf"
                    onChange={handleFileChange}
                />
                <input
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                Upload image

                <button
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    type="submit"
                >
                    Update Book
                </button>
            </form>
        </div>
    );
}

export default UpdateBook;
