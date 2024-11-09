import React, { useState } from 'react';
import UserService from '../../Services/UserManagingService/UserService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ROLE_CUSTOMER', // Set role to ROLE_CUSTOMER by default
    studentId: '',
    course: '',
    enrollmentDate: '',
    enabled: true,
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
      navigate('/'); // Redirect to the home page or login page after signup
    } catch (error) {
      console.error('Failed to sign up:', error);
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

      {/* Additional fields like studentId, course, enrollmentDate, if needed */}
      
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default Signup;
