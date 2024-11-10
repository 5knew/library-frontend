import React, { useState, useEffect } from 'react';
import UserService from '../../Services/UserManagingService/UserService';
import UserDetail from './UserDetail';
import { jwtDecode } from 'jwt-decode';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
    <Card className="max-w-6xl mx-auto my-10 shadow-lg rounded-lg">
      <Label asChild>
        <h1 className="text-3xl font-bold text-center my-6">All Users</h1>
      </Label>

      {isEmpty ? (
        <div className="text-center text-muted">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Status</TableHead>
                {userRole === 'ROLE_ADMIN' && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserDetail
                  key={user.id}
                  user={user}
                  userRole={userRole}
                  onUserUpdated={handleUserUpdated}
                  onUserDeleted={handleUserDeleted}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}

export default UsersPage;