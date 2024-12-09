import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarHeader from '../components/Calendar/CalendarHeader';

describe('CalendarHeader', () => {
    const mockOnPrevMonth = jest.fn();
    const mockOnNextMonth = jest.fn();
    
    const defaultProps = {
        currentDate: new Date(2024, 11, 8), // 8 de Diciembre 2024
        onPrevMonth: mockOnPrevMonth,
        onNextMonth: mockOnNextMonth
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renderizado básico
    test('renderiza el encabezado correctamente', () => {
        render(<CalendarHeader {...defaultProps} />);
        
        // Verifica el mes y año
        const headerText = screen.getByText('Diciembre 2024');
        expect(headerText).toBeInTheDocument();
        expect(headerText.tagName).toBe('H2');
        
        // Verifica botones de navegación
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });

    // Test 2: Navegación entre meses
    test('maneja la navegación entre meses correctamente', () => {
        render(<CalendarHeader {...defaultProps} />);
        
        const [prevButton, nextButton] = screen.getAllByRole('button');
        
        // Click en mes anterior
        fireEvent.click(prevButton);
        expect(mockOnPrevMonth).toHaveBeenCalledTimes(1);
        
        // Click en mes siguiente
        fireEvent.click(nextButton);
        expect(mockOnNextMonth).toHaveBeenCalledTimes(1);
    });

    // Test 3: Formato de fecha en diferentes meses
    test('muestra correctamente diferentes meses', () => {
        const { rerender } = render(<CalendarHeader {...defaultProps} />);
        expect(screen.getByText('Diciembre 2024')).toBeInTheDocument();

        // Enero
        rerender(
            <CalendarHeader 
                {...defaultProps} 
                currentDate={new Date(2024, 0, 1)} 
            />
        );
        expect(screen.getByText('Enero 2024')).toBeInTheDocument();

        // Julio
        rerender(
            <CalendarHeader 
                {...defaultProps} 
                currentDate={new Date(2024, 6, 1)} 
            />
        );
        expect(screen.getByText('Julio 2024')).toBeInTheDocument();
    });

    // Test 4: Clases CSS
    test('tiene las clases CSS correctas', () => {
        const { container } = render(<CalendarHeader {...defaultProps} />);
        
        expect(container.firstChild).toHaveClass('calendar-header');
        
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toHaveClass('month-nav-btn');
        });
    });

    // Test 5: Formato en español
    test('muestra los meses en español', () => {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        meses.forEach((mes, index) => {
            const { rerender } = render(
                <CalendarHeader 
                    {...defaultProps} 
                    currentDate={new Date(2024, index, 1)} 
                />
            );
            expect(screen.getByText(`${mes} 2024`)).toBeInTheDocument();
            rerender(<></>);
        });
    });
});