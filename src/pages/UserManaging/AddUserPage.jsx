import React, { useState } from 'react';
import UserService from '../../Services/UserManagingService/UserService';
import { useNavigate } from 'react-router-dom';

const AddUserPage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Added password field
    role: 'ROLE_STUDENT',
    studentId: '', // Added studentId field
    course: '', // Added course field
    enrollmentDate: '', // Added enrollmentDate field
    enabled: true, // Added enabled field, defaulting to true
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.addUser(user);
      navigate('/users'); // Redirect to the users list page
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-10 bg-white p-8 rounded-lg shadow">
  <div className="mb-6">
    <label htmlFor="firstName" className="block text-gray-700 text-sm font-semibold mb-2">
      First Name:
    </label>
    <input
      type="text"
      name="firstName"
      id="firstName"
      value={user.firstName}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6">
    <label htmlFor="lastName" className="block text-gray-700 text-sm font-semibold mb-2">
      Last Name:
    </label>
    <input
      type="text"
      name="lastName"
      id="lastName"
      value={user.lastName}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6">
    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
      Email:
    </label>
    <input
      type="email"
      name="email"
      id="email"
      value={user.email}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6">
    <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
      Password:
    </label>
    <input
      type="password"
      name="password"
      id="password"
      value={user.password}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6">
    <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">
      Role:
    </label>
    <select
      name="role"
      id="role"
      value={user.role}
      onChange={handleChange}
      required
      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="ROLE_LIBRARIAN">Librarian</option>
      <option value="ROLE_STUDENT">Student</option>
      <option value="ROLE_ADMIN">Admin</option>
    </select>
  </div>

  {/* Repeat similar structure for other fields... */}

  <div className="flex items-center justify-between">
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Add User
    </button>
  </div>
</form>

  );
};

export default AddUserPage;