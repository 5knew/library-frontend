// src/components/AppSidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { jwtDecode } from 'jwt-decode';
import { FiHome, FiBook, FiUser, FiShoppingCart, FiCreditCard, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AppSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRole = '';

    if (token) {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken.role;
    }

   
    return (
        <aside className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-52' : 'w-20'} bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white h-screen shadow-2xl rounded-lg p-4 flex flex-col justify-between`}>
            {/* Sidebar Toggle Button */}
            <div className="flex justify-end mb-4">
                <button onClick={toggleSidebar} className="text-white p-2 rounded hover:bg-blue-700 transition duration-200">
                    {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                </button>
            </div>

            {/* Logo / Title */}
            <div className={`text-center ${isOpen ? 'text-2xl font-bold tracking-wider mb-8' : 'text-xl mb-8'}`}>
                <Link to="/" className="text-white hover:text-blue-200 transition duration-300">
                    {isOpen ? 'AUES UNIVERSITY LIBRARY' : 'AUES'}
                </Link>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-6">
                <li>
                    <Link to="/" className="block hover:text-blue-200 transition duration-200">
                    <ul className="space-y-4 ml-2">

                        <span className="flex items-center gap-2">
                            <FiHome size={20} />
                            {isOpen && 'Home'}
                        </span>
                    </ul>
                    </Link>
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
                                                        <FiBook size={20} />
                                                        {isOpen && 'Add Book'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/book-copies" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        <FiBook size={20} />
                                                        {isOpen && 'Book Copies'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/categories" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        <FiBook size={20} />
                                                        {isOpen && 'Categories'}
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/authors" className="block hover:text-blue-200 transition duration-200">
                                                    <span className="flex items-center gap-2">
                                                        <FiBook size={20} />
                                                        {isOpen && 'Authors'}
                                                    </span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {userRole === 'ROLE_ADMIN' && (
                                        <li>
                                            <Link to="/add-user" className="block hover:text-blue-200 transition duration-200">
                                                <span className="flex items-center gap-2">
                                                    <FiUser size={20} />
                                                    {isOpen && 'Add User'}
                                                </span>
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link to="/books-with-copies" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                <FiBook size={20} />
                                                {isOpen && 'Books with Copies'}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/users" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                <FiUser size={20} />
                                                {isOpen && 'Users'}
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
                                                <FiShoppingCart size={20} />
                                                {isOpen && 'Cart'}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/payments" className="block hover:text-blue-200 transition duration-200">
                                            <span className="flex items-center gap-2">
                                                <FiCreditCard size={20} />
                                                {isOpen && 'Payments'}
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
