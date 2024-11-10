import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserManagingService/UserService';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

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
      <Card className="container max-w-lg mx-auto my-10 shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle>Update User</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                <Label htmlFor={input.name}>{input.label}</Label>
                <Input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  value={input.value}
                  onChange={handleChange}
                  placeholder={input.label}
                  required={input.type !== "text"}
                />
              </div>
            ))}
  
            <Label>Role</Label>
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
  
            <Label>Account Status</Label>
            <Select onValueChange={(value) => handleChange({ target: { name: "enabled", value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={true}>Enabled</SelectItem>
                <SelectItem value={false}>Disabled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
  
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full">
              Update User
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
  
  export default UpdateUserPage;