// src/components/AppSidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from "@/components/ThemeProvider"; // Ensure theme provider is correctly imported
import {jwtDecode} from 'jwt-decode';

const AppSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { theme, setTheme } = useTheme(); // Access theme state and setter from theme context
    let userRole = '';

    if (token) {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken.role;
    }

    // Theme toggle handler
    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <aside className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-52' : 'w-20'} bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white h-screen shadow-lg p-4 flex flex-col`}>
            {/* Sidebar Toggle and Theme Button */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={toggleSidebar} className="text-white p-2 rounded hover:bg-blue-700 transition duration-200">
                    {isOpen ? '⟨' : '⟩'}
                </button>
                {isOpen && (
                    <button onClick={handleThemeToggle} className="text-white p-2 rounded hover:bg-blue-700 transition duration-200">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <ul className="space-y-6 mt-4">
                <li>
                <ul className="space-y-4 ml-2">
                    <Link to="/" className="block hover:text-blue-200 transition duration-200">
                        <span className="flex items-center gap-2">
                            {isOpen ? '🏠 Home' : '🏠'}
                        </span>
                    </Link>
                </ul>
                </li>

                {token && (
                    <>
                        {/* Manage Section */}
                        {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_ADMIN') && (
                            <div>
                                {isOpen && <h3 className="text-lg font-semibold text-blue-100 mt-4 mb-2">Manage</h3>}
                                <ul className="space-y-4 ml-2">
                                    {userRole === 'ROLE_LIBRARIAN' && (
                                        <>
                                            <li>
                                                <Link to="/add-book" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        {isOpen ? '📖 Add Book' : '📖'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/book-copies" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        {isOpen ? '📚 Book Copies' : '📚'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/categories" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        {isOpen ? '📂 Categories' : '📂'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/authors" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        {isOpen ? '🖋️ Authors' : '🖋️'}
                                                    </span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {userRole === 'ROLE_ADMIN' && (
                                        <li>
                                            <Link to="/add-user" className="block hover:text-blue-200 transition duration-200">
                                                <span className="flex items-center gap-2">
                                                    {isOpen ? '👤 Add User' : '👤'}
                                                </span>
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/books-with-copies" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                {isOpen ? '📘 Books with Copies' : '📘'}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/users" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                {isOpen ? '👥 Users' : '👥'}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Library Actions Section */}
                        {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_STUDENT') && (
                            <div>
                                {isOpen && <h3 className="text-lg font-semibold text-blue-100 mt-6 mb-2">Library Actions</h3>}
                                <ul className="space-y-4 ml-2">
                                    <li>
                                        <Link to="/cart" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                {isOpen ? '🛒 Cart' : '🛒'}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/payments" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                {isOpen ? '💳 Payments' : '💳'}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </ul>
        </aside>
    );
};

export default AppSidebar;
