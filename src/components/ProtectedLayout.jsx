// src/components/ProtectedLayout.js
import React, { useState } from 'react';
import AppSidebar from './AppSidebar';

const ProtectedLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-52' : 'w-20'
                } bg-blue-700 z-10`}
            >
                <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            {/* Main content */}
            <main
                className={`transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'ml-52' : 'ml-10'
                } flex-1 p-6`}
            >
                {children}
            </main>
        </div>
    );
};

export default ProtectedLayout;
