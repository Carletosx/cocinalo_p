import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';

// Mock del hook useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

// Mock de AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn().mockImplementation((email, password) => {
            if (email === 'test@example.com' && password === 'password123') {
                return Promise.resolve({ success: true });
            }
            return Promise.resolve({ 
                success: false, 
                message: 'Error al iniciar sesión' 
            });
        })
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

const renderLoginForm = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('LoginForm', () => {
    // Test 1: Renderizado del formulario
    test('renderiza el formulario de login correctamente', () => {
        renderLoginForm();
        
        expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
        expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    });

    // Test 2: Manejo de cambios en los inputs
    test('actualiza los valores de los inputs correctamente', () => {
        renderLoginForm();
        
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    // Test 3: Manejo de errores
    test('muestra mensaje de error cuando falla el login', async () => {
        renderLoginForm();
        
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

        fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
        });
    });

    // Test 4: Validación de campos vacíos
    test('muestra error cuando los campos están vacíos', async () => {
        renderLoginForm();
        const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
        
        fireEvent.click(submitButton);
        
        // Verifica que los campos required funcionen
        const emailInput = screen.getByLabelText('Correo Electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    // Test 5: Validación de formato de email
    test('valida el formato del correo electrónico', () => {
        renderLoginForm();
        const emailInput = screen.getByLabelText('Correo Electrónico');
        
        fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
        expect(emailInput).toBeInvalid();
        
        fireEvent.change(emailInput, { target: { value: 'correo@valido.com' } });
        expect(emailInput).toBeValid();
    });

    // Test 6: Navegación al registro
    test('navega a la página de registro', () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
        
        renderLoginForm();
        const registerLink = screen.getByText('Regístrate aquí');
        
        fireEvent.click(registerLink);
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
}); 