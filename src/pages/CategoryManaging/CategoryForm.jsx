import React, { useState, useEffect } from 'react';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [category, setCategory] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await CategoryService.getAllCategories();
      const sortedCategories = response ? response.sort((a, b) => a.name.localeCompare(b.name)) : [];
      setCategories(sortedCategories);
      setFilteredCategories(sortedCategories);
    } catch (error) {
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category.id) {
        await CategoryService.updateCategory(category.id, category);
      } else {
        await CategoryService.createCategory(category);
      }
      fetchCategories();
      setCategory({ name: '' });
    } catch (error) {
      setError('Failed to save category. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await CategoryService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      setError('Failed to delete category. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(term));
    setFilteredCategories(filtered);
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add or Edit Category</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Save</button>
      </form>

      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />

      <h3 className="text-xl font-semibold mb-4">Categories List</h3>
      {filteredCategories.length === 0 ? (
        <p className="text-gray-500">No category found.</p>
      ) : (
        <ul>
          {filteredCategories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between mb-2">
              <span>{cat.name}</span>
              {userRole === 'ROLE_LIBRARIAN' && (
                <div>
                  <FaEdit onClick={() => setCategory(cat)} className="cursor-pointer text-blue-500 mx-2" />
                  <FaTrash onClick={() => handleDelete(cat.id)} className="cursor-pointer text-red-500" />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryForm;
