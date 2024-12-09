import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';

describe('ConfirmDialog', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    
    const defaultProps = {
        isOpen: true,
        message: '¿Estás seguro de que deseas eliminar esta receta?',
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renderizado básico
    test('renderiza el diálogo correctamente cuando está abierto', () => {
        render(<ConfirmDialog {...defaultProps} />);
        
        expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
        expect(screen.getByText('¿Estás seguro de que deseas eliminar esta receta?')).toBeInTheDocument();
        expect(screen.getByText('Eliminar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    // Test 2: No renderiza cuando está cerrado
    test('no renderiza el diálogo cuando isOpen es false', () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />);
        
        expect(screen.queryByText('Confirmar acción')).not.toBeInTheDocument();
    });

    // Test 3: Acción de confirmar
    test('llama a onConfirm cuando se hace click en Eliminar', () => {
        render(<ConfirmDialog {...defaultProps} />);
        
        fireEvent.click(screen.getByText('Eliminar'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    // Test 4: Acción de cancelar
    test('llama a onCancel cuando se hace click en Cancelar', () => {
        render(<ConfirmDialog {...defaultProps} />);
        
        fireEvent.click(screen.getByText('Cancelar'));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    // Test 5: Mensaje personalizado
    test('muestra el mensaje personalizado correctamente', () => {
        const customMessage = '¿Deseas eliminar este evento?';
        render(<ConfirmDialog {...defaultProps} message={customMessage} />);
        
        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    // Test 6: Clases CSS
    test('aplica las clases CSS correctamente', () => {
        const { container } = render(<ConfirmDialog {...defaultProps} />);
        
        expect(container.querySelector('.confirm-dialog-overlay')).toBeInTheDocument();
        expect(container.querySelector('.confirm-dialog')).toBeInTheDocument();
        expect(container.querySelector('.confirm-dialog-content')).toBeInTheDocument();
        expect(container.querySelector('.confirm-dialog-buttons')).toBeInTheDocument();
        expect(container.querySelector('.confirm-button')).toBeInTheDocument();
        expect(container.querySelector('.cancel-button')).toBeInTheDocument();
    });
});