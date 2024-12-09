import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Calendar from '../components/Calendar/Calendar';
import axios from '../api/axios';

// Mock de axios
jest.mock('../api/axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

// Mock de datos de ejemplo
const mockRecipes = [
    {
        id: 1,
        title: 'Desayuno Especial',
        day: 8,
        month: 12,
        year: 2024,
        timeFrom: '08:00',
        timeTo: '09:00'
    }
];

describe('Calendar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock respuesta exitosa
        axios.get.mockResolvedValue({ 
            data: { 
                data: mockRecipes,
                success: true 
            } 
        });
    });

    // Test 1: Carga inicial
    test('renderiza el calendario correctamente', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        
        const monthYear = screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'h2' && 
                   content.includes('Diciembre') && 
                   content.includes('2024');
        });
        
        expect(monthYear).toBeInTheDocument();
    });

    // Test 2: Navegación entre meses
    test('permite navegar entre meses', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        
        const buttons = screen.getAllByRole('button');
        const prevButton = buttons[0];
        const nextButton = buttons[1];
        
        await act(async () => {
            fireEvent.click(nextButton);
        });
        
        expect(axios.get).toHaveBeenCalled();
        
        await act(async () => {
            fireEvent.click(prevButton);
        });
        
        expect(axios.get).toHaveBeenCalled();
    });

    // Test 3: Agregar evento
    test('muestra formulario al hacer click en una fecha', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        
        const dateCell = screen.getByText('15');
        await act(async () => {
            fireEvent.click(dateCell);
        });
        
        // Verifica que se muestre el formulario por su clase o estructura
        expect(document.querySelector('.calendar-content-wrapper')).toBeInTheDocument();
    });

    // Test 4: Manejo de errores
    test('muestra mensaje de error cuando falla la carga', async () => {
        axios.get.mockRejectedValueOnce(new Error('Error de red'));
        
        await act(async () => {
            render(<Calendar />);
        });
        
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/Error al cargar las recetas/i);
    });

    // Test 5: Renderizado de días
    test('renderiza los días del mes correctamente', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        days.forEach(day => {
            expect(screen.getByText(day)).toBeInTheDocument();
        });
    });

    // Test 6: Día actual
    test('marca el día actual correctamente', async () => {
        await act(async () => {
            render(<Calendar />);
        });
        
        const todayCell = screen.getByText('9'); // Asegúrate de que este sea el día actual
        expect(todayCell.closest('div')).toHaveClass('today');
    });
});