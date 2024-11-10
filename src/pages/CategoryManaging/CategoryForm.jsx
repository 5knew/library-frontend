import React, { useState, useEffect } from 'react';
import CategoryService from '../../Services/CategoryService/CategoryService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
    <Card className="container mx-auto max-w-5xl shadow-lg rounded-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">Add or Edit Category</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <Label>Category Name</Label>
                <Input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    placeholder="Category Name"
                    required
                />

                <Button className="w-full mt-4" type="submit">
                    Save
                </Button>
            </CardContent>
        </form>

        <CardContent className="mt-6 space-y-4">
            <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <h3 className="text-xl font-semibold">Categories List</h3>
            {filteredCategories.length === 0 ? (
                <p className="text-gray-500">No category found.</p>
            ) : (
                <ul className="space-y-2">
                    {filteredCategories.map((cat) => (
                        <li key={cat.id} className="flex items-center justify-between p-2 rounded-md">
                            <span>{cat.name}</span>
                            {userRole === 'ROLE_LIBRARIAN' && (
                                <div className="flex space-x-2">
                                    <FaEdit
                                        onClick={() => setCategory(cat)}
                                        className="cursor-pointer text-blue-500"
                                    />
                                    <FaTrash
                                        onClick={() => handleDelete(cat.id)}
                                        className="cursor-pointer text-red-500"
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>
);
}

export default CategoryForm;