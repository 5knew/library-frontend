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
import { cn } from '@/lib/utils'; // Helper function for conditionally combining classes

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
        <nav className="bg-gradient-to-r text-white shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <Link to="/" className="text-lg font-bold text-white tracking-wide">
              AUES UNIVERSITY LIBRARY
            </Link>
    
            <ul className="flex gap-4 items-center list-none m-0 p-0">
              <li>
                <Link to="/" className="text-white no-underline">
                  Home
                </Link>
              </li>
    
              {token ? (
                <>
                  {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_ADMIN') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="bg-none text-white cursor-pointer">
                          Manage
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white text-gray-800 rounded-lg p-2">
                        {userRole === 'ROLE_LIBRARIAN' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/add-book" className="text-gray-800 no-underline">Add Book</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/book-copies" className="text-gray-800 no-underline">Book Copies</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/categories" className="text-gray-800 no-underline">Categories</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/authors" className="text-gray-800 no-underline">Authors</Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        {userRole === 'ROLE_ADMIN' && (
                          <DropdownMenuItem asChild>
                            <Link to="/add-user" className="text-gray-800 no-underline">Add User</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/books-with-copies" className="text-gray-800 no-underline">Books with Copies</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/users" className="text-gray-800 no-underline">Users</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
    
                  {(userRole === 'ROLE_LIBRARIAN' || userRole === 'ROLE_STUDENT') && (
                    <>
                      <li>
                        <Link to="/cart" className="text-white no-underline">Cart</Link>
                      </li>
                      <li>
                        <Link to="/payments" className="text-white no-underline">Payments</Link>
                      </li>
                    </>
                  )}
    
                  <li>
                    <Button onClick={handleLogout} variant="destructive" className="bg-red-600 text-white cursor-pointer">
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/signin" className="text-white no-underline">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-white no-underline">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      );
    };
    
    export default Navbar;