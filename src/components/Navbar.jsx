import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed and imported

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRole = '';

    if (token) {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken.role; // Adjust based on your token's role structure
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 shadow-md">
            <div className="container mx-auto max-w-6xl flex justify-between items-center">
                <div className="text-lg font-bold tracking-wider">
                    <Link to="/" className="text-white">
                        AUES UNIVERSITY LIBRARY
                    </Link>
                </div>

                <ul className="flex space-x-6 items-center">
                    <li>
                        <Link to="/" className="hover:text-blue-200 transition duration-200 ease-in-out">
                            Home
                        </Link>
                    </li>

                    {token ? (
                        <>
                            {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_ADMIN') && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="hover:text-blue-200 transition duration-200 ease-in-out">
                                            Manage
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {userRole === 'ROLE_LIBRARIAN' && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/add-book">Add Book</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/book-copies">Book Copies</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/categories">Categories</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/authors">Authors</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {userRole === 'ROLE_ADMIN' && (
                                            <DropdownMenuItem asChild>
                                                <Link to="/add-user">Add User</Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/books-with-copies">Books with Copies</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/users">Users</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_STUDENT') && (
                                <>
                                    <li>
                                        <Link to="/cart" className="hover:text-blue-200 transition duration-200 ease-in-out">
                                            Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/payments" className="hover:text-blue-200 transition duration-200 ease-in-out">
                                            Payments
                                        </Link>
                                    </li>
                                </>
                            )}

                            {/* Logout Button */}
                            <li>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="transition duration-200 ease-in-out"
                                >
                                    Logout
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/signin" className="hover:text-blue-200 transition duration-200 ease-in-out">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="hover:text-blue-200 transition duration-200 ease-in-out">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
