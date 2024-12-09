import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import EventDetailView from '../components/Calendar/EventDetailView';

describe('EventDetailView', () => {
    const mockOnClose = jest.fn();
    const mockOnComplete = jest.fn();
    const mockOnDelete = jest.fn();
    
    const defaultProps = {
        event: {
            id: 1,
            title: 'Pasta Carbonara',
            timeFrom: '12:00',
            timeTo: '13:00',
            ingredients: ['pasta', 'huevos', 'queso parmesano'],
            instructions: ['Hervir la pasta', 'Preparar la salsa', 'Mezclar todo'],
            isCompleted: false
        },
        onClose: mockOnClose,
        onComplete: mockOnComplete,
        onDelete: mockOnDelete
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // Test 1: Renderizado básico
    test('renderiza los detalles del evento correctamente', () => {
        const { container } = render(<EventDetailView {...defaultProps} />);
        
        // Verificar título
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
        
        // Verificar horario (usando el contenedor completo)
        const timeSection = container.querySelector('.time-section p');
        expect(timeSection).toHaveTextContent('12:00');
        expect(timeSection).toHaveTextContent('13:00');
        
        // Verificar secciones principales
        expect(screen.getByText('Ingredientes')).toBeInTheDocument();
        expect(screen.getByText('Instrucciones')).toBeInTheDocument();
        expect(screen.getByText('Temporizador')).toBeInTheDocument();
        
        // Verificar contenido de ingredientes e instrucciones
        expect(screen.getByText('pasta')).toBeInTheDocument();
        expect(screen.getByText('Hervir la pasta')).toBeInTheDocument();
    });

    // Test 2: Temporizador
    test('maneja el temporizador correctamente', async () => {
        render(<EventDetailView {...defaultProps} />);
        
        // Iniciar temporizador
        const startButton = screen.getByText('Iniciar');
        await act(async () => {
            fireEvent.click(startButton);
            jest.advanceTimersByTime(1000);
        });

        // Verificar que el temporizador muestra 1 segundo
        expect(screen.getByText('00:01')).toBeInTheDocument();
        
        // Reiniciar temporizador
        const resetButton = screen.getByText('Reiniciar');
        await act(async () => {
            fireEvent.click(resetButton);
        });
        expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    // Test 3: Ingredientes checkeables
    test('maneja el checkeo de ingredientes', () => {
        render(<EventDetailView {...defaultProps} />);
        
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        
        expect(checkboxes[0]).toBeChecked();
        expect(screen.getByText('pasta').closest('span')).toHaveClass('ingredient-text checked');
    });

    // Test 4: Completar evento
    test('maneja la acción de completar correctamente', async () => {
        mockOnComplete.mockResolvedValueOnce();
        render(<EventDetailView {...defaultProps} />);
        
        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como completada'));
            await waitFor(() => {
                expect(mockOnComplete).toHaveBeenCalledWith(defaultProps.event.id);
            });
        });
    });

    // Test 5: Eliminar evento
    test('maneja la eliminación correctamente', async () => {
        mockOnDelete.mockResolvedValueOnce();
        render(<EventDetailView {...defaultProps} />);
        
        await act(async () => {
            fireEvent.click(screen.getByText('Eliminar'));
            await waitFor(() => {
                expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.event.id);
            });
        });
    });

    // Test 6: Formato de datos
    test('maneja diferentes formatos de datos correctamente', () => {
        const eventWithStringData = {
            ...defaultProps.event,
            ingredients: 'pasta,huevos,queso parmesano',
            instructions: 'Hervir la pasta. Preparar la salsa. Mezclar todo.'
        };
        
        render(<EventDetailView event={eventWithStringData} onClose={mockOnClose} onComplete={mockOnComplete} onDelete={mockOnDelete} />);
        
        expect(screen.getByText('pasta')).toBeInTheDocument();
        expect(screen.getByText('Hervir la pasta')).toBeInTheDocument();
    });
});