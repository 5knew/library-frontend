// src/components/AppSidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, BookOpen, Users, Folder, Edit3, Edit2, ListCheck, Clipboard, ShoppingCart, CreditCard, User, Heart, LogOut, BookAIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { jwtDecode } from 'jwt-decode';


// Menu items for different user roles
const items = [
  { title: "Home", url: "/", icon: Home },
];

const itemLibrary = [
  { title: "Add Book", url: "/add-book", icon: Edit3 },
  { title: "Add Book Instances", url: "/add-book-copy", icon: Edit2 },
  { title: "Books List", url: "/", icon: BookAIcon },
  { title: "Book Instances List", url: "/book-copies", icon: ListCheck },
  { title: "Users", url: "/users", icon: Users },
  { title: "Create/Edit Categories", url: "/categories", icon: Folder },
  { title: "Create/Edit Authors", url: "/authors", icon: Clipboard },
];

const itemAdmins = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Add Users", url: "/add-user", icon: Users },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "Payments", url: "/payments", icon: CreditCard },
];

const itemStudents = [
  { title: "Books", url: "/books-with-copies", icon: BookOpen },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "Payments", url: "/payments", icon: CreditCard },
];

const itemProfiles = [
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Log Out", url: "#", icon: LogOut },
];

const itemUnauthorized = [
  { title: "Sign In", url: "/signin", icon: User },
  { title: "Sign Up", url: "/signup", icon: Heart },
];

export default function AppSidebar() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setUserRole(null); // Reset the user role
    navigate('/signin');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="font-semibold">AUES LIBRARY</span>
      </SidebarHeader>
      <SidebarContent>
        {/* General Library Panel - Available to All */}
        <SidebarGroup>
          <SidebarGroupLabel>User Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel - Only for admin */}
        {userRole === 'ROLE_LIBRARIAN' && (
          <SidebarGroup>
            <SidebarGroupLabel>Library Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemLibrary.map((itemLibrary) => (
                  <SidebarMenuItem key={itemLibrary.title}>
                    <SidebarMenuButton asChild>
                      <Link to={itemLibrary.url} className="flex items-center gap-2">
                        <itemLibrary.icon className="h-5 w-5" />
                        <span>{itemLibrary.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

         {/* Admin Panel - Only for admin */}
         {userRole === 'ROLE_ADMIN' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemAdmins.map((itemAdmin) => (
                  <SidebarMenuItem key={itemAdmin.title}>
                    <SidebarMenuButton asChild>
                      <Link to={itemAdmin.url} className="flex items-center gap-2">
                        <itemAdmin.icon className="h-5 w-5" />
                        <span>{itemAdmin.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Student Panel - Only for students */}
        {userRole === 'ROLE_STUDENT' && (
          <SidebarGroup>
            <SidebarGroupLabel>Student Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemStudents.map((itemStudent) => (
                  <SidebarMenuItem key={itemStudent.title}>
                    <SidebarMenuButton asChild>
                      <Link to={itemStudent.url} className="flex items-center gap-2">
                        <itemStudent.icon className="h-5 w-5" />
                        <span>{itemStudent.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with Profile Links */}
      <SidebarFooter>
        <SidebarMenu>
          {(userRole ? itemProfiles : itemUnauthorized).map((itemProfile) => (
            <SidebarMenuItem key={itemProfile.title}>
              <SidebarMenuButton asChild>
                {itemProfile.title === "Log Out" ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <itemProfile.icon className="h-5 w-5" />
                    <span>{itemProfile.title}</span>
                  </button>
                ) : (
                  <Link to={itemProfile.url} className="flex items-center gap-2">
                    <itemProfile.icon className="h-5 w-5" />
                    <span>{itemProfile.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
