import React, { useState, useEffect } from 'react';
import AuthorService from '../../Services/AuthorService/AuthorService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';


const AuthorForm = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [author, setAuthor] = useState({ name: '', phone: '', address: '' });
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    fetchAuthors();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const fetchAuthors = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const authorsData = await AuthorService.getAllAuthors();
        if (Array.isArray(authorsData)) {
            const sortedAuthors = authorsData.sort((a, b) => a.name.localeCompare(b.name));
            setAuthors(sortedAuthors);
            setIsEmpty(sortedAuthors.length === 0);
        } else {
            console.error("Unexpected response format:", authorsData);
            setError("Failed to fetch authors. Unexpected response format.");
        }
    } catch (error) {
        console.error("Fetch authors error:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch authors. Please try again.";
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
};




  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAuthors = authors.filter((auth) =>
    auth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (author.id) {
        await AuthorService.updateAuthor(author.id, author);
      } else {
        await AuthorService.createAuthor(author);
      }
      fetchAuthors();
      setAuthor({ name: '', phone: '', address: '' });
    } catch (error) {
      setError('Failed to save author. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await AuthorService.deleteAuthor(id);
      fetchAuthors();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete author. They might be associated with books.';
      setError(errorMessage);
    }
  };

  if (isLoading) return <div>Loading authors...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="container mx-auto max-w-5xl shadow-lg rounded-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">Add or Edit Author</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <Label>Name</Label>
                <Input
                    type="text"
                    name="name"
                    value={author.name}
                    onChange={handleChange}
                    placeholder="Author Name"
                    required
                />

                <Label>Phone</Label>
                <Input
                    type="text"
                    name="phone"
                    value={author.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />

                <Label>Address</Label>
                <Input
                    type="text"
                    name="address"
                    value={author.address}
                    onChange={handleChange}
                    placeholder="Address"
                />

                <Button className="w-full mt-4" type="submit">
                    Save
                </Button>
            </CardContent>
        </form>

        <CardContent className="mt-6 space-y-4">
            <Input
                type="text"
                placeholder="Search authors..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <h3 className="text-xl font-semibold">Authors List</h3>
            {isEmpty || filteredAuthors.length === 0 ? (
                <p className="text-muted-foreground">No authors found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Label className="font-semibold">Name</Label>
                    <Label className="font-semibold">Phone</Label>
                    <Label className="font-semibold">Address</Label>

                    {filteredAuthors.map((auth) => (
                        <React.Fragment key={auth.id}>
                            <Label className="font-semibold">{auth.name}</Label>
                            <Label className="font-semibold">{auth.phone}</Label>
                            <Label className="font-semibold flex justify-between items-center">
                                {auth.address}
                                {userRole === 'ROLE_LIBRARIAN' && (
                                    <div className="flex space-x-3">
                                        <FaEdit
                                            onClick={() => setAuthor(auth)}
                                            className="cursor-pointer text-blue-500 hover:text-blue-600 transition duration-150"
                                        />
                                        <FaTrash
                                            onClick={() => handleDelete(auth.id)}
                                            className="cursor-pointer text-red-500 hover:text-red-600 transition duration-150"
                                        />
                                    </div>
                                )}
                            </Label>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);
}

export default AuthorForm;
