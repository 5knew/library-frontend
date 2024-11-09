import React, { useState, useEffect } from 'react';
import UserDetailService from '../../Services/UserManagingService/UserDetailService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole'); // Retrieve role from local storage

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchUser(storedUserId);
        } else {
            setError("User ID is missing.");
        }
    }, []);

    const fetchUser = async (id) => {
        try {
            const response = await UserDetailService.getUser(id);
            setUser(response);
            setUpdatedUser(response); // Initialize updatedUser with the full user data
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError("Failed to load user details.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleUpdateUser = async () => {
        // Filter `updatedUser` to only include modified fields
        const modifiedData = Object.fromEntries(
            Object.entries(updatedUser).filter(
                ([key, value]) => value !== user[key]
            )
        );
    
        if (Object.keys(modifiedData).length === 0) {
            console.log("No changes detected");
            setIsEditing(false);
            return;
        }
    
        try {
            console.log("Updating user with modified data:", modifiedData); // Log for debugging
            const response = await UserDetailService.updateUser(userId, modifiedData);
            setUser(response); // Update displayed user data with response
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user details.");
        }
    };
    

    const handleDeleteUser = async () => {
        try {
            await UserDetailService.deleteUser(userId);
            navigate('/logout'); // Redirect after deletion, assuming you have a logout page
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Profile</h1>

            {error && <div className="text-center text-red-500 mb-4">{error}</div>}

            {user ? (
                <div>
                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                value={updatedUser.firstName ?? ''}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                className="border p-2 rounded w-full mb-4"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={updatedUser.lastName ?? ''}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                className="border p-2 rounded w-full mb-4"
                            />
                            <input
                                type="email"
                                name="email"
                                value={updatedUser.email ?? ''}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="border p-2 rounded w-full mb-4"
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                value={updatedUser.phoneNumber ?? ''}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="border p-2 rounded w-full mb-4"
                            />
                             <input
                                type="text"
                                name="password"
                                value={updatedUser.password ?? ''}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="border p-2 rounded w-full mb-4"
                            />

                            {/* Conditional input fields for Student ID and Course */}
                            {role === 'ROLE_STUDENT' && (
                                <>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={updatedUser.studentId ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="Student ID"
                                        className="border p-2 rounded w-full mb-4"
                                    />
                                    <input
                                        type="text"
                                        name="course"
                                        value={updatedUser.course ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="Course"
                                        className="border p-2 rounded w-full mb-4"
                                    />
                                </>
                            )}

                            <button
                                onClick={handleUpdateUser}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-4"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>First Name:</strong> {user.firstName}</p>
                            <p><strong>Last Name:</strong> {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>

                            {role === 'ROLE_STUDENT' && (
                                <>
                                    <p><strong>Student ID:</strong> {user.studentId}</p>
                                    <p><strong>Course:</strong> {user.course}</p>
                                    <p><strong>Enrollment Date:</strong> {user.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : 'N/A'}</p>
                                </>
                            )}

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-4 mt-4"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit Profile
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                Delete Profile
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
};

export default ProfilePage;
