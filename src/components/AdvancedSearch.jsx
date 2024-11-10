import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AuthorService from '../Services/AuthorService/AuthorService';
import CategoryService from '../Services/CategoryService/CategoryService';

import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import customSelectStyles from './ui/customSelectStyles';

function AdvancedSearch({ onSearch }) {
    const [filters, setFilters] = useState({
        description: '',
        isbn: '',
        authorIds: [],
        categoryIds: []
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAuthors();
        fetchCategories();
    }, []);

    const fetchAuthors = async () => {
        try {
            const authorsData = await AuthorService.getAllAuthors();
            setAuthors(authorsData.map(author => ({ value: author.id, label: author.name })));
        } catch (err) {
            console.error("Error fetching authors:", err);
            setError("Failed to load authors.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(categoriesData.map(category => ({ value: category.id, label: category.name })));
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleSelectChange = (selectedOptions, { name }) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFilters((prevFilters) => ({ ...prevFilters, [name]: selectedIds }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);  // Ensure this sends the correct format
    };

          
    
    
    

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded-lg mb-6 bg-card">
            <Label>
                <h2 className="text-xl font-semibold mb-4">Advanced Search</h2>
            </Label>

            <div className="grid gap-4">
                <Label>Description</Label>
                <Input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={filters.description}
                    onChange={handleChange}
                    disabled={loading}
                />

                <Label>ISBN</Label>
                <Input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={filters.isbn}
                    onChange={handleChange}
                    disabled={loading}
                />

                <Label>Authors</Label>
                <Select
                    name="authorIds"
                    options={authors}
                    isMulti
                    isLoading={loading}
                    placeholder="Select Authors..."
                    onChange={handleSelectChange}
                    value={authors.filter(author => filters.authorIds.includes(author.value))}
                    noOptionsMessage={() => loading ? "Loading..." : "No authors available"}
                    styles={customSelectStyles}
                />

                <Label>Categories</Label>
               
                <Select
                    name="categoryIds"
                    options={categories}
                    isMulti
                    isLoading={loading}
                    placeholder="Select Categories..."
                    onChange={handleSelectChange}
                    value={categories.filter(category => filters.categoryIds.includes(category.value))}
                    noOptionsMessage={() => loading ? "Loading..." : "No categories available"}
                    styles={customSelectStyles}

                />
            </div>

            <Button type="submit" className="mt-4" disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
            </Button>
        </form>
    );
}

export default AdvancedSearch;

