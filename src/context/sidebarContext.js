import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => {
        setIsSidebarOpen(true);
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    }

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext debe usarse dentro de un SidebarProvider');
    }
    return context;
}