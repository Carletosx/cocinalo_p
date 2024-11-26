import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        correo: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login(formData.correo, formData.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            setError('Error al procesar el inicio de sesión');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className="auth-button">
                        Iniciar Sesión
                    </button>

                    <div className="auth-links">
                        <p>
                            ¿No tienes una cuenta?{' '}
                            <span onClick={() => navigate('/register')} className="link">
                                Regístrate aquí
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; 
