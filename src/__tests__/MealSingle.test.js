import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MealSingle from '../components/Meal/MealSingle';

// Mock de los datos de prueba
const mockMeal = {
    id_receta: 1,
    nombre_receta: 'Pasta Carbonara',
    nombre_categoria: 'Pasta',
    dificultad: 'Media',
    imagen_url: '/pasta-carbonara.jpg',
    ingredientes: 'pasta,huevos,queso parmesano,panceta',
    instrucciones: 'Hervir la pasta. Preparar la salsa con huevos y queso. Mezclar todo.',
};

// Wrapper para el Router
const renderWithRouter = (ui) => {
    return render(
        <BrowserRouter>
            {ui}
        </BrowserRouter>
    );
};

describe('MealSingle', () => {
    // Test 1: Renderizado básico
    test('renderiza los detalles de la receta correctamente', () => {
        renderWithRouter(<MealSingle meal={mockMeal} />);
        
        // Verificar título usando el heading
        expect(screen.getByRole('heading', { 
            name: 'Pasta Carbonara',
            level: 3 
        })).toBeInTheDocument();
        
        // Verificar categor��a usando el contenedor específico
        const categoryContainer = screen.getByText('Categoría:', { exact: false })
            .closest('.category');
        expect(categoryContainer).toHaveTextContent('Pasta');
        
        // Verificar dificultad usando el contenedor específico
        const difficultyContainer = screen.getByText('Dificultad:', { exact: false })
            .closest('.difficulty');
        expect(difficultyContainer).toHaveTextContent('Media');
        
        // Verificar ingredientes
        const ingredientsSection = screen.getByText('Ingredientes')
            .closest('.ingredients');
        expect(ingredientsSection).toHaveTextContent('pasta');
        expect(ingredientsSection).toHaveTextContent('huevos');
    });

    // Test 2: Manejo de datos vacíos
    test('muestra mensaje cuando no hay datos', () => {
        renderWithRouter(<MealSingle meal={null} />);
        expect(screen.getByText('No se encontraron datos de la receta.')).toBeInTheDocument();
    });

    // Test 3: Botón de agendar
    test('llama a onSchedule cuando se hace clic en agendar', () => {
        const mockOnSchedule = jest.fn();
        renderWithRouter(<MealSingle meal={mockMeal} onSchedule={mockOnSchedule} />);
        
        const scheduleButton = screen.getByText('Agendar esta receta');
        fireEvent.click(scheduleButton);
        
        expect(mockOnSchedule).toHaveBeenCalledTimes(1);
    });

    // Test 4: Navegación del breadcrumb
    test('renderiza el breadcrumb correctamente', () => {
        renderWithRouter(<MealSingle meal={mockMeal} />);
        
        // Verificar elementos del breadcrumb
        const homeLink = screen.getByRole('link');
        expect(homeLink).toHaveAttribute('href', '/');
        
        // Verificar el título en el breadcrumb específicamente
        const breadcrumbTitle = screen.getByText('Pasta Carbonara', {
            selector: '.breadcrumb-item span'
        });
        expect(breadcrumbTitle).toBeInTheDocument();
    });

    // Test 5: Manejo de imágenes
    test('renderiza la imagen de la receta', () => {
        renderWithRouter(<MealSingle meal={mockMeal} />);
        
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '/pasta-carbonara.jpg');
        expect(image).toHaveAttribute('alt', 'Pasta Carbonara');
    });

    // Test 6: Formato de ingredientes y instrucciones
    test('formatea correctamente ingredientes y instrucciones', () => {
        const mealWithSpecialFormat = {
            ...mockMeal,
            ingredientes: ' ingrediente1 , ingrediente2 ',
            instrucciones: 'Paso 1. Paso 2. . Paso 3.'
        };
        
        renderWithRouter(<MealSingle meal={mealWithSpecialFormat} />);
        
        // Verificar limpieza de espacios en ingredientes
        expect(screen.getByText('ingrediente1')).toBeInTheDocument();
        expect(screen.getByText('ingrediente2')).toBeInTheDocument();
        
        // Verificar separación de instrucciones
        expect(screen.getByText(/Paso 1/)).toBeInTheDocument();
        expect(screen.getByText(/Paso 2/)).toBeInTheDocument();
        expect(screen.getByText(/Paso 3/)).toBeInTheDocument();
    });
}); 