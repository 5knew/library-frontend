import React, { useState } from 'react';
import UserService from '../../Services/UserManagingService/UserService';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

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
    <Card className="container max-w-lg mx-auto my-10 shadow-lg border rounded-lg">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
          />

          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
          />

          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            required
            placeholder="Password"
          />

          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => handleChange({ target: { name: "role", value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROLE_LIBRARIAN">Librarian</SelectItem>
              <SelectItem value="ROLE_STUDENT">Student</SelectItem>
              <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button type="submit">Add User</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default AddUserPage;