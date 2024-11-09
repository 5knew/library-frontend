import React, { useState, useEffect } from 'react';
import AuthorService from '../../Services/AuthorService/AuthorService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';


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
    <div className="container mx-auto p-6 max-w-5xl bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add or Edit Author</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={author.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <input
          type="text"
          name="phone"
          value={author.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <input
          type="text"
          name="address"
          value={author.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Save</button>
      </form>

      <input
        type="text"
        placeholder="Search authors..."
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />

<h3 className="text-xl font-semibold mb-4">Authors List</h3>
{isEmpty || filteredAuthors.length === 0 ? (
  <p className="text-gray-500">No authors found.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md shadow-lg">
    <div className="font-semibold text-gray-700">Name</div>
    <div className="font-semibold text-gray-700">Phone</div>
    <div className="font-semibold text-gray-700">Address</div>

    {filteredAuthors.map((auth) => (
      <React.Fragment key={auth.id}>
        <div className="text-gray-800 font-medium">{auth.name}</div>
        <div className="text-gray-600">{auth.phone}</div>
        <div className="text-gray-600 flex justify-between items-center">
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
        </div>
      </React.Fragment>
    ))}
  </div>
)}


      

    </div>
  );
};

export default AuthorForm;
