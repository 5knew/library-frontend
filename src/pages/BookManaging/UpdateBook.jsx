import React, { useState, useEffect } from 'react';
import BookService from '../../Services/BookService/BookService';
import AuthorService from '../../Services/AuthorService/AuthorService';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
        <Card>
            <CardHeader>
                <CardTitle>Update Book</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
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

                    <Label>Search Category in a List</Label>
                    <Input
                        type="text"
                        placeholder="Search Category"
                        onChange={handleCategorySearch}
                    />
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                        {filteredCategories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => handleCategorySelect(category.id)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '4px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    marginBottom: '4px'
                                }}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {selectedCategories.map(categoryId => {
                            const category = allCategories.find(c => c.id === categoryId);
                            return (
                                <span
                                    key={categoryId}
                                    style={{
                                        backgroundColor: '#d4edda',
                                        color: '#155724',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => removeCategory(categoryId)}
                                >
                                    {category?.name} ✕
                                </span>
                            );
                        })}
                    </div>

                    <Label>Search Author in a List</Label>
                    <Input
                        type="text"
                        placeholder="Search Authors"
                        onChange={handleAuthorSearch}
                    />
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                        {filteredAuthors.map(author => (
                            <div
                                key={author.id}
                                onClick={() => handleAuthorSelect(author.id)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '4px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    marginBottom: '4px'
                                }}
                            >
                                {author.name}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {selectedAuthors.map(authorId => {
                            const author = allAuthors.find(a => a.id === authorId);
                            return (
                                <span
                                    key={authorId}
                                    style={{
                                        backgroundColor: '#cce5ff',
                                        color: '#004085',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => removeAuthor(authorId)}
                                >
                                    {author?.name} ✕
                                </span>
                            );
                        })}
                    </div>

                    <Label>Upload Preview PDF</Label>
                    <Input type="file" name="previewPdf" onChange={handleFileChange} />

                    <Label>Upload Full PDF</Label>
                    <Input type="file" name="fullPdf" onChange={handleFileChange} />

                    <Label>Upload Image</Label>
                    <Input type="file" name="image" onChange={handleFileChange} required />
                </CardContent>

                <CardFooter>
                    <Button type="submit">Update Book</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default UpdateBook;