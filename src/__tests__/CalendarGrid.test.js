import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarGrid from '../components/Calendar/CalendarGrid';

describe('CalendarGrid', () => {
    const mockOnDateClick = jest.fn();
    const mockOnEventDelete = jest.fn();
    const mockOnEventView = jest.fn();
    const mockOnEventEdit = jest.fn();

    const defaultProps = {
        currentDate: new Date(2024, 11, 8), // 8 de Diciembre 2024
        events: [
            {
                id: 1,
                title: 'Desayuno Especial',
                day: 8,
                month: 12,
                year: 2024,
                timeFrom: '08:00',
                timeTo: '09:00',
                isCompleted: false
            }
        ],
        onDateClick: mockOnDateClick,
        onEventDelete: mockOnEventDelete,
        onEventView: mockOnEventView,
        onEventEdit: mockOnEventEdit
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renderizado básico
    test('renderiza la cuadrícula del calendario correctamente', () => {
        render(<CalendarGrid {...defaultProps} />);
        
        // Verifica los encabezados de días
        ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
            expect(screen.getByText(day)).toBeInTheDocument();
        });
    });

    // Test 2: Eventos en el calendario
    test('muestra los eventos con sus acciones', () => {
        render(<CalendarGrid {...defaultProps} />);
        
        // Verifica el título del evento
        expect(screen.getByText('Desayuno Especial')).toBeInTheDocument();
        
        // Verifica el horario
        expect(screen.getByText('🕒 08:00 - 09:00')).toBeInTheDocument();
        
        // Verifica los botones de acción
        expect(screen.getByTitle('Ver detalles')).toBeInTheDocument();
        expect(screen.getByTitle('Editar receta')).toBeInTheDocument();
        expect(screen.getByTitle('Eliminar receta')).toBeInTheDocument();
    });

    // Test 3: Acciones de eventos
    test('maneja las acciones de eventos correctamente', () => {
        render(<CalendarGrid {...defaultProps} />);
        
        // Click en ver
        fireEvent.click(screen.getByTitle('Ver detalles'));
        expect(mockOnEventView).toHaveBeenCalledWith(defaultProps.events[0]);
        
        // Click en editar
        fireEvent.click(screen.getByTitle('Editar receta'));
        expect(mockOnEventEdit).toHaveBeenCalledWith(defaultProps.events[0]);
        
        // Click en eliminar
        fireEvent.click(screen.getByTitle('Eliminar receta'));
        expect(mockOnEventDelete).toHaveBeenCalledWith(defaultProps.events[0].id);
    });

    // Test 4: Eventos completados
    test('muestra el ícono de completado para eventos finalizados', () => {
        const completedEvent = {
            ...defaultProps.events[0],
            isCompleted: true
        };
        
        render(<CalendarGrid {...defaultProps} events={[completedEvent]} />);
        
        const eventElement = screen.getByText('Desayuno Especial').closest('.event-item');
        expect(eventElement).toHaveClass('completed');
    });

    // Test 5: Formato de tiempo
    test('formatea correctamente diferentes formatos de tiempo', () => {
        const eventsWithDifferentTimeFormats = [
            {
                ...defaultProps.events[0],
                timeFrom: '09:00:00', // Con segundos
                timeTo: '10:00:00'
            }
        ];
        
        render(<CalendarGrid {...defaultProps} events={eventsWithDifferentTimeFormats} />);
        
        expect(screen.getByText('🕒 09:00 - 10:00')).toBeInTheDocument();
    });

    // Test 6: Ordenamiento de eventos
    test('ordena los eventos por hora de inicio', () => {
        const multipleEvents = [
            {
                id: 1,
                title: 'Evento Tardío',
                day: 8,
                month: 12,
                year: 2024,
                timeFrom: '14:00',
                timeTo: '15:00'
            },
            {
                id: 2,
                title: 'Evento Temprano',
                day: 8,
                month: 12,
                year: 2024,
                timeFrom: '09:00',
                timeTo: '10:00'
            }
        ];
        
        render(<CalendarGrid {...defaultProps} events={multipleEvents} />);
        
        const eventElements = screen.getAllByText(/Evento/);
        expect(eventElements[0].textContent).toBe('Evento Temprano');
        expect(eventElements[1].textContent).toBe('Evento Tardío');
    });
});