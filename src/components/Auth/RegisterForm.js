import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            setError('Nombre y apellido son requeridos');
            return false;
        }

        if (!formData.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Correo electrónico inválido');
            return false;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Iniciando registro con datos:', formData);

        try {
            if (!validateForm()) {
                return;
            }

            const userData = {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                correo: formData.correo.trim().toLowerCase(),
                password: formData.password
            };

            console.log('Enviando datos al servidor:', userData);
            const result = await register(userData);
            console.log('Respuesta del servidor:', result);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            setError('Error al procesar el registro. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Registro</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Registrarse
                    </button>

                    <div className="auth-links">
                        <p>
                            ¿Ya tienes una cuenta?{' '}
                            <span onClick={() => navigate('/login')} className="link">
                                Iniciar Sesión
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm; 