import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

// Mock del hook useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

// Mock de AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        register: jest.fn().mockImplementation((userData) => {
            if (userData.correo === 'test@example.com') {
                return Promise.resolve({ success: true });
            }
            return Promise.resolve({ 
                success: false, 
                message: 'Error al registrar usuario' 
            });
        })
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

const renderRegisterForm = () => {
    return render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );
};

describe('RegisterForm', () => {
    test('renderiza el formulario de registro correctamente', () => {
        renderRegisterForm();
        
        expect(screen.getByRole('heading', { name: 'Registro' })).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
        expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
        expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument();
    });

    test('valida campos requeridos', async () => {
        renderRegisterForm();
        const form = screen.getByTestId('register-form');
        
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(screen.getByText('Nombre y apellido son requeridos')).toBeInTheDocument();
        });
    });

    test('valida formato de correo electrónico', async () => {
        renderRegisterForm();
        const form = screen.getByTestId('register-form');
        
        const nombreInput = screen.getByLabelText('Nombre');
        const apellidoInput = screen.getByLabelText('Apellido');
        const emailInput = screen.getByLabelText('Correo Electrónico');

        fireEvent.change(nombreInput, { target: { value: 'Test' } });
        fireEvent.change(apellidoInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
        
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
        });
    });

    test('valida longitud mínima de contraseña', async () => {
        renderRegisterForm();
        const form = screen.getByTestId('register-form');
        
        const nombreInput = screen.getByLabelText('Nombre');
        const apellidoInput = screen.getByLabelText('Apellido');
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');

        fireEvent.change(nombreInput, { target: { value: 'Test' } });
        fireEvent.change(apellidoInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '12345' } });
        
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
        });
    });

    test('valida que las contraseñas coincidan', async () => {
        renderRegisterForm();
        const form = screen.getByTestId('register-form');
        
        const nombreInput = screen.getByLabelText('Nombre');
        const apellidoInput = screen.getByLabelText('Apellido');
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');

        fireEvent.change(nombreInput, { target: { value: 'Test' } });
        fireEvent.change(apellidoInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
        
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
        });
    });

    test('maneja el registro exitoso', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
        
        renderRegisterForm();
        const form = screen.getByTestId('register-form');
        
        const nombreInput = screen.getByLabelText('Nombre');
        const apellidoInput = screen.getByLabelText('Apellido');
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');

        fireEvent.change(nombreInput, { target: { value: 'Test' } });
        fireEvent.change(apellidoInput, { target: { value: 'User' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
}); 