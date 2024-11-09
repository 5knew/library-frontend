import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AuthorService from '../Services/AuthorService/AuthorService';
import CategoryService from '../Services/CategoryService/CategoryService';

function AdvancedSearchBookWithCopies({ onSearch }) {
    const [filters, setFilters] = useState({
        title: '',
        authorIds: [],
        categoryIds: [],
        minPrice: '',
        maxPrice: '',
        language: '',
        startDate: '',
        endDate: ''
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
        onSearch(filters);
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Advanced Search for Books and Copies</h2>
            <div className="grid grid-cols-2 gap-4">
                {/* Book Filters */}
                <input
                    type="text"
                    name="title"
                    placeholder="Book Title"
                    value={filters.title}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />

                <Select
                    name="authorIds"
                    options={authors}
                    isMulti
                    isLoading={loading}
                    placeholder="Select Authors..."
                    onChange={handleSelectChange}
                    value={authors.filter(author => filters.authorIds.includes(author.value))}
                    noOptionsMessage={() => loading ? "Loading..." : "No authors available"}
                />

                <Select
                    name="categoryIds"
                    options={categories}
                    isMulti
                    isLoading={loading}
                    placeholder="Select Categories..."
                    onChange={handleSelectChange}
                    value={categories.filter(category => filters.categoryIds.includes(category.value))}
                    noOptionsMessage={() => loading ? "Loading..." : "No categories available"}
                />

                {/* BookCopy Filters */}
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="language"
                    placeholder="Language"
                    value={filters.language}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Search'}
            </button>
        </form>
    );
}

export default AdvancedSearchBookWithCopies;
