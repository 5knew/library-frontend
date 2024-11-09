import React, { useState, useEffect } from 'react';
import UserService from '../../Services/UserManagingService/UserService';
import UserDetail from './UserDetail';
import { jwtDecode } from 'jwt-decode';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false); // State to track if users list is empty

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await UserService.getAllUsers();
        setUsers(fetchedUsers);
        setIsEmpty(fetchedUsers.length === 0); // Set isEmpty based on fetched users
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUsers();
  
    // Decode JWT token and set user role
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handleUserDeleted = (userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(user => user.id !== userId);
      setIsEmpty(updatedUsers.length === 0); // Update isEmpty if no users remain after deletion
      return updatedUsers;
    });
  };

  const handleUserUpdated = (userId, updatedProperties) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, ...updatedProperties } : user
    ));
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Users</h1>

    {isEmpty ? (
        <div className="text-center text-gray-500">No users found.</div>
    ) : (
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-blue-100 text-gray-600 uppercase text-sm font-semibold">
                        <th className="py-4 px-6 text-left">Name</th>
                        <th className="py-4 px-6 text-left">Email</th>
                        <th className="py-4 px-6 text-left">Role</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        {userRole === 'ROLE_ADMIN' && (
                            <th className="py-4 px-6 text-center">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {users.map(user => (
                        <UserDetail
                            key={user.id}
                            user={user}
                            userRole={userRole}
                            onUserUpdated={handleUserUpdated}
                            onUserDeleted={handleUserDeleted}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )}
</div>

  );
};

export default UsersPage;
