// src/components/ProtectedLayout.js
import React, { useState } from 'react';
import NavbarProfile from './NavbarProfile';
import AppSidebar from './AppSidebar';

const ProtectedLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
                <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Layout with Navbar and Content */}
            <div className="flex flex-col flex-1">
                {/* Navbar with dynamic margin */}
                <NavbarProfile sidebarOpen={isSidebarOpen} className={`transition-all duration-300 ${isSidebarOpen ? 'ml-52' : 'ml-20'}`} />

                {/* Main content with padding */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
