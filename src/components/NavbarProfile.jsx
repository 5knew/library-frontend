import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Heart, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavbarProfile = ({ sidebarOpen }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
     
            <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
              <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors">
                  AUES Library
                </Link>
        
                {token ? (
                  <div className="flex items-center gap-4">
                    <Link to="/search" className="hover:text-blue-200 transition-colors">
                      Search
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/01.png" alt="@username" />
                            <AvatarFallback>UN</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">username</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              user@example.com
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/favorites" className="flex items-center">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favorites</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="space-x-4">
                    <Button asChild variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700">
                      <Link to="/signin">Sign In</Link>
                    </Button>
                    <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-100">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          );
        };


export default NavbarProfile;
