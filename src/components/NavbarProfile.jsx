import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';

const NavbarProfile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <Link to="/" className="text-lg font-semibold">
                AUES Library
            </Link>

            {/* Conditional rendering based on authentication */}
            {token ? (
                <div className="relative">
                    {/* Profile Icon for Authenticated Users */}
                    <button onClick={toggleDropdown} className="flex items-center gap-2">
                        <FiUser size={24} className="cursor-pointer" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                            <ul className="py-1">
                                <li>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-x-4">
                    <Link to="/signin" className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-md transition">
                        Sign In
                    </Link>
                    <Link to="/signup" className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-md transition">
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default NavbarProfile;
