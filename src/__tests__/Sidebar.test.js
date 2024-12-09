import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { SidebarProvider } from '../context/sidebarContext';
import { MealProvider } from '../context/mealContext';

// Mock de los contextos
jest.mock('../context/sidebarContext', () => ({
    useSidebarContext: () => ({
        isSidebarOpen: true,
        closeSidebar: jest.fn()
    }),
    SidebarProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../context/mealContext', () => ({
    useMealContext: () => ({
        categories: [
            { 
                id_categoria: 1, 
                nombre_categoria: 'Desayunos' 
            },
            { 
                id_categoria: 2, 
                nombre_categoria: 'Almuerzos' 
            },
            { 
                id_categoria: 3, 
                nombre_categoria: 'Cenas' 
            }
        ]
    }),
    MealProvider: ({ children }) => <div>{children}</div>
}));

const renderSidebar = () => {
    return render(
        <BrowserRouter>
            <SidebarProvider>
                <MealProvider>
                    <Sidebar />
                </MealProvider>
            </SidebarProvider>
        </BrowserRouter>
    );
};

describe('Sidebar', () => {
    // Test 1: Renderizado inicial
    test('renderiza correctamente el sidebar', () => {
        renderSidebar();
        expect(screen.getByRole('navigation')).toHaveClass('sidebar');
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('list')).toHaveClass('side-nav');
    });

    // Test 2: Renderizado de categorías
    test('renderiza todas las categorías correctamente', () => {
        renderSidebar();
        expect(screen.getByText('Desayunos')).toBeInTheDocument();
        expect(screen.getByText('Almuerzos')).toBeInTheDocument();
        expect(screen.getByText('Cenas')).toBeInTheDocument();
    });

    // Test 3: Clase de visibilidad del sidebar
    test('aplica la clase correcta cuando el sidebar está abierto', () => {
        renderSidebar();
        const sidebar = screen.getByRole('navigation');
        expect(sidebar).toHaveClass('sidebar-visible');
    });

    // Test 4: Funcionalidad del botón de cierre
    test('llama a closeSidebar cuando se hace clic en el botón de cierre', () => {
        const { useSidebarContext } = require('../context/sidebarContext');
        const closeSidebar = jest.fn();
        jest.spyOn(require('../context/sidebarContext'), 'useSidebarContext')
            .mockImplementation(() => ({
                isSidebarOpen: true,
                closeSidebar
            }));

        renderSidebar();
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(closeSidebar).toHaveBeenCalled();
    });

    // Test 5: Links de navegación
    test('los links de categorías tienen la ruta correcta', () => {
        renderSidebar();
        const categoryLinks = screen.getAllByRole('link');
        expect(categoryLinks[0]).toHaveAttribute('href', '/meal/category/Desayunos');
        expect(categoryLinks[1]).toHaveAttribute('href', '/meal/category/Almuerzos');
        expect(categoryLinks[2]).toHaveAttribute('href', '/meal/category/Cenas');
    });

    // Test 6: Cierre al hacer clic en una categoría
    test('cierra el sidebar al hacer clic en una categoría', () => {
        const closeSidebar = jest.fn();
        jest.spyOn(require('../context/sidebarContext'), 'useSidebarContext')
            .mockImplementation(() => ({
                isSidebarOpen: true,
                closeSidebar
            }));

        renderSidebar();
        const categoryLink = screen.getByText('Desayunos');
        fireEvent.click(categoryLink);
        expect(closeSidebar).toHaveBeenCalled();
    });
});