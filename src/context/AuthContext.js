import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        setLoading(false);
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (correo, password) => {
        try {
            const response = await axios.post('/auth/login', { correo, password });
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Iniciando registro en AuthContext:', userData);
            
            const response = await axios.post('/auth/register', userData);
            console.log('Respuesta del servidor:', response.data);

            if (response.data.success) {
                const { token, user } = response.data.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                setUser(user);
                return { success: true };
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error en registro (AuthContext):', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Error al registrarse'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}; 