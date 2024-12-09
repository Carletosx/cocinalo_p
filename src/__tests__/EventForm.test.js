import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventForm from '../components/Calendar/EventForm';

describe('EventForm', () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();
    const defaultProps = {
        selectedDate: 8,
        currentDate: new Date(2024, 11, 8), // 8 de Diciembre 2024
        recipeName: '',
        onSubmit: mockOnSubmit,
        onClose: mockOnClose,
        isEditing: false,
        isViewOnly: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renderizado inicial
    test('renderiza el formulario correctamente', () => {
        render(<EventForm {...defaultProps} />);
        
        expect(screen.getByText('Agendar Receta')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre de la Receta')).toBeInTheDocument();
        expect(screen.getByLabelText('Hora Inicio')).toBeInTheDocument();
        expect(screen.getByLabelText('Hora Fin')).toBeInTheDocument();
        expect(screen.getByLabelText(/Ingredientes/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Instrucciones/)).toBeInTheDocument();
    });

    // Test 2: Modo edición
    test('muestra título de edición cuando isEditing es true', () => {
        render(<EventForm {...defaultProps} isEditing={true} />);
        expect(screen.getByText('Editar Receta')).toBeInTheDocument();
    });

    // Test 3: Envío del formulario
    test('envía el formulario con los datos correctos', async () => {
        render(<EventForm {...defaultProps} />);
        
        // Llenar el formulario
        fireEvent.change(screen.getByLabelText('Nombre de la Receta'), {
            target: { value: 'Pasta Carbonara' }
        });
        fireEvent.change(screen.getByLabelText('Hora Inicio'), {
            target: { value: '12:00' }
        });
        fireEvent.change(screen.getByLabelText('Hora Fin'), {
            target: { value: '13:00' }
        });
        fireEvent.change(screen.getByLabelText(/Ingredientes/), {
            target: { value: 'pasta, huevos, queso' }
        });
        fireEvent.change(screen.getByLabelText(/Instrucciones/), {
            target: { value: 'Hervir pasta. Mezclar ingredientes. Servir caliente.' }
        });

        // Enviar formulario
        const submitButton = screen.getByText('Guardar Receta');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Pasta Carbonara',
                timeFrom: '12:00',
                timeTo: '13:00',
                ingredients: ['pasta', 'huevos', 'queso'],
                instructions: ['Hervir pasta', 'Mezclar ingredientes', 'Servir caliente']
            }));
        });
    });

    // Test 4: Modo vista
    test('deshabilita los campos en modo vista', () => {
        render(<EventForm {...defaultProps} isViewOnly={true} />);
        
        expect(screen.getByLabelText('Nombre de la Receta')).toHaveAttribute('readOnly');
        expect(screen.getByLabelText('Hora Inicio')).toHaveAttribute('readOnly');
        expect(screen.getByLabelText('Hora Fin')).toHaveAttribute('readOnly');
        expect(screen.getByLabelText(/Ingredientes/)).toHaveAttribute('readOnly');
        expect(screen.getByLabelText(/Instrucciones/)).toHaveAttribute('readOnly');
        expect(screen.queryByText(/Guardar Receta/)).not.toBeInTheDocument();
    });

    // Test 5: Datos iniciales
    test('muestra datos iniciales correctamente', () => {
        const initialData = {
            title: 'Receta Existente',
            year: 2024,
            month: 12,
            day: 8,
            timeFrom: '14:00',
            timeTo: '15:00',
            ingredients: ['ingrediente1', 'ingrediente2'],
            instructions: ['paso1', 'paso2']
        };
        
        render(<EventForm {...defaultProps} initialData={initialData} isEditing={true} />);
        
        expect(screen.getByLabelText('Nombre de la Receta')).toHaveValue('Receta Existente');
        expect(screen.getByLabelText('Hora Inicio')).toHaveValue('14:00');
        expect(screen.getByLabelText('Hora Fin')).toHaveValue('15:00');
        expect(screen.getByLabelText(/Ingredientes/)).toHaveValue('ingrediente1, ingrediente2');
    });

    // Test 6: Función de cierre
    test('llama a onClose al hacer click en el botón de cerrar', () => {
        render(<EventForm {...defaultProps} />);
        
        const closeButton = screen.getByRole('button', { name: '' }); // El botón solo tiene un ícono
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalled();
    });
});