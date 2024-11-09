import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserManagingService/UserService';

const UpdateUserPage = () => {
  const { userId } = useParams(); // Get the userId from URL params
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    studentId: '',
    course: '',
    enrollmentDate: '',
    enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await UserService.getUser(userId);
        setUser({ ...userData, enrollmentDate: userData.enrollmentDate?.split('T')[0] }); // Format date for input[type=date]
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUser(userId, user);
      navigate('/'); // Adjust as needed
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again later.');
    }
  };

  if (isLoading) return <div className="text-center mt-4">Loading user details...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-10 bg-white p-8 rounded-lg shadow space-y-6">
  {[
    { label: "First Name", type: "text", name: "firstName", value: user.firstName },
    { label: "Last Name", type: "text", name: "lastName", value: user.lastName },
    { label: "Email", type: "email", name: "email", value: user.email },
    { label: "Password", type: "password", name: "password", value: user.password || '' },
    { label: "Student ID", type: "text", name: "studentId", value: user.studentId || '' },
    { label: "Course", type: "text", name: "course", value: user.course || '' },
    { label: "Enrollment Date", type: "date", name: "enrollmentDate", value: user.enrollmentDate ? user.enrollmentDate.split('T')[0] : '' },
  ].map((input, index) => (
    <div key={index}>
      <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
        {input.label}:
      </label>
      <input
        type={input.type}
        name={input.name}
        id={input.name}
        value={input.value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required={input.type !== "text"}
      />
    </div>
  ))}

  <div>
    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
      Role:
    </label>
    <select
      name="role"
      id="role"
      value={user.role}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      required
    >
      <option value="ROLE_LIBRARIAN">Librarian</option>
      <option value="ROLE_STUDENT">Student</option>
      <option value="ROLE_ADMIN">Admin</option>
    </select>
  </div>

  <div>
    <label htmlFor="enabled" className="block text-sm font-medium text-gray-700">
      Account Status:
    </label>
    <select
      name="enabled"
      id="enabled"
      value={user.enabled}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      required
    >
      <option value={true}>Enabled</option>
      <option value={false}>Disabled</option>
    </select>
  </div>

  <button
    type="submit"
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Update User
  </button>
</form>

  );
};

export default UpdateUserPage;
