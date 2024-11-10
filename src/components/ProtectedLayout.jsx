// src/components/ProtectedLayout.js
import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const ProtectedLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <SidebarProvider>
            <div className="flex">
                {/* Sidebar and Main Content */}
                <div className="flex w-full">
                    {/* Sidebar */}
                    <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    <SidebarTrigger />
                    
                    {/* Main Layout with Centered Content */}
                    <div className="flex-1 flex  min-h-screen">
                       
                           
                       
                    </div>
                    
                </div>
                
            </div>
            {children}
        </SidebarProvider>
    );
};

export default ProtectedLayout;
